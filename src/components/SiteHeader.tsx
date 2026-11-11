import { LangMenu } from "./LangMenu";
import { CurrencyMenu } from "./CurrencyMenu";
import { MobileMenu } from "./MobileMenu";
import { MoreMenu } from "./MoreMenu";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import type { Visibility } from "@/lib/visibility";

export function SiteHeader({ locale, d, vis }: { locale: Locale; d: Dict; vis: Visibility }) {
  const h = (slug: string) => `/${locale}/${slug}`;
  const nav = [
    { slug: "services", href: h("services"), label: d.nav.main[0] },
    { slug: "things-to-do", href: h("things-to-do"), label: d.nav.main[1] },
    { slug: "travel", href: h("travel"), label: d.nav.main[2] },
    { slug: "city-guide", href: h("city-guide"), label: d.nav.main[3] },
    { slug: "premium", href: h("premium"), label: d.nav.main[4] },
    { slug: "store", href: h("store"), label: d.nav.main[5] },
  ].filter((n) => vis.show(n.slug));
  const links = [
    { slug: "services", href: h("services"), label: d.cats[0], icon: 0 },
    { slug: "things-to-do", href: h("things-to-do"), label: d.cats[1], icon: 1 },
    { slug: "travel", href: h("travel"), label: d.cats[2], icon: 2 },
    { slug: "city-guide", href: h("city-guide"), label: d.cats[3], icon: 3 },
    { slug: "flights-hotels", href: h("flights-hotels"), label: d.cats[4], icon: 4 },
    { slug: "translation", href: h("translation"), label: d.cats[5], icon: 5 },
    { slug: "tools", href: h("tools"), label: d.cats[6], icon: 6 },
  ].filter((l) => vis.show(l.slug)).map(({ href, label, icon }) => ({ href, label, icon }));
  const more = [
    { slug: "flights-hotels", href: h("flights-hotels"), label: d.cats[4] }, { slug: "translation", href: h("translation"), label: d.cats[5] }, { slug: "tools", href: h("tools"), label: d.cats[6] },
    { slug: "faq", href: h("faq"), label: d.nav.faq }, { slug: "vision", href: h("vision"), label: d.nav.vision }, { slug: "about", href: h("about"), label: d.nav.about }, { slug: "contact", href: h("contact"), label: d.nav.contact },
  ].filter((m) => (m.slug === "vision" ? vis.showRoadmap : vis.show(m.slug)));
  return (
    <header className="site-top">
      <div className="top">
        <a className="brand" href={`/${locale}`} aria-label="NORVIGATE">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/norvigate-lockup-on-dark.svg" alt="NORVIGATE" width={300} height={36} />
        </a>
        <nav aria-label={d.common.menu}>
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
          <MoreMenu label={d.nav.more} links={more.map(({ href, label }) => ({ href, label }))} />
        </nav>
        <span className="sp" />
        <LangMenu locale={locale} label={d.common.language} />
        <CurrencyMenu label={d.common.currency} locale={locale} />
        {vis.show("list-business") && <a className="pill gold hide-m" href={h("list-business")}>{d.nav.list}</a>}
        {vis.show("list-business") && <a className="pill gold show-s" href={h("list-business")}>{d.nav.listShort}</a>}
        <MobileMenu
          locale={locale} menuLabel={d.common.menu} closeLabel={d.common.close} searchAction={h("search")} placeholder={d.hero.placeholder} go={d.hero.go}
          explore={d.nav.explore} gates={d.nav.gates} links={links} premium={vis.show("premium") ? { href: h("premium"), label: d.nav.main[4] } : null}
          store={vis.show("store") ? { href: h("store"), label: d.cats[7], icon: 7 } : null}
          showSearch={vis.show("search")} showList={vis.show("list-business")} listLabel={d.nav.list} listHref={h("list-business")} langLabel={d.common.language} currencyLabel={d.common.currency} logoAlt="NORVIGATE"
        />
      </div>
    </header>
  );
}
