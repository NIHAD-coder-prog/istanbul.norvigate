import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { pick } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { getFormsDict, getIntro } from "@/i18n/forms-dict";
import { getExternalLinks } from "@/lib/repo";
import { allLocalePaths } from "@/lib/paths";
import { formatDate } from "@/lib/format";
import { robotsFor } from "@/lib/seo";
import { InquiryForm } from "@/components/InquiryForm";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).cats[4], alternates: { canonical: `/${locale}/flights-hotels`, languages: allLocalePaths("/flights-hotels") }, robots: robotsFor(true) };
}

export default async function FlightsHotels({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("flights-hotels");
  const d = getDictionary(locale), p = getPagesDict(locale);
  const [flights, hotels] = await Promise.all([getExternalLinks("flights"), getExternalLinks("hotels")]);
  const group = (title: string, list: typeof flights) => list.length > 0 && (
    <section className="gsec"><h2>{title}</h2>
      <ul className="plain">{list.map((l) => (
        <li key={l.id} className="ext"><a href={l.url} target="_blank" rel="noopener noreferrer" dir="auto"><b dir="ltr">{l.name}</b></a> <span className="muted-s">({p.newTab})</span><br />{pick(l.description, locale)} <span className="muted-s">{p.checked} {formatDate(l.checkedAt, locale)}</span></li>
      ))}</ul>
    </section>
  );
  return (
    <div className="page wrap">
      <h1>{d.cats[4]}</h1>
      <p className="intro">{getIntro("flights", locale)}</p>
      {group(p.flightsH, flights)}{group(p.hotelsH, hotels)}
      <p className="muted-s">{p.extNote}</p>
      <h2 style={{ marginTop: 28 }}>{p.askHelp}</h2>
      <InquiryForm kind="travelAssist" locale={locale} dict={getFormsDict(locale)} />
    </div>
  );
}
