import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/config";
export default function robots(): MetadataRoute.Robots {
  const allow = process.env.NORVIGATE_ALLOW_INDEXING === "true";
  return allow ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE_URL}/sitemap.xml` } : { rules: { userAgent: "*", disallow: "/" } };
}
