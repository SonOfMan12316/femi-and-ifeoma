import { Body, Controller, Post } from "@nestjs/common";
import { VisitsService } from "./visits.service";
import { CreateVisitDto } from "./dto/create-visit.dto";

@Controller("visits")
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Post("check-in")
  checkIn(@Body() dto: CreateVisitDto) {
    return this.visits.logCheckIn(dto);
  }
}
