import type { Metadata } from "next";

/** Indexing is off until NORVIGATE_ALLOW_INDEXING=true; even then, pages that are placeholders or sample-only stay out of search engines. */
export const indexingEnabled = () => process.env.NORVIGATE_ALLOW_INDEXING === "true";
export function robotsFor(indexable: boolean): Metadata["robots"] {
  return indexingEnabled() && indexable ? { index: true, follow: true } : { index: false, follow: false };
}
