import { LOCALE_META, type Locale } from "@/i18n/config";
const intlTag = (l: Locale) => LOCALE_META[l].intl;
import { BASE_CURRENCY, POPULAR_CURRENCIES, type RatesPayload } from "./types";

/** Convert an amount between two currencies using a TRY-based rate table. Returns null if either rate is missing. */
export function convert(amount: number, from: string, to: string, payload: RatesPayload): number | null {
  const rf = payload.rates[from];
  const rt = payload.rates[to];
  if (!rf || !rt) return null;
  return (amount / rf) * rt;
}

/** Units of `to` per 1 unit of `from`. */
export function rateBetween(from: string, to: string, payload: RatesPayload): number | null {
  return convert(1, from, to, payload);
}

export function formatCurrencyAmount(amount: number, code: string, locale: Locale): string {
  const tag = intlTag(locale);
  try {
    const normal = new Intl.NumberFormat(tag, { style: "currency", currency: code, currencyDisplay: "narrowSymbol" }).format(amount);
    // Very small positive amounts would show as zero; keep significant digits instead.
    if (amount !== 0 && Math.abs(amount) < 0.01) {
      return new Intl.NumberFormat(tag, {
        style: "currency",
        currency: code,
        currencyDisplay: "narrowSymbol",
        maximumSignificantDigits: 3,
        minimumFractionDigits: 0,
      }).format(amount);
    }
    return normal;
  } catch {
    return `${new Intl.NumberFormat(tag, { maximumFractionDigits: 4 }).format(amount)} ${code}`;
  }
}

export function formatRate(rate: number, locale: Locale): string {
  return new Intl.NumberFormat(intlTag(locale), { maximumSignificantDigits: 6 }).format(rate);
}

const nameCache = new Map<string, Intl.DisplayNames>();

/** Currency name in the UI language, for example "Turkish Lira". Falls back to the code. */
export function currencyName(code: string, locale: Locale): string {
  try {
    let dn = nameCache.get(locale);
    if (!dn) {
      dn = new Intl.DisplayNames([locale], { type: "currency" });
      nameCache.set(locale, dn);
    }
    return dn.of(code) || code;
  } catch {
    return code;
  }
}

export interface CurrencyOption {
  code: string;
  name: string;
}

/** Sorted currency list: common ones first (when present), then the rest alphabetically by localized name. */
export function currencyOptions(codes: string[], locale: Locale): { popular: CurrencyOption[]; others: CurrencyOption[] } {
  const present = new Set(codes);
  const collator = new Intl.Collator(locale);
  const popular = (POPULAR_CURRENCIES as readonly string[])
    .filter((c) => present.has(c))
    .map((code) => ({ code, name: currencyName(code, locale) }));
  const popularSet = new Set(popular.map((p) => p.code));
  const others = codes
    .filter((c) => !popularSet.has(c))
    .map((code) => ({ code, name: currencyName(code, locale) }))
    .sort((a, b) => collator.compare(a.name, b.name));
  return { popular, others };
}

export { BASE_CURRENCY };
