import { Module } from "@nestjs/common";
import { BookingsController } from "./bookings.controller";
import { BookingsService } from "./bookings.service";
import { MembersModule } from "../members/members.module";

@Module({
  imports: [MembersModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
