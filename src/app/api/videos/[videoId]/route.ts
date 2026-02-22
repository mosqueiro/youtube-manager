import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  const body = await req.json();

  if (!body.published_at) {
    return NextResponse.json(
      { error: "published_at is required" },
      { status: 400 }
    );
  }

  await pool.query("UPDATE videos SET published_at = $1 WHERE id = $2", [
    body.published_at,
    videoId,
  ]);

  return NextResponse.json({ success: true });
}
