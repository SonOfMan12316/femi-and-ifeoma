import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { CreateBookingDto, ConfirmBookingDto } from "./dto/create-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@Body() dto: CreateBookingDto) {
    return this.bookings.create(dto);
  }

  // Called by the Paystack webhook handler once a payment event is verified.
  // TODO: verify the Paystack signature (x-paystack-signature header against
  // PAYSTACK_SECRET_KEY) before trusting this payload — not yet implemented.
  @Post(":id/confirm")
  confirm(@Param("id") id: string, @Body() dto: ConfirmBookingDto) {
    return this.bookings.confirm(id, dto);
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
