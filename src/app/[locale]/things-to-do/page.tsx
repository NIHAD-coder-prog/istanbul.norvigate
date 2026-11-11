import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { pick } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { listExperiences } from "@/lib/repo";
import { allLocalePaths } from "@/lib/paths";
import { formatDate } from "@/lib/format";
import { robotsFor } from "@/lib/seo";
import { DataBadge } from "@/components/DataBadge";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).nav.main[1], alternates: { canonical: `/${locale}/things-to-do`, languages: allLocalePaths("/things-to-do") }, robots: robotsFor(true) };
}

export default async function Things({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("things-to-do");
  const d = getDictionary(locale), p = getPagesDict(locale);
  const list = await listExperiences();
  return (
    <div className="page wrap wide">
      <h1>{d.nav.main[1]}</h1>
      <p className="intro">{p.expLead}</p>
      <div className="cards">
        {list.map((e) => (
          <article key={e.id} id={e.slug} className="card static">
            <DataBadge status={e.dataStatus} d={d} p={p} />
            <h2>{pick(e.title, locale)}</h2>
            <p>{pick(e.description, locale)}</p>
            <p className="muted-s">{p.area}: {pick(e.area, locale)}{e.duration ? ` · ${p.duration}: ${pick(e.duration, locale)}` : ""}</p>
            <p className="muted-s">{p.reviewed}: {formatDate(e.lastUpdated, locale)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
