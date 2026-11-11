"use client";
import { useState } from "react";
import { useCart } from "./Cart";
import { InquiryForm } from "./InquiryForm";
import { formatMoney, formatWeight } from "@/lib/format";
import type { Locale } from "@/i18n/config";
import type { PagesDict } from "@/i18n/pages-dict";
import type { FormsDict } from "@/i18n/forms-dict";

export type CatalogueEntry = { name: string; label: string; priceMinor: number; weightGrams: number; slug: string };

export function CartView({ locale, p, dict, catalogue, note }: { locale: Locale; p: PagesDict; dict: FormsDict; catalogue: Record<string, CatalogueEntry>; note: string }) {
  const { lines, ready, setQty, remove, clear } = useCart();
  const [sent, setSent] = useState(false);
  if (!ready) return <p role="status">…</p>;
  // Lines whose product is no longer in the catalogue are ignored (the server re-checks every line anyway).
  const valid = lines.filter((l) => catalogue[l.id]);
  // After a successful request the cart is emptied, but the confirmation must stay on screen.
  if (valid.length === 0 && !sent) {
    return (<div><p>{p.cartEmpty}</p><a className="btn-p inl" href={`/${locale}/store`}>{p.continueShop}</a></div>);
  }
  const subtotal = valid.reduce((a, l) => a + catalogue[l.id].priceMinor * l.qty, 0);
  const weight = valid.reduce((a, l) => a + catalogue[l.id].weightGrams * l.qty, 0);
  return (
    <div>
      {valid.length > 0 && <ul className="cartlines">
        {valid.map((l) => { const c = catalogue[l.id]; return (
          <li key={l.id}>
            <div><a href={`/${locale}/store/${c.slug}`}><b>{c.name}</b></a><br /><span className="muted-s">{c.label} · {formatMoney(c.priceMinor, "TRY", locale)}</span></div>
            <label className="qtyl"><span className="muted-s">{p.qty}</span>
              <select value={l.qty} onChange={(e) => setQty(l.id, Number(e.target.value))} aria-label={`${p.qty}: ${c.name}`}>{Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}</select></label>
            <b>{formatMoney(c.priceMinor * l.qty, "TRY", locale)}</b>
            <button type="button" className="btn-o sm" onClick={() => remove(l.id)}>{p.remove}</button>
          </li>); })}
      </ul>}
      {valid.length > 0 && <p className="total">{p.subtotal}: <b>{formatMoney(subtotal, "TRY", locale)}</b> <span className="muted-s">· {p.weight}: {formatWeight(weight, locale)}</span></p>}
      {!sent && <div className="notice ok"><p>{note}</p></div>}
      <InquiryForm kind="order" locale={locale} dict={dict} extra={{ lines: valid.map((l) => ({ id: l.id, qty: l.qty })) }} onSuccess={() => { setSent(true); clear(); }} />
    </div>
  );
}
