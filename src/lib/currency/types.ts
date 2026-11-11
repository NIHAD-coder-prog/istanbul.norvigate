/** Shared currency types and the attribution required by the rate provider's terms. */
export const BASE_CURRENCY = "TRY";

export interface RatesPayload {
  base: typeof BASE_CURRENCY;
  /** Units of each currency per 1 TRY. Includes TRY itself (= 1). */
  rates: Record<string, number>;
  /** When the provider says these rates were produced (ISO), if given. */
  providerUpdatedAt?: string;
  /** When the provider says the next update is due (ISO), if given. */
  nextUpdateAt?: string;
  /** When NORVIGATE last fetched them (ISO). */
  fetchedAt: string;
  /** True when the live fetch failed and these are the last saved rates. */
  stale: boolean;
}

export type RatesResponse =
  | ({ ok: true } & RatesPayload)
  | { ok: false; error: "unavailable" };

export const RATES_ATTRIBUTION = {
  text: "Rates By Exchange Rate API",
  url: "https://www.exchangerate-api.com",
};

/** Currencies shown first in pickers, when the provider supplies them. */
export const POPULAR_CURRENCIES = [
  "TRY", "USD", "EUR", "GBP", "AED", "SAR", "EGP", "JOD", "KWD", "QAR", "LBP", "SYP", "IQD", "CHF", "CNY", "JPY", "RUB",
] as const;
