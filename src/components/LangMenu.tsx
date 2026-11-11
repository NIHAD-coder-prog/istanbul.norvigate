"use client";
import { usePathname } from "next/navigation";
import { Dropdown } from "./Dropdown";
import { Chevron, GlobeIcon } from "./Icons";
import { LOCALES, LOCALE_COOKIE, LOCALE_META, type Locale } from "@/i18n/config";
import { swapLocale } from "@/lib/paths";

export function setLocaleCookie(l: string) {
  document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
}

export function LangMenu({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() || `/${locale}`;
  return (
    <Dropdown label={label} trigger={<><GlobeIcon />{LOCALE_META[locale].native}<Chevron /></>} className="hide-s">
      {(close) =>
        LOCALES.map((l) => (
          <li key={l}>
            <a
              href={swapLocale(pathname, l)}
              lang={l}
              hrefLang={l}
              aria-current={l === locale}
              onClick={(e) => {
                e.preventDefault();
                setLocaleCookie(l);
                close();
                window.location.assign(swapLocale(pathname, l) + window.location.search + window.location.hash);
              }}
            >
              {LOCALE_META[l].native}
            </a>
          </li>
        ))
      }
    </Dropdown>
  );
}
