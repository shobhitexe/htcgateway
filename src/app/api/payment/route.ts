import { RevolutSecretKey, RevolutURL } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

const config: Record<string, string>[] = [
  {
    "5000": "34bfa2bf-aa53-4f3c-ae82-d5c144433714",
    "10000": "976fcaec-2c1c-4cfa-a68d-8488a77f6a72",
    "25000": "027ce327-a9d6-4ce4-8ff2-c7d5725adca5",
    "50000": "7232c48b-f4f3-4c99-be3b-773269be320e",
    "100000": "28484fab-a812-4cc5-836f-20ec353582a9",
    "200000": "efeb820f-32c8-486d-b286-0dc8bf787a5c",
    "300000": "509f034b-e01e-456f-83c8-507f876225dc",
  },
  {
    "5000": "dbe602f8-b8ea-4040-8332-37cc39e0c53c",
    "10000": "b4bb0a56-5534-4a35-95f7-c6a677465801",
    "25000": "fc7d7407-766d-40f6-9231-2e4873572b40",
    "50000": "526b0ee3-d754-41b8-bdb6-fc01649e215b",
    "100000": "4bc8d6e6-4b4e-48a1-ac98-639dfdef2acf",
    "200000": "ec0d6120-6afd-413c-bec3-66a1a5b588a9",
    "300000": "76ae5ec9-f53f-4c6d-ae93-b7df10f0ea66",
  },
];

export async function POST(req: NextRequest) {
  try {
    const { event, order_id } = await req.json();

    if (event === "ORDER_COMPLETED") {
      const res = await fetch(`${RevolutURL}/api/orders/${order_id}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${RevolutSecretKey}`,
          "Revolut-Api-Version": "2024-09-01",
        },
      });

      const data: { metadata: CheckoutData } = await res.json();

      const accountUUID = await CheckForAlreadyCreatedAccount(
        data.metadata.email,
        process.env.DEFAULT_PASS as string,
        data.metadata.firstName,
        data.metadata.lastName
      );

      if (!accountUUID) {
        return NextResponse.json({ success: false }, { status: 500 });
      }

      const stepIndex = Number(data.metadata.step);
      if (stepIndex < 0 || stepIndex >= config.length) {
        console.error("Invalid step index:", stepIndex);
        return NextResponse.json({ success: false }, { status: 400 });
      }

      const challengeUUID = config[stepIndex]?.[data.metadata.account];
      if (!challengeUUID) {
        console.error("Invalid account value:", data.metadata.account);
        return NextResponse.json({ success: false }, { status: 400 });
      }

      const tradingAccountRes = await CreateNewTradingAccount(
        accountUUID,
        challengeUUID,
        `${data.metadata.firstName} ${data.metadata.lastName}`
      );

      return NextResponse.json(tradingAccountRes);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

async function CheckForAlreadyCreatedAccount(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const checkAccountRequest = await fetch(
    `https://broker-api-prop.match-trade.com/v1/accounts/by-email/${email}`,
    {
      method: "POST",
      headers: { Authorization: process.env.MATCHTRADER_KEY || "" },
    }
  );

  if (!checkAccountRequest.ok) {
    console.error("Failed to check account:", await checkAccountRequest.text());
    return "";
  }

  const checkAccountData = await checkAccountRequest.json();
  if (checkAccountData.uuid) {
    return checkAccountData.uuid;
  }

  const res = await fetch(
    `https://broker-api-prop.match-trade.com/v1/accounts`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.MATCHTRADER_KEY || "",
      },
      body: JSON.stringify({
        email,
        password,
        personalDetails: {
          firstname: firstName,
          lastname: lastName,
        },
        createAsDepositedAccount: true,
      }),
    }
  );

  const data = await res.json();
  return data.uuid;
}

async function CreateNewTradingAccount(
  accUUID: string,
  challengeUUID: string,
  name: string
) {
  const res = await fetch(
    `https://broker-api-prop.match-trade.com/v1/prop/accounts?instantlyActive=true&phaseStep=1`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.MATCHTRADER_KEY || "",
      },
      body: JSON.stringify({
        challengeId: challengeUUID,
        accountUuid: accUUID,
        name,
      }),
    }
  );

  return await res.json();
}
