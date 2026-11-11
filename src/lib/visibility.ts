import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { contentDir } from "./content";
import { statusOfPage } from "./roadmap";

/**
 * Owner-controlled visibility. content/_settings.json decides which pages visitors see, by readiness level:
 *   live → only what fully works · beta → live + beta (works, still being tested) · all → everything, including in-development and planned.
 * The file is re-read on change (no rebuild). The owner can also preview "all" privately with the preview key (see /api/preview).
 */
export type Level = "live" | "beta" | "all";
const ALLOWED: Record<Level, string[]> = { live: ["live"], beta: ["live", "beta"], all: ["live", "beta", "dev", "plan"] };
/** Pages that are never hidden: legal notices and the only way to reach us. */
const ALWAYS = new Set(["privacy", "terms", "shipping-returns", "cookies", "contact"]);
export const DEFAULT_PAGES: Record<string, string> = {
  about: "live", faq: "live", services: "beta", "things-to-do": "beta", "city-guide": "beta", travel: "beta", translation: "beta",
  "flights-hotels": "beta", tools: "beta", store: "beta", search: "beta", "list-business": "beta", premium: "plan", vision: "live",
};
interface Settings { level: Level; showRoadmap: boolean; pages: Record<string, string> }
const FALLBACK: Settings = { level: "beta", showRoadmap: true, pages: {} };
let cached: { mtime: number; value: Settings } | null = null;

function readSettings(): Settings {
  const file = path.join(contentDir(), "_settings.json");
  try {
    const mtime = fs.statSync(file).mtimeMs;
    if (cached && cached.mtime === mtime) return cached.value;
    const raw = JSON.parse(fs.readFileSync(file, "utf8"));
    const value: Settings = { level: ["live", "beta", "all"].includes(raw.level) ? raw.level : "beta", showRoadmap: raw.showRoadmap !== false, pages: raw.pages && typeof raw.pages === "object" ? raw.pages : {} };
    cached = { mtime, value };
    return value;
  } catch { return FALLBACK; }
}

export interface Visibility { level: Level; preview: boolean; showRoadmap: boolean; show: (slug: string) => boolean }
export async function getVisibility(): Promise<Visibility> {
  const s = readSettings();
  let preview = false;
  try { const key = process.env.NORVIGATE_PREVIEW_KEY; preview = !!key && (await cookies()).get("NV_PREVIEW")?.value === key; } catch { /* no request context (e.g. sitemap) */ }
  const level: Level = preview ? "all" : s.level;
  const allowed = new Set(ALLOWED[level]);
  return { level, preview, showRoadmap: preview || s.showRoadmap, show: (slug) => ALWAYS.has(slug) || allowed.has(s.pages[slug] ?? statusOfPage(slug) ?? DEFAULT_PAGES[slug] ?? "live") };
}
/** Hidden pages are a genuine 404: not linked, not indexed, not in the sitemap. */
export async function requireVisible(slug: string): Promise<Visibility> {
  const v = await getVisibility();
  if (!v.show(slug)) notFound();
  return v;
}
