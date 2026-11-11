import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale } from "@/i18n/config";
import { pick, type Locale } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { getFormsDict } from "@/i18n/forms-dict";
import { listProducts } from "@/lib/repo";
import { CartView, type CatalogueEntry } from "@/components/CartView";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getPagesDict(isLocale(locale) ? locale : "en").cart, robots: { index: false, follow: false } };
}

export default async function CartPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("store");
  const d = getDictionary(locale), p = getPagesDict(locale);
  const catalogue: Record<string, CatalogueEntry> = {};
  for (const x of await listProducts()) for (const v of x.variants) catalogue[`${x.id}:${v.id}`] = { name: pick(x.name, locale), label: pick(v.label, locale), priceMinor: v.priceMinor, weightGrams: v.weightGrams, slug: x.slug };
  return (
    <div className="page wrap">
      <h1>{p.cart}</h1>
      <p className="muted-s"><a href={`/${locale}/store`}>← {d.nav.main[5]}</a></p>
      <CartView locale={locale} p={p} dict={getFormsDict(locale)} catalogue={catalogue} note={p.orderNote} />
    </div>
  );
}
