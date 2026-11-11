import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dict } from "@/i18n/dictionaries";
import { getFormsDict, getIntro } from "@/i18n/forms-dict";
import { languageOptionGroups } from "@/i18n/world-languages";
import { allLocalePaths } from "@/lib/paths";
import { InquiryForm } from "./InquiryForm";
import { Status, type StatusKey } from "./Status";
import type { FormKind } from "@/lib/forms";

export function makeFormPage(opts: { slug: string; kind: FormKind; intro: string; title: (d: Dict) => string; status?: { key: StatusKey; idx: number } }) {
  async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    return { title: opts.title(getDictionary(locale)), description: getIntro(opts.intro, locale), alternates: { canonical: `/${locale}/${opts.slug}`, languages: allLocalePaths(`/${opts.slug}`) } };
  }
  async function Page({ params }: { params: Promise<{ locale: string }> }) {
    const { locale: raw } = await params;
    if (!isLocale(raw)) notFound();
    const locale = raw as Locale;
    await requireVisible(opts.slug);
    const d = getDictionary(locale);
    return (
      <div className="page wrap">
        <h1>{opts.title(d)}</h1>
        {opts.status && <p style={{ marginBottom: 12 }}><Status kind={opts.status.key} label={d.roadmap.statuses[opts.status.idx]} /></p>}
        <p className="intro">{getIntro(opts.intro, locale)}</p>
        {/* Language names come from the server's ICU, so every UI language lists them without hydration drift. */}
        <InquiryForm kind={opts.kind} locale={locale} dict={getFormsDict(locale)} languageGroups={opts.kind === "translation" ? languageOptionGroups(locale) : undefined} />
      </div>
    );
  }
  return { generateMetadata, Page };
}
