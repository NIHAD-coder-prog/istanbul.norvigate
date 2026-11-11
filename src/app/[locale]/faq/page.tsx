import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { pick } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { listFaq } from "@/lib/repo";
import { allLocalePaths } from "@/lib/paths";
import { robotsFor } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).nav.faq, alternates: { canonical: `/${locale}/faq`, languages: allLocalePaths("/faq") }, robots: robotsFor(true) };
}

export default async function Faq({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("faq");
  const d = getDictionary(locale), p = getPagesDict(locale);
  const items = await listFaq();
  return (
    <div className="page wrap">
      <h1>{d.nav.faq}</h1>
      <p className="intro">{p.faqLead}</p>
      {items.map((f) => (
        <details key={f.id} className="faq"><summary>{pick(f.q, locale)}</summary><p>{pick(f.a, locale)}</p></details>
      ))}
    </div>
  );
}
