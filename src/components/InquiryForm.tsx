"use client";
import { useRef, useState, type FormEvent } from "react";
import { formSpecs, validateForm, todayISO, type FormErrors, type FormKind, type FormValues } from "@/lib/forms";
import type { LanguageOptionGroups } from "@/i18n/world-languages";
import type { FormsDict } from "@/i18n/forms-dict";
import type { Locale } from "@/i18n/config";

type Phase = "idle" | "sending" | "success" | "error";

/** Spec-driven form. Validates in the browser, again on the server; success is shown only when the server says ok. */
export function InquiryForm({ kind, locale, dict, languageGroups, extra, onSuccess }: { kind: FormKind; locale: Locale; dict: FormsDict; languageGroups?: LanguageOptionGroups; extra?: Record<string, unknown>; onSuccess?: () => void }) {
  const spec = formSpecs[kind];
  const [values, setValues] = useState<FormValues>(() => Object.fromEntries(spec.map((f) => [f.name, f.type === "checkbox" ? false : ""])));
  const [errors, setErrors] = useState<FormErrors>({});
  const [phase, setPhase] = useState<Phase>("idle");
  const [requestId, setRequestId] = useState("");
  const [serverMsg, setServerMsg] = useState("");
  const summary = useRef<HTMLDivElement>(null);
  const hp = useRef<HTMLInputElement>(null);
  const { fields, options, errors: errMsg, ui } = dict;
  const langs = languageGroups ?? { common: [], all: [] };
  const today = todayISO();

  const set = (name: string, v: string | boolean) => {
    setValues((p) => ({ ...p, [name]: v }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (phase === "sending") return;
    const found = validateForm(kind, values);
    setErrors(found);
    if (Object.keys(found).length) { setPhase("idle"); requestAnimationFrame(() => summary.current?.focus()); return; }
    setPhase("sending");
    try {
      const res = await fetch("/api/submit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, locale, data: { ...values, ...(extra ?? {}), company_url: hp.current?.value ?? "" } }) });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.ok) { setRequestId(String(json.id ?? "")); setPhase("success"); onSuccess?.(); }
      else if (res.status === 422 && json?.errors) { setErrors(json.errors); setPhase("idle"); requestAnimationFrame(() => summary.current?.focus()); }
      else { setServerMsg(res.status === 429 ? ui.rateLimited : ui.serverError); setPhase("error"); }
    } catch { setServerMsg(ui.networkError); setPhase("error"); }
  }

  if (phase === "success") {
    return (
      <div className="notice ok" role="status">
        <h2>{ui.successTitle}</h2>
        <p>{ui.successBody}</p>
        {requestId && <p><strong>{ui.requestId}:</strong> <span dir="ltr" className="code">{requestId}</span></p>}
        <button type="button" className="btn-o" onClick={() => { setValues(Object.fromEntries(spec.map((f) => [f.name, f.type === "checkbox" ? false : ""]))); setErrors({}); setPhase("idle"); }}>{ui.another}</button>
      </div>
    );
  }

  const list = spec.filter((f) => errors[f.name]);
  const general = Object.keys(errors).filter((k) => !spec.some((f) => f.name === k));
  return (
    <form onSubmit={submit} noValidate aria-busy={phase === "sending"} className="iform">
      {(list.length > 0 || general.length > 0) && (
        <div className="notice bad" role="alert" tabIndex={-1} ref={summary}>
          <h3>{ui.summaryTitle}</h3>
          <ul>{general.map((k) => (<li key={k}>{errMsg[errors[k]] ?? errMsg.invalid}</li>))}{list.map((f) => (<li key={f.name}><a href={`#f-${f.name}`} onClick={(e) => { e.preventDefault(); document.getElementById(`f-${f.name}`)?.focus(); }}>{fields[f.name]}: {errMsg[errors[f.name]] ?? errMsg.invalid}</a></li>))}</ul>
        </div>
      )}
      <div className="hp" aria-hidden="true"><label>Website<input ref={hp} type="text" name="company_url" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="fgrid">
        {spec.map((f) => {
          const id = `f-${f.name}`, err = errors[f.name], errId = `${id}-err`;
          const c = { id, name: f.name, "aria-invalid": err ? true : undefined, "aria-describedby": err ? errId : undefined, "aria-required": f.required ? true : undefined, autoComplete: f.autoComplete } as const;
          const full = !f.half || f.type === "textarea" || f.type === "checkbox";
          if (f.type === "checkbox") {
            return (
              <div key={f.name} className="fld full">
                <label className="chk"><input type="checkbox" id={id} name={f.name} checked={values[f.name] === true} onChange={(e) => set(f.name, e.target.checked)} aria-invalid={err ? true : undefined} aria-describedby={err ? errId : undefined} /><span>{fields[f.name]} *</span></label>
                {err && <p className="ferr" id={errId}>{errMsg[err] ?? errMsg.invalid}</p>}
              </div>
            );
          }
          let control;
          if (f.type === "textarea") control = <textarea {...c} rows={f.rows ?? 4} maxLength={f.max} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
          else if (f.type === "select") {
            const labels = f.optionGroup ? options[f.optionGroup] ?? {} : {};
            control = (
              <select {...c} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}>
                <option value="">{ui.select}</option>
                {f.languages ? (<>
                  <optgroup label={ui.commonLanguages}>{langs.common.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</optgroup>
                  <optgroup label={ui.otherLanguages}>{langs.all.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}<option value="other">{ui.otherLanguage}</option></optgroup>
                </>) : (f.options ?? []).map((o) => <option key={o} value={o}>{labels[o] ?? o}</option>)}
              </select>
            );
          } else if (f.type === "date") control = <input {...c} type="date" min={today} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
          else if (f.type === "number") control = <input {...c} type="number" inputMode="numeric" min={f.min} max={f.max} step={1} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
          else control = <input {...c} type={f.type} maxLength={f.max} dir={f.type === "email" || f.type === "url" || f.type === "tel" ? "ltr" : undefined} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} />;
          return (
            <div key={f.name} className={`fld${full ? " full" : ""}`}>
              <label htmlFor={id}>{fields[f.name]}{f.required ? " *" : ""}</label>
              {control}
              {err && <p className="ferr" id={errId}>{errMsg[err] ?? errMsg.invalid}</p>}
            </div>
          );
        })}
      </div>
      {phase === "error" && (<div className="notice bad" role="alert"><h3>{ui.notSent}</h3><p>{serverMsg}</p></div>)}
      <button type="submit" className="btn-p" disabled={phase === "sending"}>{phase === "sending" ? ui.submitting : phase === "error" ? ui.retry : ui[`submit.${kind}`]}</button>
    </form>
  );
}
