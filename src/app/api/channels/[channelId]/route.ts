import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ channelId: string }> }
) {
  const { channelId } = await params;
  const body = await req.json();

  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  if (body.videos_per_day !== undefined) {
    fields.push(`videos_per_day = $${idx++}`);
    values.push(body.videos_per_day);
  }
  if (body.color !== undefined) {
    fields.push(`color = $${idx++}`);
    values.push(body.color);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  values.push(channelId);
  const { rows } = await pool.query(
    `UPDATE channels SET ${fields.join(", ")}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
    values
  );

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

  const result = await pool.query(
    "DELETE FROM channels WHERE id = $1 RETURNING id",
    [channelId]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Channel not found" }, { status: 404 });
  }

  return NextResponse.json({ deleted: true });
}
