import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getToolsDict } from "@/i18n/tools-dict";
import { allLocalePaths } from "@/lib/paths";
import { Converter } from "@/components/Converter";
import { Weather } from "@/components/Weather";
import { PrayerTimes } from "@/components/PrayerTimes";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).cats[6], alternates: { canonical: `/${locale}/tools`, languages: allLocalePaths("/tools") } };
}

export default async function Tools({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("tools");
  const d = getDictionary(locale);
  const t = getToolsDict(locale);
  return (
    <div className="page wrap">
      <h1>{d.cats[6]}</h1>
      <section className="tool" aria-labelledby="t-cv"><h2 id="t-cv">{t.cvTitle}</h2><Converter locale={locale} t={t} /></section>
      <section className="tool" aria-labelledby="t-pr"><h2 id="t-pr">{t.prTitle}</h2><PrayerTimes t={t} /></section>
      <section className="tool" aria-labelledby="t-wx"><h2 id="t-wx">{t.wxTitle}</h2><Weather t={t} locale={locale} /></section>
    </div>
  );
}
