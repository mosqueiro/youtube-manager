import { NextRequest, NextResponse } from "next/server";
import { ensureTables, queryOne, run } from "@/lib/db";

export async function GET() {
  ensureTables();
  const row = queryOne<{ value: string }>(
    "SELECT value FROM settings WHERE key = ?",
    ["google_client_id"]
  );
  return NextResponse.json({ configured: !!row?.value });
}

export async function POST(req: NextRequest) {
  ensureTables();
  const { clientId, clientSecret } = await req.json();

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "clientId and clientSecret are required" },
      { status: 400 }
    );
  }

  run(
    `INSERT INTO settings (key, value) VALUES ('google_client_id', ?)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
    [clientId]
  );
  run(
    `INSERT INTO settings (key, value) VALUES ('google_client_secret', ?)
     ON CONFLICT (key) DO UPDATE SET value = excluded.value`,
    [clientSecret]
  );

  return NextResponse.json({ success: true });
}
