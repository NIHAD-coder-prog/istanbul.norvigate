import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { legalBanner, legalDoc } from "@/i18n/legal-dict";
import { allLocalePaths } from "@/lib/paths";
import { robotsFor } from "@/lib/seo";

export function makeLegalPage(slug: string, key: string) {
  async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const doc = isLocale(locale) ? legalDoc(key, locale) : null;
    return { title: doc?.title, alternates: { canonical: `/${locale}/${slug}`, languages: allLocalePaths(`/${slug}`) }, robots: robotsFor(true) };
  }
  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: raw } = await params;
    if (!isLocale(raw)) notFound();
    const locale = raw as Locale;
    const doc = legalDoc(key, locale);
    if (!doc) notFound();
    return (
      <div className="page wrap">
        <h1>{doc.title}</h1>
        <p className="flag" role="note">{legalBanner(locale)}</p>
        {doc.sections.map((s) => (<section key={s.heading} className="gsec"><h2>{s.heading}</h2><p>{s.text}</p></section>))}
      </div>
    );
  }
  return { generateMetadata, Page };
}
