import { RevolutSecretKey, RevolutURL } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const { event, order_id } = await req.json();

    if (event === "ORDER_COMPLETED") {
      try {
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
          data.metadata.email
        );

        if (accountUUID !== "") {
          const res = await CreateNewTradingAccount(
            accountUUID,
            "dbe602f8-b8ea-4040-8332-37cc39e0c53c",
            data.metadata.firstName + data.metadata.lastName
          );

          console.log(res);
        } else {
        }
      } catch (error) {
        console.log(error);
        return Response.json({ status: 200 });
      }
    }

    return Response.json({ status: 200 });
  } catch (error) {
    console.log(error);

    return Response.json({ status: 200 });
  }
}

async function CheckForAlreadyCreatedAccount(email: string) {
  const checkAccountRequest = await fetch(
    `https://broker-api-prop.match-trade.com/v1/accounts/by-email/${email}`,
    {
      headers: { Authorization: process.env.MATCHTRADER_KEY || "" },
    }
  );

  const checkAccountData = await checkAccountRequest.json();

  return checkAccountData.uuid;
}

async function CreateNewTradingAccount(
  accUUID: string,
  challengeUUID: string,
  name: string
) {
  const res = await fetch(
    `https://broker-api-prop.match-trade.com/v1/prop/accounts?instantlyActive=false&phaseStep=1`,
    {
      method: "POST",
      headers: { Authorization: process.env.MATCHTRADER_KEY || "" },
      body: JSON.stringify({
        challengeId: challengeUUID,
        accountUuid: accUUID,
        name: name,
      }),
    }
  );

  const data = await res.json();

  return data;
}
