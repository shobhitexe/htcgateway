import CheckoutForm from "@/components/Checkout/CheckoutForm";
import React from "react";

const config: Record<string, number>[] = [
  {
    "5000": 17.5,
    "10000": 27.3,
    "25000": 90.3,
    "50000": 167.3,
    "100000": 335.3,
    "200000": 615.3,
    "300000": 839.3,
  },
  {
    "5000": 17.5,
    "10000": 27.3,
    "25000": 90.3,
    "50000": 167.3,
    "100000": 335.3,
    "200000": 615.3,
    "300000": 839.3,
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
