import { NextRequest, NextResponse } from "next/server";

const DiscountMap: Record<string, number> = { HERA30: 30, MM99: 99 };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code === null) {
    return NextResponse.json(
      { success: false, percentage: 0 },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, percentage: DiscountMap[code] });
}
