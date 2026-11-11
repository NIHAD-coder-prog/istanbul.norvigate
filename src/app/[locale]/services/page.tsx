import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { pick, fmt } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { listProviderCategories, listProviders } from "@/lib/repo";
import { allLocalePaths } from "@/lib/paths";
import { robotsFor } from "@/lib/seo";
import { DataBadge } from "@/components/DataBadge";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const providers = await listProviders();
  return { title: getDictionary(locale).nav.main[0], alternates: { canonical: `/${locale}/services`, languages: allLocalePaths("/services") }, robots: robotsFor(providers.some((p) => p.dataStatus === "verified")) };
}

export default async function Services({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("services");
  const { category } = await searchParams;
  const d = getDictionary(locale), p = getPagesDict(locale);
  const [cats, all] = await Promise.all([listProviderCategories(), listProviders()]);
  const active = cats.find((c) => c.id === category);
  const list = active ? all.filter((x) => x.categoryId === active.id) : all;
  return (
    <div className="page wrap wide">
      <h1>{d.nav.main[0]}</h1>
      <p className="intro">{p.svcLead}</p>
      <nav className="chips" aria-label={d.nav.main[0]}>
        <a href={`/${locale}/services`} className="chipf" aria-current={!active}>{p.all} ({all.length})</a>
        {cats.map((c) => { const n = all.filter((x) => x.categoryId === c.id).length; return n ? <a key={c.id} className="chipf" aria-current={active?.id === c.id} href={`/${locale}/services?category=${c.id}`}>{pick(c.name, locale)} ({n})</a> : null; })}
      </nav>
      <p className="muted-s">{fmt(p.count, { n: list.length })}</p>
      {list.length === 0 ? <p>{p.noListings}</p> : (
        <div className="cards">
          {list.map((x) => (
            <a key={x.id} className="card" href={`/${locale}/services/${x.slug}`}>
              <DataBadge status={x.dataStatus} d={d} p={p} />
              <h2>{pick(x.name, locale)}</h2>
              <p>{pick(x.summary, locale)}</p>
              <p className="muted-s">{pick(x.area, locale)}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
