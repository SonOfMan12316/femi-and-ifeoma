// Seeds the plans table from the same data currently duplicated in
// frontend/src/lib/site.ts. Once this backend is live, site.ts should fetch
// from GET /plans instead of hardcoding — see DEC-013 in /docs/08-DECISIONS.md.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const plans = [
  {
    id: "playdate",
    name: "PlayDate",
    durationMins: 90,
    priceKobo: 1_000_000,
    perPerson: true,
    guestCount: null,
    description: "Cat play date. A relaxed 90 minutes with the cats.",
    schedule: "Every Wednesday",
  },
  {
    id: "solo-pass",
    name: "Solo Pass",
    durationMins: 60,
    priceKobo: 3_000_000,
    perPerson: true,
    guestCount: null,
    description:
      "1 chilled beverage (Nescafé cold coffee or Lipton iced tea), 1 treat (banana bread or cake parfait), 1 cat treat pack, free high-speed Wi-Fi.",
    schedule: null,
  },
  {
    id: "duo-pass",
    name: "Duo Pass",
    durationMins: 60,
    priceKobo: 5_800_000,
    perPerson: true,
    guestCount: 2,
    description:
      "2 guests · 2 chilled beverages, 1 shared dessert combo (banana bread + cake parfait), 2 cat treat packs.",
    schedule: null,
  },
  {
    id: "trio-pass",
    name: "Trio Pass",
    durationMins: 60,
    priceKobo: 8_500_000,
    perPerson: true,
    guestCount: 3,
    description: "3 chilled beverages, 1 shared dessert board (2 banana breads + 1 parfait), 3 cat treat packs.",
    schedule: null,
  },
  {
    id: "vip-group-pass",
    name: "VIP Group Pass",
    durationMins: 60,
    priceKobo: 14_000_000,
    perPerson: true,
    guestCount: 5,
    description:
      "5 chilled beverages, 2 shared dessert platters (mix of banana breads & parfaits), 5 cat treat packs.",
    schedule: null,
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      create: plan,
      update: plan,
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${plans.length} plans.`);
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
