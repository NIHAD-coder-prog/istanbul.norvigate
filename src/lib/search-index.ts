
import type { LText } from "@/i18n/content";
import { listGuide, listProducts, listProviders, listExperiences, listProviderCategories } from "./repo";
import { normalize } from "./normalize";

export type SearchType = "provider" | "experience" | "product" | "guide";

export interface SearchDoc {
  type: SearchType;
  id: string;
  /** Path without locale prefix. */
  href: string;
  title: LText;
  summary: LText;
  area?: LText;
  /** "<type>:<categoryId>", used by the category filter. */
  facet: string;
  sample: boolean;
  /** Normalised text across ALL languages so a Turkish query finds content shown in an English UI and vice versa. */
  titleIndex: string;
  summaryIndex: string;
  bodyIndex: string;
}

function allLangs(t: LText | undefined): string {
  if (!t) return "";
  return Object.values(t)
    .filter((v): v is string => typeof v === "string")
    .map((v) => normalize(v))
    .join(" | ");
}

/** Builds the search index from published content only (every item in the repo is "published" in V0.1). */
export async function listAllForSearch(): Promise<SearchDoc[]> {
  const [providers, experiences, products, guide, categories] = await Promise.all([
    listProviders(),
    listExperiences(),
    listProducts(),
    listGuide(),
    listProviderCategories(),
  ]);

  const docs: SearchDoc[] = [];

  for (const p of providers) {
    const cat = categories.find((c) => c.id === p.categoryId);
    docs.push({
      type: "provider",
      id: p.id,
      href: `/services/${p.slug}`,
      title: p.name,
      summary: p.summary,
      area: p.area,
      facet: `provider:${p.categoryId}`,
      sample: p.dataStatus === "sample",
      titleIndex: allLangs(p.name),
      summaryIndex: allLangs(p.summary),
      bodyIndex: `${allLangs(p.description)} ${allLangs(p.area)} ${cat ? allLangs(cat.name) : ""}`,
    });
  }

  for (const e of experiences) {
    docs.push({
      type: "experience",
      id: e.id,
      href: `/things-to-do#${e.slug}`,
      title: e.title,
      summary: e.summary,
      area: e.area,
      facet: `experience:${e.category}`,
      sample: e.dataStatus === "sample",
      titleIndex: allLangs(e.title),
      summaryIndex: allLangs(e.summary),
      bodyIndex: `${allLangs(e.description)} ${allLangs(e.area)}`,
    });
  }

  for (const p of products) {
    docs.push({
      type: "product",
      id: p.id,
      href: `/store/${p.slug}`,
      title: p.name,
      summary: p.summary,
      facet: `product:${p.categoryId}`,
      sample: true,
      titleIndex: allLangs(p.name),
      summaryIndex: allLangs(p.summary),
      bodyIndex: `${allLangs(p.description)} ${allLangs(p.ingredients)}`,
    });
  }

  for (const g of guide) {
    docs.push({
      type: "guide",
      id: g.id,
      href: `/city-guide#${g.id}`,
      title: g.title,
      summary: g.body[0],
      facet: "guide:guide",
      sample: false,
      titleIndex: allLangs(g.title),
      summaryIndex: allLangs(g.body[0]),
      bodyIndex: g.body.map(allLangs).join(" "),
    });
  }

  return docs;
}
