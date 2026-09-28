import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminKeyGuard } from "./admin-key.guard";
import { AvailabilityDateDto } from "../availability/dto/query-availability.dto";

@Controller("admin")
@UseGuards(AdminKeyGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  /** GET /admin/bookings?date=YYYY-MM-DD — the day sheet for staff. */
  @Get("bookings")
  daySheet(@Query() query: AvailabilityDateDto) {
    return this.admin.daySheet(query.date);
  }
}
