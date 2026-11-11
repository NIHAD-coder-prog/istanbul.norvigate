import type { MetadataRoute } from "next";
import { LOCALES, SITE_URL } from "@/i18n/config";
import { SLUGS } from "@/lib/paths";
import { listProducts, listProviders } from "@/lib/repo";
import { getVisibility } from "@/lib/visibility";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vis = await getVisibility();
  const paths = ["", ...(vis.showRoadmap ? ["/vision"] : []), ...SLUGS.filter((s) => s !== "search" && vis.show(s)).map((s) => `/${s}`)];
  // Sample records are never listed: only verified (real) detail pages reach the sitemap.
  const [providers, products] = await Promise.all([listProviders(), listProducts()]);
  for (const p of providers) if (p.dataStatus === "verified" && vis.show("services")) paths.push(`/services/${p.slug}`);
  for (const p of products) if (p.dataStatus === "verified" && vis.show("store")) paths.push(`/store/${p.slug}`);
  return paths.flatMap((p) => LOCALES.map((l) => ({
    url: `${SITE_URL}/${l}${p}`,
    alternates: { languages: Object.fromEntries(LOCALES.map((x) => [x, `${SITE_URL}/${x}${p}`])) },
  })));
}
