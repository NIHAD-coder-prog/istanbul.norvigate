import type { Dict } from "./en";
import { en } from "./en";
import { tr } from "./tr";
import { ar } from "./ar";
import { es } from "./es";
import { fr } from "./fr";

const dictionaries: Record<string, Dict> = { en, tr, ar, es, fr };

export function getDictionary(locale: string): Dict {
  return dictionaries[locale] ?? en;
}

export type { Dict };
