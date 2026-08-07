export const site = {
  name: "Fémi & Ifeoma",
  fullName: "Fémi & Ifeoma Cat Café",
  tagline: "First Cat Café in Nigeria",
  bookingUrl: "https://kindlybook.me/femiandifeoma",
  price: "₦30,000",
  sessionLength: "60-minute session",
  instagram: "https://instagram.com/femiandifeoma",
  founder: "@jasonthecatguy",
  location: "Surulere, Lagos, Nigeria",
  address: "31 Adetola Street, Aguda",
  addressCity: "Surulere, Lagos",
  /* Opens Google Maps directions with the café pre-filled as the destination,
     so the origin defaults to wherever the visitor is. */
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=31+Adetola+Street%2C+Aguda%2C+Surulere%2C+Lagos%2C+Nigeria",
  hours: "Monday – Saturday, 10AM – 5PM (GMT+1)",
  closed: "Closed Sundays",
  email: "hello@femiandifeoma.com",
  phone: "+234 706 484 7573",
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY ?? "",
  priceKobo: 3000000, // ₦30,000 in kobo
} as const;

export type Cat = {
  id: string;
  name: string;
  breed: string;
  quote: string;
  photo: string;
};

export const cats: Cat[] = [
  {
    id: "sid",
    name: "Sid",
    breed: "British Shorthair",
    quote: "Fan favorite. I judge quietly, love loudly.",
    photo: "/uploads/images.jpeg",
  },
  {
    id: "purrson",
    name: "Purr-son",
    breed: "Maine Coon",
    quote: "Biggest cat, biggest lap requirements.",
    photo: "/uploads/Maine Coon Cat 4_0.jpg",
  },
  {
    id: "biscuit",
    name: "Biscuit",
    breed: "Persian",
    quote: "High maintenance. Worth it.",
    photo: "/uploads/1.webp",
  },
  {
    id: "chaos",
    name: "Chaos",
    breed: "Scottish Fold",
    quote: "The name is accurate, unfortunately.",
    photo: "/uploads/images (1).jpeg",
  },
  {
    id: "honey",
    name: "Honey",
    breed: "British Longhair",
    quote: "Sweet by name, sweeter in person.",
    photo: "/uploads/IMG_6955.webp",
  },
  {
    id: "midnight",
    name: "Midnight",
    breed: "Bombay",
    quote: "Sleek, silent, always watching the door.",
    photo: "/uploads/IMG_4713.webp",
  },
];

export const faqs = [
  {
    question: "What is a cat café?",
    answer:
      "A calm space where you can sip something warm, work or unwind, and spend time with our resident cats: British Shorthairs, Maine Coons, Persians, and more.",
  },
  {
    question: "Do I need a reservation?",
    answer:
      "Yes. Reservations are required. Walk-ins are only possible if a session opens up, so booking ahead is the sure way in.",
  },
  {
    question: "How long is a visit?",
    answer: `Each booking is a ${site.sessionLength} for ${site.price} per person, with full lounge access and a complimentary drink on arrival.`,
  },
  {
    question: "Can children visit?",
    answer:
      "Visitors under 12 must be accompanied by an adult. Please book for everyone in your party.",
  },
  {
    question: "What if I need to reschedule?",
    answer:
      "Please reschedule at least 24 hours ahead so we can open the slot for someone else.",
  },
  {
    question: "Can I work from the café?",
    answer:
      "Yes. Bring your laptop every session includes use of the workstation for the full hour.",
  },
] as const;

export const houseRules = [
  "Reservations are required for every visit.",
  "Be gentle. Let the cats come to you.",
  "No flash photography or loud calls in the lounge.",
  "Food and drinks from outside are not allowed.",
  "Please wash or sanitize your hands before meeting the cats.",
  "Visitors under 12 must be with an adult.",
  "If a cat walks away, give them space.",
] as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/our-cats", label: "Our Cats" },
  { href: "/#about", label: "About Us" },
  { href: "/faqs", label: "FAQs" },
  { href: "/#rules", label: "House Rules" },
  { href: "/book-your-visit", label: "Book Your Visit" },
] as const;
