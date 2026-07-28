import type { Metadata } from "next";
import { Cats } from "@/components/Cats";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Our Cats · ${site.fullName}`,
  description: `Meet the resident cats of ${site.fullName} — British Shorthairs, Maine Coons, Persians, and more.`,
};

export default function OurCatsPage() {
  return (
    <>
      <Nav />
      <main>
        <Cats />
      </main>
      <Footer />
    </>
  );
}
