import { NextResponse } from "next/server";

const TPBL_API_URL = "https://api.tpbl.basketball/api/seasons/2/games";

export async function GET() {
  try {
    const response = await fetch(TPBL_API_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `TPBL API request failed with ${response.status}` },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to fetch TPBL games" }, { status: 500 });
  }
}
