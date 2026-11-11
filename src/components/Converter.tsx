"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { convert, currencyName, currencyOptions, formatCurrencyAmount, formatRate, rateBetween } from "@/lib/currency/convert";
import { RATES_ATTRIBUTION, type RatesPayload } from "@/lib/currency/types";
import type { Locale } from "@/i18n/config";
import type { ToolsDict } from "@/i18n/tools-dict";

type State = { status: "loading" } | { status: "error" } | { status: "ok"; rates: RatesPayload };

export function Converter({ locale, t }: { locale: Locale; t: ToolsDict }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("TRY");

  const load = useCallback(() => {
    setState({ status: "loading" });
    fetch("/api/rates")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => (j?.ok ? setState({ status: "ok", rates: j as RatesPayload }) : setState({ status: "error" })))
      .catch(() => setState({ status: "error" }));
  }, []);
  useEffect(load, [load]);

  const codes = useMemo(() => (state.status === "ok" ? Object.keys(state.rates.rates) : []), [state]);
  const groups = useMemo(() => currencyOptions(codes, locale), [codes, locale]);

  if (state.status === "loading") return <p role="status">{t.loading}</p>;
  if (state.status === "error") {
    return (
      <div className="notice bad" role="alert">
        <h3>{t.unavailTitle}</h3><p>{t.unavailText}</p>
        <button type="button" className="btn-o" onClick={load}>{t.retry}</button>
      </div>
    );
  }
  const rates = state.rates;
  const n = Number(amount.replace(",", "."));
  const valid = amount.trim() !== "" && Number.isFinite(n) && n >= 0;
  const result = valid ? convert(n, from, to, rates) : null;
  const unit = rateBetween(from, to, rates);
  const opts = (
    <>
      <optgroup label={t.popular}>{groups.popular.map((o) => <option key={o.code} value={o.code}>{o.code} · {o.name}</option>)}</optgroup>
      <optgroup label={t.all}>{groups.others.map((o) => <option key={o.code} value={o.code}>{o.code} · {o.name}</option>)}</optgroup>
    </>
  );
  const date = rates.providerUpdatedAt ? new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(rates.providerUpdatedAt)) : "";
  return (
    <div className="conv iform">
      <div className="fgrid">
        <div className="fld full"><label htmlFor="cv-amount">{t.amount}</label><input id="cv-amount" type="text" dir="ltr" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} aria-invalid={valid ? undefined : true} /></div>
        <div className="fld"><label htmlFor="cv-from">{t.from}</label><select id="cv-from" value={from} onChange={(e) => setFrom(e.target.value)}>{opts}</select></div>
        <div className="fld"><label htmlFor="cv-to">{t.to}</label><select id="cv-to" value={to} onChange={(e) => setTo(e.target.value)}>{opts}</select></div>
      </div>
      <button type="button" className="btn-o" onClick={() => { setFrom(to); setTo(from); }}>⇄ {t.swap}</button>
      <div className="notice ok" aria-live="polite">
        <p className="muted-s">{t.result}</p>
        {result !== null ? (
          <>
            <p className="conv-r" dir="auto">{formatCurrencyAmount(n, from, locale)} = {formatCurrencyAmount(result, to, locale)}</p>
            {unit !== null && <p dir="auto">{t.rate}: 1 {from} = {formatRate(unit, locale)} {to} <span className="muted-s">({currencyName(from, locale)} → {currencyName(to, locale)})</span></p>}
          </>
        ) : <p>{t.amount}</p>}
      </div>
      <p className="muted-s">
        {date && <>{t.updated}: {date}. </>}{rates.stale && <>{t.stale} </>}{t.disclaimer}{" "}
        <a href={RATES_ATTRIBUTION.url} target="_blank" rel="noopener noreferrer" dir="ltr">{RATES_ATTRIBUTION.text}</a>
      </p>
    </div>
  );
}
