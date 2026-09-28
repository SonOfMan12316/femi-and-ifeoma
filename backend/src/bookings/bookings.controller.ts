import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { PaymentsService } from "../payments/payments.service";
import { CreateBookingDto } from "./dto/create-booking.dto";
import { VerifyBookingDto } from "../payments/dto/verify-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(
    private readonly bookings: BookingsService,
    private readonly payments: PaymentsService,
  ) {}

  /**
   * Creates a *pending* booking holding its seats, and returns the reference
   * and amount the frontend must hand to Paystack. The browser never chooses
   * the amount (DEC-018).
   */
  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookings.create(dto);
  }

  /**
   * Called from the Paystack `callback` so the guest sees a real confirmation
   * without waiting on the webhook. Verifies the transaction server-side
   * against Paystack; idempotent with the webhook path.
   */
  @Post(":id/verify")
  verify(@Param("id") id: string, @Body() dto: VerifyBookingDto) {
    return this.payments.verifyBookingPayment(id, dto.paystackReference);
  }

  /** Paystack `onClose` — the guest backed out, so free the seats now. */
  @Post(":id/release")
  release(@Param("id") id: string) {
    return this.bookings.release(id);
  }

  @Get()
  findAll() {
    return this.bookings.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookings.findOne(id);
  }
}
