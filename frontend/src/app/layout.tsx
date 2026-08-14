import type { Metadata } from "next";
import "./globals.css";
import { PageLoader } from "@/components/PageLoader";

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
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Cormorant Garamond — editorial font, loaded at runtime to avoid build-time Google Fonts dependency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full overflow-x-hidden bg-cream font-sans text-black">
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
