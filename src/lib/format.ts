import { intlTag, type Locale } from "@/i18n/content";

export function formatMoney(minor: number, currency: string, locale: Locale): string {
  return new Intl.NumberFormat(intlTag(locale), {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(minor / 100);
}

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
  return new Intl.DateTimeFormat(intlTag(locale), {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function formatWeight(grams: number, locale: Locale): string {
  const nf = new Intl.NumberFormat(intlTag(locale), { maximumFractionDigits: 2 });
  return grams >= 1000 ? `${nf.format(grams / 1000)} kg` : `${nf.format(grams)} g`;
}

export function formatNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(intlTag(locale)).format(n);
}
