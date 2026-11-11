export const LOCALES = ["en", "tr", "ar", "es", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "NV_LANG";
export const CURRENCY_COOKIE = "NV_CUR";

export const LOCALE_META: Record<Locale, { native: string; dir: "ltr" | "rtl"; intl: string; og: string }> = {
  en: { native: "English", dir: "ltr", intl: "en", og: "en_US" },
  tr: { native: "Türkçe", dir: "ltr", intl: "tr-TR", og: "tr_TR" },
  ar: { native: "العربية", dir: "rtl", intl: "ar", og: "ar_AR" },
  es: { native: "Español", dir: "ltr", intl: "es", og: "es_ES" },
  fr: { native: "Français", dir: "ltr", intl: "fr-FR", og: "fr_FR" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Cookie first, then Accept-Language, then the default. */
export function negotiateLocale(acceptLanguage: string | null, cookie?: string | null): Locale {
  if (isLocale(cookie)) return cookie;
  if (acceptLanguage) {
    const ranked = acceptLanguage
      .split(",")
      .map((part) => {
        const [tag, q] = part.trim().split(";q=");
        return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);
    for (const { base } of ranked) if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://istanbul.norvigate.com").replace(/\/$/, "");
export const HUB_URL = "https://norvigate.com";
export const SISTER_URL = "https://norvigiq.com";
