import { Module, forwardRef } from "@nestjs/common";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { BookingHoldSweeper } from "./booking-hold.sweeper";
import { MembersModule } from "../members/members.module";
import { EmailModule } from "../email/email.module";
import { AvailabilityModule } from "../availability/availability.module";
import { PaymentsModule } from "../payments/payments.module";

@Module({
  // forwardRef: payments confirms bookings, and the bookings controller calls
  // payments to verify a transaction — a genuine two-way dependency.
  imports: [MembersModule, EmailModule, AvailabilityModule, forwardRef(() => PaymentsModule)],
  controllers: [BookingsController],
  providers: [BookingsService, BookingHoldSweeper],
  exports: [BookingsService],
})
export class BookingsModule {}
