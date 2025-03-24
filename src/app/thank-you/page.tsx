"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { use, useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: any;
  }
}

export default function ThankYou({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = use(searchParams);

  const { price } = params;

  useEffect(() => {
    if (window.fbq && price !== "" && price !== null && price !== undefined) {
      window.fbq("track", "Purchase", { currency: "USD", value: price });
    }
  }, [price]);

  return (
    <div className="flex flex-col items-center sm:mt-10 mt-5 gap-5 text-white">
      {price && (
        <h2 className="text-AmericanSilver font-ClashGroteskLight sm:text-xl text-base max-w-5xl font-semibold">
          Your Have Paid: ${price}
        </h2>
      )}

      <div className="p-5 text-center">
        <h1 className="text-Apricot lg:text-6xl md:text-5xl sm:text-4xl text-3xl font-Kugile py-5 font-semibold">
          Thank You
        </h1>
        <h2 className="text-AmericanSilver font-ClashGroteskLight sm:text-2xl text-lg max-w-5xl font-semibold">
          Your Trading Journey Starts Today!
        </h2>
        <h2 className="text-AmericanSilver font-ClashGroteskLight sm:text-2xl text-lg max-w-5xl font-semibold mt-2">
          You will receive confirmation of your order within 24 hours. Please
          make sure to check spam/junk folders. If 24 hours has passed, and you
          are yet to receive confirmation, contact support
        </h2>
      </div>

      <Link
        href={"https://heratradingcapital.com"}
        className={buttonVariants({
          className: "relative z-10",
        })}
      >
        Back To Homepage
      </Link>

      <div className=" relative -top-20 w-full">{/* <Community /> */}</div>
    </div>
  );
}
