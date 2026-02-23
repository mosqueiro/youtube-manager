import { NextRequest, NextResponse } from "next/server";
import { query, run } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;
  const body = await req.json();

  const fields: string[] = [];
  const values: unknown[] = [];

  if (body.videos_per_day !== undefined) {
    fields.push(`videos_per_day = ?`);
    values.push(body.videos_per_day);
  }
  if (body.color !== undefined) {
    fields.push(`color = ?`);
    values.push(body.color);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  values.push(channelId);
  run(
    `UPDATE channels SET ${fields.join(", ")}, updated_at = datetime('now') WHERE id = ?`,
    values
  );

  const rows = query("SELECT * FROM channels WHERE id = ?", [channelId]);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;

  const result = run("DELETE FROM channels WHERE id = ?", [channelId]);

  if (result.changes === 0) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
