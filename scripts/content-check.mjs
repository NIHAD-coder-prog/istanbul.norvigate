// Checks every content file (plain Node, runs anywhere):  node scripts/content-check.mjs
import fs from "node:fs";
import path from "node:path";
const root = path.resolve(process.env.NORVIGATE_CONTENT_DIR || "content");
const problems = [], notes = [];
const required = {
  providers: ["id", "slug", "categoryId", "name", "summary", "description", "lastUpdated", "dataStatus"],
  experiences: ["id", "title", "summary", "description", "dataStatus"],
  products: ["id", "slug", "name", "summary", "description", "variants", "dataStatus"],
  faq: ["id", "q", "a"], guide: ["id", "title", "body"], "external-links": ["id", "kind", "name", "url", "checkedAt"], categories: ["id", "name", "description"],
};
const LANGS = ["en", "tr", "ar", "es", "fr"];
function visit(v, where) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    const keys = Object.keys(v);
    if (keys.some((k) => LANGS.includes(k)) && keys.every((k) => /^[a-z]{2,3}(-[A-Za-z0-9]+)*$/.test(k))) {
      if (typeof v.en !== "string" || !v.en.trim()) problems.push(`${where}: English text (en) is required`);
      for (const l of LANGS) if (!v[l] || !String(v[l]).trim()) notes.push(`${where}: no "${l}" text (English will be shown)`);
      return;
    }
    for (const [k, x] of Object.entries(v)) visit(x, `${where}.${k}`);
  } else if (Array.isArray(v)) v.forEach((x, i) => visit(x, `${where}[${i}]`));
}
for (const [dir, req] of Object.entries(required)) {
  const d = path.join(root, dir);
  if (!fs.existsSync(d)) { problems.push(`${dir}/: folder missing`); continue; }
  const ids = new Set(), slugs = new Set();
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith(".json") && !x.startsWith("_"))) {
    const where = `${dir}/${f}`;
    let o;
    try { o = JSON.parse(fs.readFileSync(path.join(d, f), "utf8")); } catch (e) { problems.push(`${where}: invalid JSON (${e.message})`); continue; }
    for (const k of req) if (o[k] === undefined || o[k] === "") problems.push(`${where}: missing "${k}"`);
    if (typeof o.id === "string") { if (ids.has(o.id)) problems.push(`${where}: duplicate id ${o.id}`); ids.add(o.id); if (/CHANGE-ME/i.test(o.id)) problems.push(`${where}: still has the template id (CHANGE-ME)`); }
    if (typeof o.slug === "string") { if (!/^[a-z0-9-]+$/.test(o.slug)) problems.push(`${where}: slug must be lowercase letters, digits and dashes`); if (slugs.has(o.slug)) problems.push(`${where}: duplicate slug ${o.slug}`); slugs.add(o.slug); }
    if (o.dataStatus !== undefined && !["sample", "editorial", "verified"].includes(String(o.dataStatus))) problems.push(`${where}: dataStatus must be sample, editorial or verified`);
    if (typeof o.url === "string" && !/^https:\/\//.test(o.url)) problems.push(`${where}: url must start with https://`);
    visit(o, where);
  }
}
for (const n of notes.slice(0, 15)) console.log("note  " + n);
if (notes.length > 15) console.log(`note  … and ${notes.length - 15} more missing translations`);
if (problems.length) { for (const p of problems) console.error("ERROR " + p); process.exit(1); }
console.log(`content OK (${notes.length} missing-translation notes).`);
