import { pick, type Locale } from "@/i18n/content";
import type { LText } from "@/i18n/content";
import type { Product } from "@/data/types";
import { normalize } from "./normalize";

export type StoreSort = "relevance" | "nameAsc" | "priceAsc" | "priceDesc";
export const storeSorts: StoreSort[] = ["relevance", "nameAsc", "priceAsc", "priceDesc"];

export function minPrice(p: Product): number {
  return Math.min(...p.variants.map((v) => v.priceMinor));
}

function all(t?: LText): string {
  if (!t) return "";
  return Object.values(t)
    .filter((v): v is string => typeof v === "string")
    .map((v) => normalize(v))
    .join(" | ");
}

export function filterProducts(
  list: Product[],
  opts: { q?: string; sort?: StoreSort; locale: Locale },
): Product[] {
  const q = normalize(opts.q ?? "");
  const tokens = q ? q.split(" ") : [];
  let result = list;
  const scored = new Map<string, number>();

  if (tokens.length) {
    result = list.filter((p) => {
      const title = all(p.name);
      const body = `${all(p.summary)} ${all(p.description)} ${all(p.ingredients)}`;
      let score = 0;
      for (const t of tokens) {
        let s = 0;
        if (title.includes(t)) s += 5;
        if (body.includes(t)) s += 1;
        if (!s) return false;
        score += s;
      }
      scored.set(p.id, score);
      return true;
    });
  }

  const collator = new Intl.Collator(opts.locale);
  const sorted = [...result];
  switch (opts.sort) {
    case "nameAsc":
      sorted.sort((a, b) => collator.compare(pick(a.name, opts.locale), pick(b.name, opts.locale)));
      break;
    case "priceAsc":
      sorted.sort((a, b) => minPrice(a) - minPrice(b));
      break;
    case "priceDesc":
      sorted.sort((a, b) => minPrice(b) - minPrice(a));
      break;
    default:
      if (tokens.length) sorted.sort((a, b) => (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0));
  }
  return sorted;
}
