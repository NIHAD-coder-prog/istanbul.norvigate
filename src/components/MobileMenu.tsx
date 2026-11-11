"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CategoryIcon, GateIcon } from "./Icons";
import { LOCALES, LOCALE_META, type Locale } from "@/i18n/config";
import { swapLocale } from "@/lib/paths";
import { setLocaleCookie } from "./LangMenu";
import { CurrencyMenu } from "./CurrencyMenu";

export type MenuLink = { href: string; label: string; icon: number };
export function MobileMenu(p: { locale: Locale; menuLabel: string; closeLabel: string; searchAction: string; placeholder: string; go: string; explore: string; gates: string; links: MenuLink[]; premium: { href: string; label: string } | null; store: MenuLink | null; showSearch: boolean; showList: boolean; listLabel: string; listHref: string; langLabel: string; currencyLabel: string; logoAlt: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || `/${p.locale}`;
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <>
      <button type="button" className="burger" aria-label={p.menuLabel} aria-expanded={open} onClick={() => setOpen(true)}>
        <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
      </button>
      {open && (
        <div className="mm" role="dialog" aria-modal="true" aria-label={p.menuLabel}>
          <div className="mm-head">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/norvigate-lockup-on-dark.svg" alt={p.logoAlt} />
            <span className="sp" />
            <button ref={first} type="button" className="burger" aria-label={p.closeLabel} onClick={() => setOpen(false)}>
              <svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M5 5l14 14M19 5L5 19" /></svg>
            </button>
          </div>
          {p.showSearch && <form action={p.searchAction} method="get" role="search" className="search">
            <input name="q" placeholder={p.placeholder} aria-label={p.go} />
            <button type="submit">{p.go}</button>
          </form>}
          <nav aria-label={p.menuLabel}>
            <div className="mm-g"><small>{p.explore}</small>
              {p.links.map((l) => (<a key={l.href} className="mm-i" href={l.href} onClick={() => setOpen(false)}><CategoryIcon index={l.icon} size={30} light />{l.label}</a>))}
            </div>
            {(p.premium || p.store) && <div className="mm-g"><small>{p.gates}</small>
              {p.premium && <a className="mm-i mm-gold" href={p.premium.href} onClick={() => setOpen(false)}><GateIcon />{p.premium.label}</a>}
              {p.store && <a className="mm-i" href={p.store.href} onClick={() => setOpen(false)}><CategoryIcon index={p.store.icon} size={30} light />{p.store.label}</a>}
            </div>}
          </nav>
          <div className="mm-lang" aria-label={p.langLabel}>
            {LOCALES.map((l) => (
              <a key={l} href={swapLocale(pathname, l)} lang={l} hrefLang={l} aria-current={l === p.locale}
                onClick={(e) => { e.preventDefault(); setLocaleCookie(l); window.location.assign(swapLocale(pathname, l) + window.location.search); }}>{LOCALE_META[l].native}</a>
            ))}
          </div>
          <div className="mm-row"><CurrencyMenu label={p.currencyLabel} locale={p.locale} className="" /></div>
          {p.showList && <div className="mm-row"><a className="pill gold" href={p.listHref} onClick={() => setOpen(false)}>{p.listLabel}</a></div>}
        </div>
      )}
    </>
  );
}
