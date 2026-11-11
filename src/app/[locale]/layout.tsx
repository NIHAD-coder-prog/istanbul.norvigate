import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import "../globals.css";
import { LOCALES, LOCALE_META, SITE_URL, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CartProvider } from "@/components/Cart";
import { getVisibility } from "@/lib/visibility";
import { getPagesDict } from "@/i18n/pages-dict";

export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#08192f", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDictionary(locale);
  const indexing = process.env.NORVIGATE_ALLOW_INDEXING === "true";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: `${d.meta.name} — NORVIGATE`, template: `%s — NORVIGATE Istanbul` },
    description: d.meta.description,
    robots: indexing ? { index: true, follow: true } : { index: false, follow: false },
    icons: { icon: [{ url: "/brand/favicon-32.png", sizes: "32x32" }, { url: "/brand/favicon-64.png", sizes: "64x64" }], apple: "/brand/favicon-180.png" },
    openGraph: { title: d.meta.name, description: d.meta.description, siteName: "NORVIGATE", locale: LOCALE_META[locale].og, type: "website", images: [{ url: "/brand/og-image.jpg", width: 1200, height: 628 }] },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDictionary(locale);
  // Reading request headers opts the page into dynamic rendering so the per-request CSP nonce reaches Next's scripts.
  await headers();
  const vis = await getVisibility();
  const pg = getPagesDict(locale);
  return (
    <html lang={locale} dir={LOCALE_META[locale].dir}>
      <body>
        <a className="skip" href="#main">{d.common.skip}</a>
        {vis.preview && <div className="previewbar" role="status">{pg.previewOn} <a href="/api/preview?off=1">{pg.previewOff}</a></div>}
        <SiteHeader locale={locale} d={d} vis={vis} />
        <CartProvider><main id="main">{children}</main></CartProvider>
        <SiteFooter locale={locale} d={d} vis={vis} />
      </body>
    </html>
  );
}
