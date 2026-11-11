"use client";
import { useEffect, useState } from "react";
import { Dropdown } from "./Dropdown";
import { Chevron, CurrencyBadge } from "./Icons";
import { CURRENCY_COOKIE, type Locale } from "@/i18n/config";
import { currencyName, currencyOptions } from "@/lib/currency/convert";
import { CURRENCY_EVENT, loadRates, readCurrency } from "@/lib/display-currency";

const FALLBACK = ["TRY", "USD", "EUR", "GBP", "SAR", "AED", "QAR", "KWD", "EGP", "JOD", "CHF"];

/** Display-currency picker. Lists every currency the rate provider offers (falls back to a short list if rates are unavailable). */
export function CurrencyMenu({ label, locale, className = "hide-s" }: { label: string; locale: Locale; className?: string }) {
  const [code, setCode] = useState("TRY");
  const [groups, setGroups] = useState<{ popular: { code: string; name: string }[]; others: { code: string; name: string }[] } | null>(null);
  useEffect(() => {
    setCode(readCurrency());
    loadRates().then((r) => { if (r) setGroups(currencyOptions(Object.keys(r.rates), locale)); });
  }, [locale]);
  const fallback = FALLBACK.map((c) => ({ code: c, name: currencyName(c, locale) }));
  const items = groups ? [...groups.popular, ...groups.others] : fallback;
  const pop = groups ? groups.popular.length : 0;
  return (
    <Dropdown label={label} trigger={<><CurrencyBadge code={code} />{code}<Chevron /></>} className={className}>
      {(close) =>
        items.map((c, i) => (
          <li key={c.code} style={pop && i === pop ? { borderTop: "1px solid #d9e1ef", marginTop: 4, paddingTop: 4 } : undefined}>
            <button type="button" aria-current={c.code === code} onClick={() => { setCode(c.code); document.cookie = `${CURRENCY_COOKIE}=${c.code}; path=/; max-age=31536000; samesite=lax`; window.dispatchEvent(new Event(CURRENCY_EVENT)); close(); }}>
              <CurrencyBadge code={c.code} /><span dir="ltr"><b>{c.code}</b></span><span className="muted-s" style={{ margin: 0 }}>{c.name}</span>
            </button>
          </li>
        ))
      }
    </Dropdown>
  );
}
