import { About } from "@/components/About";
import { Faqs } from "@/components/Faqs";
import { ContentBlock } from "@/components/ContentBlock";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { HouseRules } from "@/components/HouseRules";
import { MomentsGallery } from "@/components/MomentsGallery";
import { Nav } from "@/components/Nav";
import { plansFromPrice } from "@/lib/site";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <MomentsGallery />
        <ContentBlock
          eyebrow="Curious?"
          title="What in the world is a cat café?"
          body="Can I live here? Can I quit my job and work for you? How do you deal with all this cuteness in one place? Scroll on — we answer life's most pressing questions further down."
          image={{
            src: "/uploads/WhatsApp Image 2026-07-27 at 18.47.50.jpeg",
            alt: "Inside the café lounge",
          }}
        />
        <ContentBlock
          id="visit"
          reverse
          eyebrow="Visit us"
          title="Ready for a slow hour in Lagos?"
          body={`A Solo Pass is ₦30,000 for 60 minutes with a chilled drink, a treat and a cat treat pack. Prefer to work? The Co-Work Space is ₦${plansFromPrice.toLocaleString("en-NG")} a day, 10 AM – 8 PM. Reservations required. Walk-ins only if space opens up.`}
          ctaLabel="Book Your Visit"
          ctaHref="/book-your-visit"
          image={{
            src: "/uploads/WhatsApp Image 2026-07-27 at 18.47.50 (2).jpeg",
            alt: "Guest spending time with a café cat",
          }}
        />
        <About />
        <HouseRules />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
