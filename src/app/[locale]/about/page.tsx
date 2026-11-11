import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { allLocalePaths } from "@/lib/paths";
import { robotsFor } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).nav.about, alternates: { canonical: `/${locale}/about`, languages: allLocalePaths("/about") }, robots: robotsFor(true) };
}

export default async function About({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  await requireVisible("about");
  const d = getDictionary(locale), p = getPagesDict(locale);
  return (
    <div className="page wrap">
      <h1>{d.nav.about}</h1>
      <p className="intro">{p.aboutLead}</p>
      <h2>{d.many.title}</h2>
      <p>{d.many.text}</p>
      <h2>{p.aboutGates}</h2>
      <p>{p.aboutGatesText}</p>
      <h2>{p.aboutName}</h2>
      <ul className="names">
        <li><span className="syl" dir="ltr">NOR</span><span>{p.nor}</span></li>
        <li><span className="syl" dir="ltr">VIGI</span><span>{p.vigi}</span></li>
        <li><span className="syl" dir="ltr">GATE</span><span>{p.gate}</span></li>
      </ul>
      <p className="muted-s">{p.founder}: <span dir="ltr">Nihad Aldos</span> · {p.sister} <span dir="ltr">NORVIGIQ</span></p>
    </div>
  );
}
