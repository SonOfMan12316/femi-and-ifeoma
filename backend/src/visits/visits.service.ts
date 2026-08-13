import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MembersService } from "../members/members.service";
import { CreateVisitDto } from "./dto/create-visit.dto";

@Injectable()
export class VisitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly members: MembersService,
  ) {}

  /**
   * Workspace / repeat-visit flow from 12-BOOKING_MEMBERSHIP_SCHEMA.md: an
   * existing member walks in and uses the workspace without a new paid
   * booking. Staff looks them up first (MembersService.findByEmailOrPhone),
   * then logs the visit here — no booking_id attached.
   */
  async logCheckIn(dto: CreateVisitDto) {
    const member = await this.members.findByEmailOrPhone(dto.memberQuery);

    await this.members.upsertOnVisit({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone ?? undefined,
      marketingOptIn: member.marketingOptIn,
    });

    return this.prisma.visit.create({
      data: { memberId: member.id, visitType: dto.visitType },
    });
  }
}
