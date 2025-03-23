import CheckoutForm from "@/components/Checkout/CheckoutForm";
import React from "react";

const config: Record<string, number>[] = [
  {
    "5000": 25,
    "10000": 39,
    "25000": 129,
    "50000": 239,
    "100000": 479,
    "200000": 879,
    "300000": 1199,
  },
  {
    "5000": 25,
    "10000": 39,
    "25000": 129,
    "50000": 239,
    "100000": 479,
    "200000": 879,
    "300000": 1199,
  },
];

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function page({ searchParams }: PageProps) {
  const { step, account } = await searchParams;

  if (!step || !account) {
    return (
      <div className="flex justify-center py-20 text-white">Invalid Config</div>
    );
  }

  return (
    <CheckoutForm step={step} account={account} price={config[0][account]} />
  );
}
