import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  forwardRef,
} from "@nestjs/common";
import { createHmac, timingSafeEqual } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service";
import { BookingsService } from "../bookings/bookings.service";

const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: { status: string; amount: number; reference: string };
};

type PaystackWebhookEvent = {
  event: string;
  data?: { reference?: string; amount?: number; status?: string };
};

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => BookingsService))
    private readonly bookings: BookingsService,
  ) {}

  /**
   * Constant-time check of Paystack's `x-paystack-signature`: HMAC-SHA512 of
   * the *raw* request body keyed with the secret key. Must run against the
   * unparsed bytes — re-serialising the parsed JSON changes the digest.
   */
  verifyWebhookSignature(rawBody: Buffer | undefined, signature: string | undefined): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      this.logger.error("PAYSTACK_SECRET_KEY unset — rejecting webhook");
      return false;
    }
    if (!rawBody || !signature) return false;

    const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
    const received = Buffer.from(signature, "utf8");
    const computed = Buffer.from(expected, "utf8");
    // timingSafeEqual throws on a length mismatch, so guard it first.
    return received.length === computed.length && timingSafeEqual(received, computed);
  }

  /** Handle a signature-verified webhook. Unknown events are ignored, not errors. */
  async handleWebhookEvent(event: PaystackWebhookEvent) {
    if (event.event !== "charge.success") {
      this.logger.log(`Ignoring Paystack event "${event.event}"`);
      return { handled: false };
    }

    const reference = event.data?.reference;
    const amount = event.data?.amount;
    if (!reference || typeof amount !== "number") {
      throw new BadRequestException("Paystack event is missing reference or amount");
    }

    await this.bookings.confirmByReference(reference, amount);
    return { handled: true };
  }

  /**
   * Browser-callback path: the guest shouldn't stare at a spinner waiting for
   * a webhook. We ask Paystack directly rather than trusting the callback,
   * then funnel into the same idempotent confirmation as the webhook.
   */
  async verifyBookingPayment(bookingId: string, paystackReference?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException(`Booking "${bookingId}" not found`);
    if (booking.paymentStatus === "paid") {
      return this.bookings.findOne(bookingId);
    }

    // Paystack's callback reference is the authority: it names the transaction
    // that exists on their side. Ours should match, but if the reference we
    // sent was ever dropped, trusting our own would verify a transaction that
    // was never created.
    const reference = paystackReference ?? booking.paymentReference;
    if (!reference) {
      throw new BadRequestException("Booking has no payment reference");
    }
    if (reference !== booking.paymentReference) {
      this.logger.warn(
        `Booking ${bookingId} was paid under Paystack reference ${reference}, ` +
          `not ours (${booking.paymentReference}); adopting Paystack's.`,
      );
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { paymentReference: reference },
      });
    }

    const transaction = await this.fetchTransaction(reference);
    if (transaction.status !== "success") {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: "failed", status: "cancelled", holdExpiresAt: null },
      });
      throw new BadRequestException(`Payment was not successful (${transaction.status}).`);
    }

    return this.bookings.confirmByReference(reference, transaction.amount);
  }

  private async fetchTransaction(reference: string) {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      throw new ServiceUnavailableException("Payment verification is not configured");
    }

    let response: Response;
    try {
      response = await fetch(`${PAYSTACK_VERIFY_URL}/${encodeURIComponent(reference)}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
    } catch (err) {
      this.logger.error(`Could not reach Paystack to verify ${reference}: ${String(err)}`);
      throw new ServiceUnavailableException("Could not reach Paystack to verify the payment");
    }

    const body = (await response.json().catch(() => null)) as PaystackVerifyResponse | null;

    if (!response.ok) {
      const detail = body?.message ?? `HTTP ${response.status}`;
      this.logger.error(`Paystack verify ${reference} returned ${response.status}: ${detail}`);
      // 5xx (and only 5xx) means Paystack itself is having trouble and a retry
      // might help. A 4xx is a definitive answer about this transaction.
      if (response.status >= 500) {
        throw new ServiceUnavailableException("Paystack is unavailable right now. Please try again.");
      }
      throw new BadRequestException(`Paystack could not verify this payment: ${detail}`);
    }

    if (!body?.status || !body.data) {
      throw new BadRequestException(body?.message || "Paystack could not verify that payment");
    }
    return body.data;
  }
}
