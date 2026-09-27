import { Controller, Get, Query } from "@nestjs/common";
import { AvailabilityService } from "./availability.service";
import { PrismaService } from "../prisma/prisma.service";
import { AvailabilityDateDto, AvailabilityMonthDto } from "./dto/query-availability.dto";
import { ALL_DAY, ALL_DAY_LABEL, TIME_SLOTS } from "../common/schedule";

@Controller("availability")
export class AvailabilityController {
  constructor(
    private readonly availability: AvailabilityService,
    private readonly prisma: PrismaService,
  ) {}

  /** Which dates are bookable at all — past, Sundays and closures. */
  @Get("month")
  month(@Query() query: AvailabilityMonthDto) {
    return this.availability.forMonth(query.year, query.month);
  }

  /** The canonical slot list, so the frontend never hardcodes opening hours. */
  @Get("slots")
  slots() {
    return { slots: TIME_SLOTS, allDay: { value: ALL_DAY, label: ALL_DAY_LABEL } };
  }

  /**
   * Bookable times for a date. `planId` matters: whole-day passes (Co-Work)
   * return a single all-day entry instead of hourly slots.
   */
  @Get()
  async forDate(@Query() query: AvailabilityDateDto) {
    const plan = query.planId
      ? await this.prisma.plan.findUnique({ where: { id: query.planId } })
      : null;
    return this.availability.forDate(query.date, plan);
  }
}
