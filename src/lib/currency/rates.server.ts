import "server-only";
import { BASE_CURRENCY, type RatesPayload } from "./types";

/**
 * Exchange-rate provider adapter (server only).
 *
 * Source: ExchangeRate-API open-access endpoint (https://www.exchangerate-api.com/docs/free).
 *  - No API key. Rates are published once per day; the provider asks callers to cache.
 *  - Terms require visible attribution on pages that use the rates ("Rates By Exchange Rate API") and forbid
 *    redistributing the data, so NORVIGATE exposes converted amounts, not a rate feed for others to reuse.
 *
 * NORVIGATE never invents a rate. If the provider cannot be reached and nothing usable is saved, callers get
 * `ok: false` and the UI says so.
 *
 * To switch provider, keep this function's signature and return a RatesPayload with TRY as the base.
 * NORVIGATE_RATES_URL can point at a mirror or, in tests, at a local fixture server.
 */
const DEFAULT_URL = `https://open.er-api.com/v6/latest/${BASE_CURRENCY}`;
const TTL_MS = 6 * 3600 * 1000; // refresh at most every 6 hours (the provider updates daily)
const MAX_STALE_MS = 7 * 24 * 3600 * 1000; // never serve rates older than a week
const TIMEOUT_MS = 8000;

let saved: { payload: RatesPayload; at: number } | null = null;
let inflight: Promise<RatesPayload | null> | null = null;

function isPositiveNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v > 0;
}

function unixToIso(v: unknown): string | undefined {
  return typeof v === "number" && v > 0 ? new Date(v * 1000).toISOString() : undefined;
}

export function parseProviderResponse(json: unknown, now = new Date()): RatesPayload | null {
  if (!json || typeof json !== "object") return null;
  const j = json as Record<string, unknown>;
  if (j.result !== "success" || j.base_code !== BASE_CURRENCY) return null;
  if (!j.rates || typeof j.rates !== "object") return null;

  const rates: Record<string, number> = {};
  for (const [code, value] of Object.entries(j.rates as Record<string, unknown>)) {
    if (/^[A-Z]{3}$/.test(code) && isPositiveNumber(value)) rates[code] = value;
  }
  rates[BASE_CURRENCY] = 1;
  // A response with only the base currency is not a usable rate table.
  if (Object.keys(rates).length < 10) return null;

  return {
    base: BASE_CURRENCY,
    rates,
    providerUpdatedAt: unixToIso(j.time_last_update_unix),
    nextUpdateAt: unixToIso(j.time_next_update_unix),
    fetchedAt: now.toISOString(),
    stale: false,
  };
}

async function fetchFresh(): Promise<RatesPayload | null> {
  const url = process.env.NORVIGATE_RATES_URL || DEFAULT_URL;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store", headers: { accept: "application/json" } });
    if (!res.ok) return null;
    return parseProviderResponse(await res.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Returns usable rates (fresh, cached, or clearly marked stale) or null when there is nothing trustworthy. */
export async function getRates(): Promise<RatesPayload | null> {
  const now = Date.now();
  if (saved && now - saved.at < TTL_MS) return { ...saved.payload, stale: false };

  if (!inflight) {
    inflight = fetchFresh().finally(() => {
      inflight = null;
    });
  }
  const fresh = await inflight;
  if (fresh) {
    saved = { payload: fresh, at: Date.now() };
    return fresh;
  }
  if (saved && now - saved.at < MAX_STALE_MS) return { ...saved.payload, stale: true };
  return null;
}
