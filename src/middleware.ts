import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|images/).*)"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for setup-related routes and API routes (except checking setup)
  if (
    pathname === "/setup" ||
    pathname.startsWith("/api/setup") ||
    pathname.startsWith("/api/auth/callback")
  ) {
    return NextResponse.next();
  }

  // Dynamically import db to avoid edge runtime issues
  try {
    const { ensureTables, queryOne } = await import("@/lib/db");
    ensureTables();
    const row = queryOne<{ value: string }>(
      "SELECT value FROM settings WHERE key = ?",
      ["google_client_id"]
    );
    const configured = !!row?.value;

    if (!configured) {
      return NextResponse.redirect(new URL("/setup", req.url));
    }
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}
