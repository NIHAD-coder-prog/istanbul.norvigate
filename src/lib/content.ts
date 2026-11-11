import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { LText } from "@/i18n/content";

/**
 * File-based content store. Every record is one JSON file under <content dir>/<collection>/.
 * To add content: drop a new .json file in the folder. To replace a sample: edit it or delete it.
 * Files are re-read automatically when they change (no rebuild, no restart).
 * A broken file is skipped and reported in the server log — it never takes the site down.
 */
export const contentDir = () => path.resolve(process.env.NORVIGATE_CONTENT_DIR || path.join(process.cwd(), "content"));

interface CacheEntry { signature: string; items: unknown[] }
const cache = new Map<string, CacheEntry>();

export function readCollection<T extends { id: string }>(name: string): T[] {
  const dir = path.join(contentDir(), name);
  let files: string[] = [];
  try { files = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && !f.startsWith("_")).sort(); } catch { return []; }
  const signature = files.map((f) => { try { return `${f}:${fs.statSync(path.join(dir, f)).mtimeMs}`; } catch { return f; } }).join("|");
  const hit = cache.get(dir);
  if (hit && hit.signature === signature) return hit.items as T[];
  const items: T[] = [];
  const seen = new Set<string>();
  for (const f of files) {
    try {
      const obj = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as T;
      if (!obj || typeof obj.id !== "string" || !obj.id) throw new Error('missing "id"');
      if (seen.has(obj.id)) throw new Error(`duplicate id "${obj.id}"`);
      seen.add(obj.id);
      items.push(obj);
    } catch (err) {
      console.error(`[content] skipped ${name}/${f}: ${err instanceof Error ? err.message : err}`);
    }
  }
  cache.set(dir, { signature, items });
  return items;
}

export function readAllergenLabels(): Record<string, LText> {
  try { return JSON.parse(fs.readFileSync(path.join(contentDir(), "allergens.json"), "utf8")); } catch { return {}; }
}
