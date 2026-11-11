import { HUB_URL, SISTER_URL, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";
import { legalTitle } from "@/i18n/legal-dict";
import type { Visibility } from "@/lib/visibility";

export function SiteFooter({ locale, d, vis }: { locale: Locale; d: Dict; vis: Visibility }) {
  const h = (s: string) => `/${locale}/${s}`;
  const L = (slug: string, label: string) => (vis.show(slug) ? <a href={h(slug)}>{label}</a> : null);
  return (
    <footer className="foot">
      <div className="wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/istanbul-lockup-on-dark.svg" alt="NORVIGATE Istanbul International Gate" style={{ height: 46, width: "auto" }} />
        <p className="fn">{d.meta.name}</p>
        <div className="foot-g">
          <div><h4>{d.nav.explore}</h4>
            {L("services", d.cats[0])}{L("things-to-do", d.cats[1])}{L("travel", d.cats[2])}{L("city-guide", d.cats[3])}
          </div>
          <div><h4>{d.nav.more}</h4>
            {L("flights-hotels", d.cats[4])}{L("translation", d.cats[5])}{L("tools", d.cats[6])}{L("faq", d.nav.faq)}{vis.showRoadmap && <a href={h("vision")}>{d.nav.vision}</a>}
          </div>
          <div><h4>{d.nav.gates}</h4>
            {L("premium", d.nav.main[4])}{L("store", d.cats[7])}{L("list-business", d.nav.list)}
          </div>
          <div><h4>NORVIGATE</h4>
            {L("about", d.nav.about)}<a href={h("contact")}>{d.nav.contact}</a><a href={h("privacy")}>{d.nav.privacy}</a><a href={h("terms")}>{d.nav.terms}</a><a href={h("shipping-returns")}>{legalTitle("shipping", locale)}</a><a href={h("cookies")}>{legalTitle("cookies", locale)}</a>
            <a href={HUB_URL} rel="noopener">{d.nav.hub}<small dir="ltr">norvigate.com</small></a>
            <a href={SISTER_URL} rel="noopener">{d.nav.sister}<small dir="ltr">NORVIGIQ</small></a>
          </div>
        </div>
        <p className="co" dir="ltr">A NORVIGIQ COMPANY</p>
      </div>
    </footer>
  );
}
