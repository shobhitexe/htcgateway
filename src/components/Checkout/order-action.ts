"use server";

import { RevolutSecretKey, RevolutURL } from "@/lib/env";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  postalCode: string;
  discountCode: string;
};

export async function CreateOrder(
  userData: UserData,
  step: string,
  account: string,
  price: number
) {
  try {
    const res = await fetch(`${RevolutURL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${RevolutSecretKey}`,
        "Revolut-Api-Version": "2024-09-01",
      },
      body: JSON.stringify({
        amount: price * 100,
        currency: "USD",
        metadata: {
          ...userData,
          step,
          account,
          price,
        },
      }),
    });

    if (res.status !== 201) {
      console.log(res);

      return "/";
    }

    const data = await res.json();

    return data.checkout_url;
  } catch (error) {
    console.log(error);

    return "/";
  }
}
