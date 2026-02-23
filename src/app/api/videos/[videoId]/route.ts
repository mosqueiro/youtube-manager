import { NextRequest, NextResponse } from "next/server";
import { run } from "@/lib/db";

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

  run("UPDATE videos SET published_at = ? WHERE id = ?", [
    body.published_at,
    videoId,
  ]);

  return NextResponse.json({ success: true });
}
