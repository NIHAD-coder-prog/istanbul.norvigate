import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { allLocalePaths } from "@/lib/paths";
import { kashida } from "@/lib/kashida";
import { CategoryIcon } from "@/components/Icons";
import { Roadmap } from "@/components/Roadmap";
import { getToolsDict } from "@/i18n/tools-dict";
import { getVisibility } from "@/lib/visibility";
import { SheenLogo } from "@/components/SheenLogo";
import { heroLogo } from "@/lib/hero-logo";
import { PrayerTimes } from "@/components/PrayerTimes";
import { WeatherMini } from "@/components/Weather";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: { canonical: `/${locale}`, languages: allLocalePaths("/") }, title: { absolute: `${getDictionary(locale).meta.name} — NORVIGATE` } };
}

const Dots = ({ items }: { items: string[] }) => (
  <>{items.map((x, i) => (<span key={x}>{i > 0 && <> <span className="dot" aria-hidden="true">•</span> </>}<span className="nw">{x}</span></span>))}</>
);

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const d = getDictionary(locale);
  const tl = getToolsDict(locale);
  const vis = await getVisibility();
  const logo = heroLogo();
  const ar = locale === "ar";
  const k = (s: string, n = 2) => (ar ? kashida(s, n) : s);
  const plain = d.hero.pre + d.hero.gold + d.hero.post;
  const h = (s: string) => `/${locale}/${s}`;
  const tileLinks = ["services", "things-to-do", "travel", "city-guide", "flights-hotels", "translation", "tools", "store"];
  const tiles = d.cats.map((c, i) => ({ c, i, slug: tileLinks[i] })).filter((t) => vis.show(t.slug));
  const enter = ["services", "things-to-do", "city-guide", "tools", "about"].find((x) => vis.show(x)) ?? "about";
  return (
    <>
      <div className="hero">
        <div className="ph" aria-hidden="true" />
        <div className="hero-in wrap">
          <SheenLogo className="lk" svg={logo.svg} vbX={logo.vbX} vbW={logo.vbW} />
          {locale !== "en" && (<p className="eb"><i /><span>{d.hero.name}</span><i /></p>)}
          <h1 aria-label={plain}>{ar ? kashida(d.hero.pre.trim(), 4) + " " : d.hero.pre}<em>{ar ? kashida(d.hero.gold, 4) : d.hero.gold}</em>{d.hero.post}</h1>
          <p className="hs">{d.hero.sub}</p>
          <p className="hd"><Dots items={d.hero.desc} /></p>
          {vis.show("search") && (<form className="search" action={h("search")} method="get" role="search">
            <input name="q" placeholder={d.hero.placeholder} aria-label={d.common.search} />
            <button type="submit">{d.hero.go}</button>
          </form>)}
        </div>
      </div>

      <div className="wrap">
        <div className={`doors${vis.show("premium") ? "" : " one"}`}>
          <a className="door f" href={h(enter)}><h3>{k(d.doors.free)}</h3><p><Dots items={d.doors.freeItems} /></p><span className="btn">{d.doors.enter}</span></a>
          {vis.show("premium") && <a className="door p" href={h("premium")}><h3>{k(d.doors.premium)}</h3><p><Dots items={d.doors.premiumItems} /></p><span className="btn">{d.doors.early}</span></a>}
        </div>
      </div>

      {vis.show("tools") && <div className="strip"><div className="wrap today">
        <b>{d.today.title}</b>
        <span className="today-p">{d.today.prayer}: <PrayerTimes t={tl} compact /></span>
        <span>{d.today.weather}: <WeatherMini t={tl} /></span>
        <span className="sample">{tl.calc} · 18° / 17°</span>
      </div></div>}

      <section className="s wrap" aria-labelledby="many-h" style={{ paddingBottom: 10 }}>
        <h2 id="many-h" className="sec-h" aria-label={d.many.title}>{k(d.many.title)}</h2>
        <div className="ew" aria-hidden="true"><span>{d.many.west}</span><i /><b className="dia" /><i /><span>{d.many.east}</span></div>
        <p className="lead">{d.many.text}</p>
        {tiles.length > 0 && <div className="tiles">
          {tiles.map(({ c, i, slug }) => (<a className="tile" key={c} href={h(slug)}><span className="ib"><CategoryIcon index={i} /></span><b>{c}</b></a>))}
        </div>}
      </section>

      {vis.showRoadmap && <Roadmap locale={locale} d={d} />}
    </>
  );
}
