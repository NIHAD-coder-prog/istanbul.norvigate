import { NextResponse } from "next/server";
import { formKinds, formSpecs, validateForm, type FormKind, type FormValues } from "@/lib/forms";
import { saveSubmission } from "@/lib/submissions";
import { listProducts } from "@/lib/repo";
import { rateLimited } from "@/lib/rate-limit";
import { isLocale } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_CHARS = 64 * 1024;
const HONEYPOT = "company_url";
const LIMIT = 12;
const WINDOW_MS = 10 * 60 * 1000;
const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  // Same-origin only.
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  if (origin && host) {
    try { if (new URL(origin).host !== host) return json({ ok: false, error: "forbidden" }, 403); } catch { return json({ ok: false, error: "forbidden" }, 403); }
  }
  if (!(request.headers.get("content-type") || "").includes("application/json")) return json({ ok: false, error: "unsupported" }, 415);

  // The rate-limit key lives only in memory; nothing about the client is stored on disk.
  const client = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  if (rateLimited(`submit:${client}`, LIMIT, WINDOW_MS)) return json({ ok: false, error: "rateLimited" }, 429);

  let text: string;
  try { text = await request.text(); } catch { return json({ ok: false, error: "badRequest" }, 400); }
  if (text.length > MAX_BODY_CHARS) return json({ ok: false, error: "tooLarge" }, 413);
  let body: { kind?: unknown; locale?: unknown; data?: unknown };
  try { body = JSON.parse(text); } catch { return json({ ok: false, error: "badRequest" }, 400); }

  if (typeof body.kind !== "string" || !(formKinds as string[]).includes(body.kind)) return json({ ok: false, error: "badRequest" }, 400);
  const kind = body.kind as FormKind;
  const locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "en";
  const raw = body.data && typeof body.data === "object" && !Array.isArray(body.data) ? (body.data as Record<string, unknown>) : {};

  // Honeypot: pretend success, store nothing.
  if (typeof raw[HONEYPOT] === "string" && (raw[HONEYPOT] as string).trim() !== "") return json({ ok: true, id: "NV-00000000-000000" });

  const known = new Set(formSpecs[kind].map((f) => f.name));
  const values: FormValues = {};
  for (const [key, v] of Object.entries(raw)) {
    if (!known.has(key)) continue;
    if (typeof v === "string" || typeof v === "boolean") values[key] = v;
    else if (typeof v === "number") values[key] = String(v);
  }
  const errors = validateForm(kind, values);
  const clean: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(values)) clean[key] = typeof v === "string" ? v.trim() : v;

  // Order requests: every line, price and weight is resolved from the catalogue on the server — never trusted from the browser.
  if (kind === "order") {
    const resolved = await resolveOrderLines(raw.lines);
    if (!resolved) errors.lines = "lines";
    else Object.assign(clean, { lines: resolved.lines, totalMinor: resolved.totalMinor, totalWeightGrams: resolved.totalWeightGrams, currency: "TRY", note: "order REQUEST — no payment taken" });
  }
  if (Object.keys(errors).length) return json({ ok: false, errors }, 422);
  try {
    const { id } = await saveSubmission(kind, locale, clean);
    return json({ ok: true, id });
  } catch (err) {
    console.error("[submit] could not store submission", err instanceof Error ? err.message : err);
    return json({ ok: false, error: "server" }, 500);
  }
}

export async function GET() { return json({ ok: false, error: "methodNotAllowed" }, 405); }

async function resolveOrderLines(input: unknown) {
  if (!Array.isArray(input) || input.length < 1 || input.length > 30) return null;
  const products = await listProducts();
  const lines: { productId: string; variantId: string; name: string; label: string; qty: number; unitMinor: number; weightGrams: number; dataStatus: string }[] = [];
  const seen = new Set<string>();
  for (const l of input) {
    const id = typeof l?.id === "string" ? l.id : "";
    const qty = Number(l?.qty);
    const [pid, vid] = id.split(":");
    if (!pid || !vid || seen.has(id) || !Number.isInteger(qty) || qty < 1 || qty > 20) return null;
    const product = products.find((p) => p.id === pid);
    const variant = product?.variants.find((v) => v.id === vid);
    if (!product || !variant) return null;
    seen.add(id);
    lines.push({ productId: pid, variantId: vid, name: product.name.en, label: variant.label.en, qty, unitMinor: variant.priceMinor, weightGrams: variant.weightGrams, dataStatus: product.dataStatus });
  }
  return { lines, totalMinor: lines.reduce((a, l) => a + l.unitMinor * l.qty, 0), totalWeightGrams: lines.reduce((a, l) => a + l.weightGrams * l.qty, 0) };
}
