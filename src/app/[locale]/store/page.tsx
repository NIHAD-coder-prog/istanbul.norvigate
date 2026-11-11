import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { pick, type Locale } from "@/i18n/content";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { listProducts } from "@/lib/repo";
import { filterProducts, minPrice, storeSorts, type StoreSort } from "@/lib/store";
import { formatMoney } from "@/lib/format";
import { allLocalePaths } from "@/lib/paths";
import { robotsFor } from "@/lib/seo";
import { ProductArt } from "@/components/ProductArt";
import { DataBadge } from "@/components/DataBadge";
import { CartLink } from "@/components/Cart";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; sort?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const list = await listProducts();
  return { title: getDictionary(locale).nav.main[5], alternates: { canonical: `/${locale}/store`, languages: allLocalePaths("/store") }, robots: robotsFor(list.some((x) => x.dataStatus === "verified")) };
}

export default async function Store({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("store");
  const { q = "", sort = "relevance" } = await searchParams;
  const d = getDictionary(locale), p = getPagesDict(locale);
  const s = (storeSorts as string[]).includes(sort) ? (sort as StoreSort) : "relevance";
  const list = filterProducts(await listProducts(), { q, sort: s, locale });
  const sortLabel: Record<StoreSort, string> = { relevance: p.sortRelevance, nameAsc: p.sortNameAsc, priceAsc: p.sortPriceAsc, priceDesc: p.sortPriceDesc };
  return (
    <div className="page wrap wide">
      <div className="titlebar"><h1>{d.nav.main[5]}</h1><CartLink locale={locale} label={p.cart} /></div>
      <p className="intro">{p.storeLead}</p>
      <form className="iform filterbar" method="get" action={`/${locale}/store`} role="search">
        <div className="fld"><label htmlFor="sq">{p.searchProducts}</label><input id="sq" name="q" defaultValue={q} type="search" /></div>
        <div className="fld"><label htmlFor="ss">{p.sort}</label><select id="ss" name="sort" defaultValue={s}>{storeSorts.map((x) => <option key={x} value={x}>{sortLabel[x]}</option>)}</select></div>
        <button type="submit" className="btn-p">{d.hero.go}</button>
      </form>
      {list.length === 0 ? <p>{p.noResults}</p> : (
        <div className="cards">
          {list.map((x) => (
            <a key={x.id} className="card" href={`/${locale}/store/${x.slug}`}>
              <ProductArt product={x} />
              <DataBadge status={x.dataStatus} d={d} p={p} />
              <h2>{pick(x.name, locale)}</h2><p>{pick(x.summary, locale)}</p>
              <p><b>{p.from} {formatMoney(minPrice(x), "TRY", locale)}</b></p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
