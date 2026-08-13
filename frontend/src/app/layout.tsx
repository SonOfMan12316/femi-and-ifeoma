import type { Metadata } from "next";
import { Poppins, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { PageLoader } from "@/components/PageLoader";

const poppins = Poppins({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fémi & Ifeoma Cat Café",
  description:
    "Nigeria's first cat café in Lagos. Relax, purr, and find community with Sid, Purr-son, and friends.",
  openGraph: {
    title: "Fémi & Ifeoma Cat Café",
    description:
      "Nigeria's first cat café. Slow afternoons with Maine Coons, Persians, and more in Victoria Island, Lagos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${cormorantGaramond.variable} h-full antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-cream font-sans text-black">
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
