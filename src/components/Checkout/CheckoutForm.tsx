"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

import { CreateOrder } from "./order-action";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: any;
  }
}

export default function CheckoutForm({
  step,
  account,
  price,
}: {
  step: string;
  account: string;
  price: number;
}) {
  // const searchParams = useSearchParams();
  const router = useRouter();

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
    postalCode: "",
    discountCode: "",
    password: "",
  });

  const [discountApplied, setDiscountApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }

  const initializeCheckout = async () => {
    try {
      const res = await CreateOrder(
        userData,
        step,
        account,
        Number(price) * (1 - discount / 100)
      );

      window.fbq("track", "InitiateCheckout", {
        value: Number(price) * (1 - discount / 100),
        currency: "USD",
      });

      router.push(res);
    } catch (error) {
      console.error("Revolut initialization failed:", error);
      alert("Failed to initialize Revolut Checkout.");
    }
  };

  async function checkDiscountCode() {
    try {
      const res = await fetch(
        `/api/discount?code=${userData.discountCode.toUpperCase()}`,
        {
          method: "GET",
        }
      );

      if (res.status !== 200) {
        // toast({ description: "Invalid Code", variant: "destructive" });
        throw new Error("Error fetching discount details");
      }

      const _res = await res.json();

      console.log(_res);

      // toast({
      //   title: "Discount code applied",
      //   description: `${_res.data.name}`,
      // });
      setDiscount(_res.percentage || 0);
      setDiscountApplied(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form
      id="challenges"
      className="md:w-[70%] w-[90%] mx-auto sm:my-14 my-10 flex flex-col sm:gap-10 gap-5 text-white"
      action={initializeCheckout}
    >
      {/* <Heading>Billing Details</Heading> */}
      <div className="flex md:flex-row flex-col gap-5">
        {" "}
        <div className="flex flex-col lg:basis-3/4 md:basis-2/3 gap-5 sm:p-5 p-3 rounded-2xl bg-[#14081F] border border-[#8903FF]">
          <div className="flex items-center gap-5">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="firstName" className="text-white">
                First name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={userData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="lastName" className="text-white">
                Last name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={userData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={userData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="city" className="text-white">
                City
              </Label>
              <Input
                id="city"
                name="city"
                type="text"
                value={userData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="country" className="text-white">
                Country
              </Label>
              <Input
                id="country"
                name="country"
                type="country"
                required
                value={userData.country}
                onChange={handleChange}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="postalCode" className="text-white">
                Postal Code
              </Label>
              <Input
                id="postalCode"
                name="postalCode"
                type="text"
                value={userData.postalCode}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-end gap-5">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password" className="text-white">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="text"
                value={userData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="flex items-end gap-5">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="discountCode" className="text-white">
                Discount Code
              </Label>
              <Input
                id="discountCode"
                name="discountCode"
                type="text"
                value={userData.discountCode}
                disabled={discountApplied}
                onChange={handleChange}
              />
            </div>
            <Button type="button" onClick={() => checkDiscountCode()}>
              Apply
            </Button>
          </div>

          <div className="flex flex-col justify-start items-start gap-5">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="cursor-pointer h-4 w-4 accent-[#5532C7]"
                required
              />
              <div className="sm:text-base text-sm text-[#A0A0A0]">
                I declare that I have read and agree to the Cancellation and
                Refund Policy.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="cursor-pointer h-4 w-4 accent-[#5532C7]"
                required
              />
              <div className="sm:text-base text-sm text-[#A0A0A0]">
                I declare that I have read and agree to the Terms of Use and
                Privacy Policy
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:gap-5 gap-3 lg:basis-1/4 md:basis-1/3 text-white">
          <div className="md:text-3xl sm:text-2xl text-xl text-white">
            Your Order :
          </div>
          <div className="flex flex-col gap-5 sm:p-5 p-4 rounded-2xl bg-[#14081F] border border-[#8903FF]">
            <div className="flex items-center justify-between font-semibold">
              <div>Step</div>
              <div>{step}</div>
            </div>
            <Break />
            <div className="flex items-center justify-between font-semibold">
              <div>Account Size</div>
              <div>${Number(account).toLocaleString()}</div>
            </div>
            <Break />

            <div className="flex items-center justify-between font-semibold">
              <div>Total</div>
              <div
                id="checkout-total"
                data-value={(Number(price) * (1 - discount / 100)).toFixed(2)}
              >
                ${(Number(price) * (1 - discount / 100)).toFixed(2)}
              </div>
            </div>

            <Button variant={"default"}>Place Order</Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Break() {
  return <div className="border border-purple-900"></div>;
}
