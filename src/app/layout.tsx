import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OfferStrip from "@/components/OfferStrip";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Checkout | Hera trading capital",
  description: "Hera Trading Capital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OfferStrip />

        <Image
          src={"/logo.png"}
          alt={"logo"}
          className="mx-auto mt-4 sm:w-[20%] w-[45%]"
          width={340}
          height={90}
        />

        {children}
      </body>
    </html>
  );
}
