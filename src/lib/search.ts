import { pick, type Locale } from "@/i18n/content";
import { listAllForSearch, type SearchDoc, type SearchType } from "./search-index";
import { normalize } from "./normalize";

export type { SearchType } from "./search-index";
export { normalize } from "./normalize";

export interface SearchHit {
  type: SearchType;
  id: string;
  href: string; // path without locale prefix
  title: string;
  summary: string;
  facet: string; // "<type>:<categoryId>"
  area?: string;
  sample: boolean;
  score: number;
}

export interface SearchParams {
  q: string;
  type?: SearchType | "all";
  facet?: string;
  sort?: "relevance" | "name";
  locale: Locale;
}

export async function searchContent(params: SearchParams): Promise<SearchHit[]> {
  const q = normalize(params.q);
  if (!q) return [];
  const tokens = q.split(" ").filter(Boolean);
  const docs = await listAllForSearch();
  const hits: SearchHit[] = [];

  for (const d of docs) {
    if (params.type && params.type !== "all" && d.type !== params.type) continue;
    if (params.facet && d.facet !== params.facet) continue;
    const score = scoreDoc(d, tokens);
    if (score <= 0) continue;
    hits.push({
      type: d.type,
      id: d.id,
      href: d.href,
      title: pick(d.title, params.locale),
      summary: pick(d.summary, params.locale),
      facet: d.facet,
      area: d.area ? pick(d.area, params.locale) : undefined,
      sample: d.sample,
      score,
    });
  }

  const collator = new Intl.Collator(params.locale);
  if (params.sort === "name") hits.sort((a, b) => collator.compare(a.title, b.title));
  else hits.sort((a, b) => b.score - a.score || collator.compare(a.title, b.title));
  return hits;
}

function scoreDoc(d: SearchDoc, tokens: string[]): number {
  let total = 0;
  for (const t of tokens) {
    let s = 0;
    if (d.titleIndex.includes(t)) s += 5 + (d.titleIndex.startsWith(t) ? 2 : 0);
    if (d.summaryIndex.includes(t)) s += 2;
    if (d.bodyIndex.includes(t)) s += 1;
    if (s === 0) return 0; // every token must match somewhere (AND semantics)
    total += s;
  }
  return total;
}

/** Facet ids per type, used to build the category filter. Labels are resolved by the page. */
export const facetIds: Record<Exclude<SearchType, "guide">, string[]> = {
  provider: ["accommodation", "transport", "business-services", "food-dining", "shopping", "health-wellness", "education", "relocation", "experiences"],
  experience: ["history", "markets", "waterfront", "neighbourhoods"],
  product: ["sweets", "packaged", "specialties", "gifts", "made-in-istanbul"],
};
