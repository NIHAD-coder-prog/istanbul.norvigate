"use client";
import { useEffect, useState } from "react";
import { CURRENCY_COOKIE } from "@/i18n/config";
import type { RatesPayload } from "@/lib/currency/types";

let pending: Promise<RatesPayload | null> | null = null;
/** One shared fetch of the rate table for the whole page. Resolves to null if rates are unavailable (nothing is invented). */
export function loadRates(): Promise<RatesPayload | null> {
  if (!pending) {
    pending = fetch("/api/rates").then((r) => (r.ok ? r.json() : null)).then((j) => (j?.ok ? (j as RatesPayload) : null)).catch(() => null);
  }
  return pending;
}
export const CURRENCY_EVENT = "nv-currency";
export function readCurrency(): string {
  const m = document.cookie.match(new RegExp(`${CURRENCY_COOKIE}=([A-Z]{3})`));
  return m ? m[1] : "TRY";
}
export function useDisplayCurrency(): string {
  const [c, setC] = useState("TRY");
  useEffect(() => {
    setC(readCurrency());
    const on = () => setC(readCurrency());
    window.addEventListener(CURRENCY_EVENT, on);
    return () => window.removeEventListener(CURRENCY_EVENT, on);
  }, []);
  return c;
}
