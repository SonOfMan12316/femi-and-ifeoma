import { Controller, Headers, HttpCode, Post, RawBodyRequest, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";
import { PaymentsService } from "./payments.service";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  /**
   * Paystack webhook. This is the authoritative confirmation path — the
   * browser callback is only a convenience. Always answers 200 quickly once
   * the signature checks out, so Paystack doesn't retry a handled event.
   */
  @Post("paystack/webhook")
  @HttpCode(200)
  async paystackWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers("x-paystack-signature") signature?: string,
  ) {
    if (!this.payments.verifyWebhookSignature(req.rawBody, signature)) {
      throw new UnauthorizedException("Invalid Paystack signature");
    }
    return this.payments.handleWebhookEvent(req.body);
  }
}
