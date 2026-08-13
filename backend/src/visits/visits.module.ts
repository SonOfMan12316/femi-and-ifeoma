import { Module } from "@nestjs/common";
import { VisitsController } from "./visits.controller";
import { VisitsService } from "./visits.service";
import { MembersModule } from "../members/members.module";

@Module({
  imports: [MembersModule],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
