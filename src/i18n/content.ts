import { LOCALES, LOCALE_META, type Locale } from "./config";
export type { Locale };
export const intlTag = (l: Locale | string) => LOCALE_META[(l as Locale)]?.intl ?? "en";

/** Localized text: English is mandatory; other languages are optional and fall back to English. */
export type LText = { en: string } & Partial<Record<string, string>>;

/** Positional helper for the four built-in languages: English, Turkish, Arabic, Spanish (French arrives through src/data/translations/fr.ts). */
export function L(en: string, tr?: string, ar?: string, es?: string): LText {
  const t: LText = { en };
  if (tr) t.tr = tr;
  if (ar) t.ar = ar;
  if (es) t.es = es;
  return t;
}
export function LX(en: string, others: Record<string, string>): LText {
  return { ...others, en };
}
export const baseLang = (l: string) => l.split("-")[0].toLowerCase();
/** Exact code, then base language, then English. Empty strings count as missing. */
export function pick(text: LText, locale: Locale | string): string {
  return text[locale] || text[baseLang(locale)] || text.en;
}
/** Replaces {name} placeholders. */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? String(values[k]) : `{${k}}`));
}
export const ALL_LOCALES: readonly Locale[] = LOCALES;
