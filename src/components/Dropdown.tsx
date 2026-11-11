"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export function Dropdown({ trigger, label, children, className = "", triggerClassName = "pill" }: { trigger: ReactNode; label: string; children: (close: () => void) => ReactNode; className?: string; triggerClassName?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  return (
    <div className={`dd ${className}`} ref={ref}>
      <button ref={btn} type="button" className={triggerClassName} aria-haspopup="true" aria-expanded={open} aria-controls={id} aria-label={label} onClick={() => setOpen((o) => !o)}>{trigger}</button>
      {open && <ul id={id} className="dd-list">{children(() => setOpen(false))}</ul>}
    </div>
  );
}
