import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireVisible } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { fmt } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionaries";
import { getPagesDict } from "@/i18n/pages-dict";
import { searchContent, type SearchType } from "@/lib/search";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string; type?: string }> };
const TYPES: SearchType[] = ["provider", "experience", "product", "guide"];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).common.search, robots: { index: false, follow: true } };
}

export default async function Search({ params, searchParams }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const vis = await requireVisible("search");
  const { q = "", type } = await searchParams;
  const d = getDictionary(locale), p = getPagesDict(locale);
  const query = q.trim().slice(0, 100);
  const active = TYPES.includes(type as SearchType) ? (type as SearchType) : undefined;
  const area: Record<string, string> = { provider: "services", experience: "things-to-do", product: "store", guide: "city-guide" };
  const all = query ? (await searchContent({ q: query, locale })).filter((h) => vis.show(area[h.type])) : [];
  const hits = active ? all.filter((h) => h.type === active) : all;
  const label: Record<SearchType, string> = { provider: p.tProvider, experience: p.tExperience, product: p.tProduct, guide: p.tGuide };
  const href = (t?: SearchType) => `/${locale}/search?q=${encodeURIComponent(query)}${t ? `&type=${t}` : ""}`;
  return (
    <div className="page wrap wide">
      <h1>{d.common.search}</h1>
      <form className="search inl" action={`/${locale}/search`} method="get" role="search">
        <input name="q" defaultValue={query} placeholder={d.hero.placeholder} aria-label={d.common.search} />
        <button type="submit">{d.hero.go}</button>
      </form>
      {!query ? <p className="intro" style={{ marginTop: 20 }}>{p.searchHint}</p> : (
        <>
          <nav className="chips" style={{ marginTop: 20 }}>
            <a className="chipf" href={href()} aria-current={!active}>{p.all} ({all.length})</a>
            {TYPES.map((t) => { const n = all.filter((h) => h.type === t).length; return n ? <a key={t} className="chipf" href={href(t)} aria-current={active === t}>{label[t]} ({n})</a> : null; })}
          </nav>
          <p className="muted-s" role="status">{hits.length ? fmt(p.results, { n: hits.length, q: query }) : p.noResults}</p>
          <div className="cards">
            {hits.map((h) => (
              <a key={`${h.type}-${h.id}`} className="card" href={`/${locale}${h.href}`}>
                <span className="muted-s">{label[h.type]}{h.sample ? ` · ${d.common.sample}` : ""}</span>
                <h2>{h.title}</h2><p>{h.summary}</p>{h.area && <p className="muted-s">{h.area}</p>}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
