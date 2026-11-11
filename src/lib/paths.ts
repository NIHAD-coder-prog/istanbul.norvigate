import { LOCALES, isLocale, type Locale } from "@/i18n/config";

/** Replace the locale prefix of a pathname, keeping the rest. */
export function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts.shift();
  return "/" + [next, ...parts].join("/");
}

export function allLocalePaths(path: string): Record<string, string> {
  const clean = path === "/" ? "" : path;
  return Object.fromEntries(LOCALES.map((l) => [l, `/${l}${clean}`]));
}

export const SLUGS = [
  "services", "things-to-do", "travel", "city-guide", "premium", "store", "flights-hotels",
  "translation", "tools", "faq", "list-business", "search", "contact", "about", "privacy", "terms", "shipping-returns", "cookies",
] as const;
export type Slug = (typeof SLUGS)[number];
