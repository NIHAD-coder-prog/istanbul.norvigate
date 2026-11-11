"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { convert, formatCurrencyAmount } from "@/lib/currency/convert";
import { loadRates, useDisplayCurrency } from "@/lib/display-currency";
import type { RatesPayload } from "@/lib/currency/types";
import type { Locale } from "@/i18n/config";
import type { PagesDict } from "@/i18n/pages-dict";

export type CartLine = { id: string; qty: number }; // id = "<productId>:<variantId>"
interface CartCtx { lines: CartLine[]; ready: boolean; count: number; add: (id: string, qty: number) => void; setQty: (id: string, qty: number) => void; remove: (id: string) => void; clear: () => void }
const Ctx = createContext<CartCtx | null>(null);
const KEY = "nv-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = JSON.parse(localStorage.getItem(KEY) || "[]"); if (Array.isArray(raw)) setLines(raw.filter((l) => typeof l?.id === "string" && Number.isInteger(l?.qty) && l.qty > 0 && l.qty <= 20)); } catch { /* storage unavailable: start empty */ }
    setReady(true);
  }, []);
  const save = useCallback((next: CartLine[]) => { setLines(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* keep in memory only */ } }, []);
  const value = useMemo<CartCtx>(() => ({
    lines, ready, count: lines.reduce((a, l) => a + l.qty, 0),
    add: (id, qty) => save(lines.some((l) => l.id === id) ? lines.map((l) => (l.id === id ? { ...l, qty: Math.min(20, l.qty + qty) } : l)) : [...lines, { id, qty: Math.min(20, qty) }]),
    setQty: (id, qty) => save(lines.map((l) => (l.id === id ? { ...l, qty: Math.max(1, Math.min(20, qty)) } : l))),
    remove: (id) => save(lines.filter((l) => l.id !== id)),
    clear: () => save([]),
  }), [lines, ready, save]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

export function CartLink({ locale, label }: { locale: Locale; label: string }) {
  const { count, ready } = useCart();
  return <a className="btn-o cartlink" href={`/${locale}/store/cart`}>{label}{ready && count > 0 ? ` (${count})` : ""}</a>;
}

export function AddToCart({ productId, variants, p, locale }: { productId: string; variants: { id: string; label: string; price: string }[]; p: PagesDict; locale: Locale }) {
  const { add } = useCart();
  const [variant, setVariant] = useState(variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const cur = variants.find((v) => v.id === variant);
  return (
    <div className="iform addbox">
      <div className="fgrid">
        <div className="fld"><label htmlFor="v-size">{p.size}</label>
          <select id="v-size" value={variant} onChange={(e) => { setVariant(e.target.value); setDone(false); }}>{variants.map((v) => <option key={v.id} value={v.id}>{v.label} — {v.price}</option>)}</select></div>
        <div className="fld"><label htmlFor="v-qty">{p.qty}</label>
          <select id="v-qty" value={qty} onChange={(e) => { setQty(Number(e.target.value)); setDone(false); }}>{Array.from({ length: 20 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
      </div>
      <p className="addprice">{cur?.price}</p>
      <button type="button" className="btn-p" onClick={() => { add(`${productId}:${variant}`, qty); setDone(true); }}>{p.addToCart}</button>
      <p className="muted-s" role="status">{done ? <>{p.added} · <a href={`/${locale}/store/cart`}>{p.cart}</a></> : ""}</p>
    </div>
  );
}

/** Approximate price in the visitor's display currency (only when rates are available; never invented). */
export function ApproxPrice({ minor, locale }: { minor: number; locale: Locale }) {
  const cur = useDisplayCurrency();
  const [rates, setRates] = useState<RatesPayload | null>(null);
  useEffect(() => { loadRates().then(setRates); }, []);
  if (cur === "TRY" || !rates) return null;
  const v = convert(minor / 100, "TRY", cur, rates);
  return v === null ? null : <span className="muted-s"> ≈ {formatCurrencyAmount(v, cur, locale)}</span>;
}
