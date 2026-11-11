import "server-only";
import fs from "node:fs";
import path from "node:path";
import { contentDir } from "./content";

export type RoadmapStatus = "live" | "beta" | "dev" | "plan";
export interface RoadmapData { reviewed: string; items: { id: string; status: RoadmapStatus }[] }
let cached: { mtime: number; value: RoadmapData } | null = null;

/** content/roadmap.json — the single place where a capability's status is changed (live | beta | dev | plan). Re-read on change. */
export function readRoadmap(): RoadmapData {
  const file = path.join(contentDir(), "roadmap.json");
  try {
    const mtime = fs.statSync(file).mtimeMs;
    if (cached && cached.mtime === mtime) return cached.value;
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const ok = (s: string) => ["live", "beta", "dev", "plan"].includes(s);
    const value: RoadmapData = { reviewed: String(raw.reviewed || ""), items: (raw.items || []).filter((i: { id?: string; status?: string }) => i?.id && ok(String(i.status))) };
    cached = { mtime, value };
    return value;
  } catch (e) {
    console.error("[roadmap] could not read roadmap.json:", e instanceof Error ? e.message : e);
    return cached?.value ?? { reviewed: "", items: [] };
  }
}
/** Which capability (roadmap item) each page belongs to: changing the item's status changes the page's visibility too. */
export const PAGE_ITEM: Record<string, string> = {
  services: "directory", "city-guide": "guide", "things-to-do": "guide", tools: "tools",
  travel: "requests", translation: "requests", "flights-hotels": "requests", "list-business": "requests",
  store: "orders", premium: "premium",
};
export const statusOfPage = (slug: string): RoadmapStatus | undefined => {
  const id = PAGE_ITEM[slug];
  return id ? readRoadmap().items.find((i) => i.id === id)?.status : undefined;
};
