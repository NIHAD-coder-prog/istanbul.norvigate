import { NextResponse } from "next/server";
import { getRates } from "@/lib/currency/rates.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Indicative exchange rates (TRY base) for the currency switcher and converter.
 * Returns 503 with { ok: false } when there is nothing trustworthy to show, never made-up numbers.
 */
export async function GET() {
  const payload = await getRates();
  if (!payload) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.json(
    { ok: true, ...payload },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=600" } },
  );
}
