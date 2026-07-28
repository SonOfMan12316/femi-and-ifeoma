import type { Metadata } from "next";
import { Faqs } from "@/components/Faqs";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `FAQs · ${site.fullName}`,
  description: `Answers to common questions about ${site.fullName} — pricing, reservations, house rules, and more.`,
};

export default function FaqsPage() {
  return (
    <>
      <Nav />
      <main>
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
