import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { pick } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { listGuide } from "@/lib/repo";
import { allLocalePaths } from "@/lib/paths";
import { formatDate } from "@/lib/format";
import { robotsFor } from "@/lib/seo";
import { DataBadge } from "@/components/DataBadge";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).nav.main[3], alternates: { canonical: `/${locale}/city-guide`, languages: allLocalePaths("/city-guide") }, robots: robotsFor(true) };
}

export default async function Guide({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("city-guide");
  const d = getDictionary(locale), p = getPagesDict(locale);
  const sections = await listGuide();
  return (
    <div className="page wrap">
      <h1>{d.nav.main[3]}</h1>
      <p className="intro">{p.guideLead}</p>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className="gsec">
          <h2>{pick(s.title, locale)}</h2>
          <p style={{ marginBottom: 8 }}><DataBadge status={s.dataStatus} d={d} p={p} /></p>
          {s.timeSensitive && <p className="flag" role="note">⚑ {p.timeSensitive}</p>}
          {s.body.map((b, i) => <p key={i}>{pick(b, locale)}</p>)}
          {s.links?.length > 0 && (
            <div><h3>{p.officialLinks}</h3>
              <ul className="plain">{s.links.map((l) => (<li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer">{pick(l.label, locale)}</a> <span className="muted-s">({p.newTab}; {p.checked} {formatDate(l.checkedAt, locale)})</span></li>))}</ul>
            </div>
          )}
          <p className="muted-s">{p.reviewed}: {formatDate(s.reviewedAt, locale)}</p>
        </section>
      ))}
    </div>
  );
}
