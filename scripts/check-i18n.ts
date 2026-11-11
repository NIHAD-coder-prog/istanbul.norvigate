import { en } from "../src/i18n/dictionaries/en";
import { tr } from "../src/i18n/dictionaries/tr";
import { ar } from "../src/i18n/dictionaries/ar";
import { es } from "../src/i18n/dictionaries/es";
import { fr } from "../src/i18n/dictionaries/fr";
import { getFormsDict } from "../src/i18n/forms-dict";
import { getToolsDict } from "../src/i18n/tools-dict";

type Json = string | string[] | { [k: string]: Json };
function walk(base: Json, other: Json, path: string, out: string[]) {
  if (typeof base === "string") {
    // hero.pre / hero.post may legitimately be empty (word order differs between languages).
    const optional = /\.hero\.(pre|post)$/.test(path);
    if (typeof other !== "string" || (!optional && !other.trim())) out.push(`${path}: missing or empty`);
    return;
  }
  if (Array.isArray(base)) { if (!Array.isArray(other) || other.length !== base.length || other.some((x) => !String(x).trim())) out.push(`${path}: array mismatch`); return; }
  if (typeof other !== "object" || Array.isArray(other) || other === null) { out.push(`${path}: missing`); return; }
  for (const k of Object.keys(base)) walk(base[k], (other as { [k: string]: Json })[k], `${path}.${k}`, out);
  for (const k of Object.keys(other)) if (!(k in base)) out.push(`${path}.${k}: extra key`);
}
const problems: string[] = [];
for (const [code, d] of Object.entries({ tr, ar, es, fr })) {
  const out: string[] = [];
  walk(en as unknown as Json, d as unknown as Json, code, out);
  problems.push(...out);
}
for (const code of ["tr", "ar", "es", "fr"] as const) {
  const f = getFormsDict(code), fe = getFormsDict("en");
  walk(fe as unknown as Json, f as unknown as Json, `${code}.forms`, problems);
  walk(getToolsDict("en") as unknown as Json, getToolsDict(code) as unknown as Json, `${code}.tools`, problems);
}
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log("i18n coverage: all 5 languages complete (dictionaries, forms, tools).");
