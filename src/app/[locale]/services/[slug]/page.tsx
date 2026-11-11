import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { pick } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { languageName } from "@/i18n/world-languages";
import { getProvider, getProviderCategory } from "@/lib/repo";
import { formatDate } from "@/lib/format";
import { robotsFor } from "@/lib/seo";
import { DataBadge } from "@/components/DataBadge";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const x = isLocale(locale) ? await getProvider(slug) : undefined;
  if (!x || !isLocale(locale)) return {};
  return { title: pick(x.name, locale), description: pick(x.summary, locale), robots: robotsFor(x.dataStatus === "verified") };
}

export default async function ProviderPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("services");
  const x = await getProvider(slug);
  if (!x) notFound();
  const d = getDictionary(locale), p = getPagesDict(locale);
  const cat = await getProviderCategory(x.categoryId);
  return (
    <div className="page wrap">
      <p><a href={`/${locale}/services`}>← {d.nav.main[0]}</a></p>
      <DataBadge status={x.dataStatus} d={d} p={p} />
      <h1>{pick(x.name, locale)}</h1>
      {cat && <p className="muted-s">{pick(cat.name, locale)}</p>}
      <p className="intro">{pick(x.description, locale)}</p>
      <dl className="facts">
        <dt>{p.area}</dt><dd>{pick(x.area, locale)}</dd>
        {x.serviceArea && (<><dt>{p.serviceArea}</dt><dd>{pick(x.serviceArea, locale)}</dd></>)}
        {x.languages?.length > 0 && (<><dt>{p.languages}</dt><dd>{x.languages.map((c) => languageName(c, locale)).join(" · ")}</dd></>)}
        {x.accessibility && (<><dt>{p.accessibility}</dt><dd>{pick(x.accessibility, locale)}</dd></>)}
        {x.openingHours && (<><dt>{p.duration}</dt><dd>{pick(x.openingHours, locale)}</dd></>)}
        {x.priceInfo && (<><dt>{d.cats[7]}</dt><dd>{pick(x.priceInfo, locale)}</dd></>)}
        <dt>{p.lastUpdated}</dt><dd>{formatDate(x.lastUpdated, locale)}</dd>
      </dl>
      {x.contact ? (
        <p>{x.contact.website && <a href={x.contact.website} rel="noopener noreferrer" target="_blank" dir="ltr">{x.contact.website}</a>}{x.contact.email && <> · <a href={`mailto:${x.contact.email}`} dir="ltr">{x.contact.email}</a></>}{x.contact.phone && <> · <a href={`tel:${x.contact.phone}`} dir="ltr">{x.contact.phone}</a></>}</p>
      ) : <p className="muted-s">{p.noContact}</p>}
      <a className="btn-p inl" href={`/${locale}/contact`}>{d.nav.contact}</a>
    </div>
  );
}
