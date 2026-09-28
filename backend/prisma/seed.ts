// Seeds the plans table. Mirrors frontend/src/lib/site.ts — keep the two in
// sync until the frontend fetches from GET /plans (see DEC-013).
//
// Retired plans are deactivated, never deleted: confirmed bookings reference
// them by foreign key, and deleting the row would orphan a real customer's
// booking history.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const plans = [
  {
    id: "solo-pass",
    name: "Solo Pass for the Cat Cafe",
    durationMins: 60,
    priceKobo: 3_000_000, // ₦30,000
    perPerson: true,
    guestCount: null,
    description:
      "1 chilled beverage (choice of Nescafé Cold Coffee or Lipton Iced Tea, served over ice), 1 treat (choice of banana bread or cake parfait), 1 cat treat pack, free high-speed Wi-Fi.",
    schedule: null,
    bookingType: "cafe_visit" as const,
  },
  {
    id: "cowork-space",
    name: "Co-Work Space",
    // A day pass: the guest books a date and comes when they like between
    // 10 AM and 8 PM, so the duration is the opening day, not a session.
    durationMins: 600,
    priceKobo: 600_000, // ₦6,000 per person, per day
    perPerson: true,
    guestCount: null,
    description:
      "Co-work with cats. A relaxed, cat-friendly space to work, study, take meetings or get things done. ₦6,000/day, 10 AM – 8 PM, Monday – Saturday. Free Wi-Fi. Bring your laptop, find a spot, get to work with cats around.",
    schedule: "Monday – Saturday, 10 AM – 8 PM",
    // Drives the whole-day booking path — no time slot (DEC-020).
    bookingType: "workspace" as const,
  },
];

/** Retired in DEC-020. Deactivated so existing bookings keep their plan. */
const retiredPlanIds = ["playdate", "duo-pass", "trio-pass", "vip-group-pass"];

async function main() {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      create: { ...plan, active: true },
      update: { ...plan, active: true },
    });
  }

  const { count } = await prisma.plan.updateMany({
    where: { id: { in: retiredPlanIds } },
    data: { active: false },
  });

  // eslint-disable-next-line no-console
  console.log(`Seeded ${plans.length} active plans; deactivated ${count} retired plan(s).`);
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
