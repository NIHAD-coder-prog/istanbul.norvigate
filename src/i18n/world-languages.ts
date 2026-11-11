import { type Locale } from "./config";

/**
 * Languages offered in the translation-request form: ISO 639-1 (the two-letter set) plus a few widely used
 * languages that have no two-letter code. Names come from the browser/Node ICU (Intl.DisplayNames) in the
 * visitor's language, so every language is listed in every UI language with no extra translation work.
 *
 * Listing a language here means a REQUEST can be recorded for it. It does not mean a qualified provider exists.
 */
export const worldLanguageCodes: readonly string[] = [
  "aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az", "ba", "be", "bg", "bi", "bm", "bn",
  "bo", "br", "bs", "ca", "ce", "ch", "ckb", "co", "cr", "cs", "cu", "cv", "cy", "da", "de", "dv", "dz", "ee",
  "el", "en", "eo", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu",
  "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io", "is",
  "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl", "km", "kmr", "kn", "ko", "kr", "ks", "ku", "kv",
  "kw", "ky", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "ml", "mn", "mr",
  "ms", "mt", "my", "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc", "oj", "om", "or",
  "os", "pa", "pi", "pl", "ps", "pt", "qu", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg", "si",
  "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk",
  "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh",
  "yi", "yo", "za", "zh", "zu",
];

/** Shown first in the list; relevant to Istanbul and the visitors it serves. */
export const commonLanguageCodes: readonly string[] = [
  "ar", "en", "tr", "es", "ku", "kmr", "ckb", "fa", "fr", "de", "ru", "zh", "ur", "hi", "it", "pt", "nl", "az", "uk",
];

export const OTHER_LANGUAGE = "other";

/** Valid value for a language field: any listed language, or "other". */
export function isLanguageCode(value: string): boolean {
  return value === OTHER_LANGUAGE || worldLanguageCodes.includes(value);
}

const cache = new Map<string, Intl.DisplayNames>();

export function languageName(code: string, uiLocale: Locale): string {
  try {
    let dn = cache.get(uiLocale);
    if (!dn) {
      dn = new Intl.DisplayNames([uiLocale], { type: "language" });
      cache.set(uiLocale, dn);
    }
    const name = dn.of(code);
    if (name && name !== code) return name.charAt(0).toLocaleUpperCase(uiLocale) + name.slice(1);
  } catch {
    /* fall through */
  }
  return code.toUpperCase();
}

export interface LanguageOptionGroups {
  common: { value: string; label: string }[];
  all: { value: string; label: string }[];
}

/** Localised, sorted option groups for a language <select>. */
export function languageOptionGroups(uiLocale: Locale): LanguageOptionGroups {
  const collator = new Intl.Collator(uiLocale);
  const common = commonLanguageCodes.map((value) => ({ value, label: languageName(value, uiLocale) }));
  const rest = worldLanguageCodes
    .filter((c) => !commonLanguageCodes.includes(c))
    .map((value) => ({ value, label: languageName(value, uiLocale) }))
    .sort((a, b) => collator.compare(a.label, b.label));
  return { common, all: rest };
}
