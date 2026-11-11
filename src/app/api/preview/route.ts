import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

/** Owner-only: /api/preview?key=<NORVIGATE_PREVIEW_KEY> shows every feature to this browser only; ?off=1 turns it off. */
export function GET(request: Request) {
  const url = new URL(request.url);
  const expected = process.env.NORVIGATE_PREVIEW_KEY;
  const res = NextResponse.redirect(new URL("/", url.origin), 307);
  res.headers.set("Cache-Control", "no-store");
  if (url.searchParams.get("off")) { res.cookies.set("NV_PREVIEW", "", { path: "/", maxAge: 0 }); return res; }
  if (!expected || url.searchParams.get("key") !== expected) return new NextResponse("Not found", { status: 404 });
  res.cookies.set("NV_PREVIEW", expected, { path: "/", httpOnly: true, sameSite: "lax", secure: url.protocol === "https:", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
