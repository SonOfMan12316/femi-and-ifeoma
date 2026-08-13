import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export type UpsertMemberInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  marketingOptIn: boolean;
};

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The core "booking creates membership" rule (see /docs/12-BOOKING_MEMBERSHIP_SCHEMA.md).
   * Called by BookingsService on payment confirmation and by VisitsService on a
   * workspace check-in. Matches by email; creates the member on first sight,
   * otherwise refreshes their contact details and touches their visit stats.
   */
  async upsertOnVisit(input: UpsertMemberInput) {
    const now = new Date();
    return this.prisma.member.upsert({
      where: { email: input.email },
      create: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        marketingOptIn: input.marketingOptIn,
        totalVisits: 1,
        firstVisitAt: now,
        lastVisitAt: now,
      },
      update: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        totalVisits: { increment: 1 },
        lastVisitAt: now,
      },
    });
  }

  findAll() {
    return this.prisma.member.findMany({ orderBy: { lastVisitAt: "desc" } });
  }

  async findByEmailOrPhone(query: string) {
    const member = await this.prisma.member.findFirst({
      where: { OR: [{ email: query }, { phone: query }] },
    });
    if (!member) throw new NotFoundException(`No member found for "${query}"`);
    return member;
  }

  /** Mailing-list export for email/campaign tools — see 12-BOOKING_MEMBERSHIP_SCHEMA.md. */
  findMarketingOptIns() {
    return this.prisma.member.findMany({
      where: { marketingOptIn: true },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        totalVisits: true,
        lastVisitAt: true,
      },
    });
  }
}
