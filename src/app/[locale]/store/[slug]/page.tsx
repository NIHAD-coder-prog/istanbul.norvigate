import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale } from "@/i18n/config";
import { pick, type Locale } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { getAllergenLabels, getProduct } from "@/lib/repo";
import { formatMoney, formatDate } from "@/lib/format";
import { robotsFor } from "@/lib/seo";
import { ProductArt } from "@/components/ProductArt";
import { DataBadge } from "@/components/DataBadge";
import { AddToCart, ApproxPrice, CartLink } from "@/components/Cart";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const x = isLocale(locale) ? await getProduct(slug) : undefined;
  if (!x || !isLocale(locale)) return {};
  return { title: pick(x.name, locale), description: pick(x.summary, locale), robots: robotsFor(x.dataStatus === "verified") };
}

export default async function ProductPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("store");
  const x = await getProduct(slug);
  if (!x) notFound();
  const d = getDictionary(locale), p = getPagesDict(locale);
  const labels = await getAllergenLabels();
  const enabled = x.shipping.destinations.filter((r) => r.status === "enabled");
  return (
    <div className="page wrap wide">
      <div className="titlebar"><a href={`/${locale}/store`}>← {d.nav.main[5]}</a><CartLink locale={locale} label={p.cart} /></div>
      <div className="pgrid">
        <div><ProductArt product={x} /></div>
        <div>
          <DataBadge status={x.dataStatus} d={d} p={p} />
          <h1>{pick(x.name, locale)}</h1>
          <p className="intro">{pick(x.description, locale)}</p>
          <p className="price"><b>{p.from} {formatMoney(Math.min(...x.variants.map((v) => v.priceMinor)), "TRY", locale)}</b><ApproxPrice minor={Math.min(...x.variants.map((v) => v.priceMinor))} locale={locale} /></p>
          <AddToCart productId={x.id} locale={locale} p={p} variants={x.variants.map((v) => ({ id: v.id, label: pick(v.label, locale), price: formatMoney(v.priceMinor, "TRY", locale) }))} />
          <dl className="facts">
            {x.ingredients && (<><dt>{p.ingredients}</dt><dd>{pick(x.ingredients, locale)}</dd></>)}
            <dt>{p.allergens}</dt><dd>{x.allergens.status === "unverified" ? p.allergensUnverified : x.allergens.contains.map((a) => (labels[a] ? pick(labels[a], locale) : a)).join(", ")}</dd>
            {x.storage && (<><dt>{p.storage}</dt><dd>{pick(x.storage, locale)}</dd></>)}
            <dt>{p.shipping}</dt><dd>{enabled.length ? enabled.map((r) => r.country).join(", ") : p.shippingNone}</dd>
            <dt>{p.lastUpdated}</dt><dd>{formatDate(x.lastUpdated, locale)}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
