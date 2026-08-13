import { Controller, Get, Query } from "@nestjs/common";
import { MembersService } from "./members.service";

@Controller("members")
export class MembersController {
  constructor(private readonly members: MembersService) {}

  // Staff lookup screen for workspace check-ins: GET /members/lookup?q=email-or-phone
  @Get("lookup")
  lookup(@Query("q") q: string) {
    return this.members.findByEmailOrPhone(q);
  }

  @Get("marketing-export")
  marketingExport() {
    return this.members.findMarketingOptIns();
  }

  @Get()
  findAll() {
    return this.members.findAll();
  }
}
