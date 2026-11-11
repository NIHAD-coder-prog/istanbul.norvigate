const S = { fill: "none", stroke: "#1d66d0", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const G = { fill: "#d9a643", stroke: "#d9a643", strokeWidth: 1.6, strokeLinejoin: "round" } as const;

const ICONS: React.ReactNode[] = [
  <g key="0"><path {...S} d="M8 34h32M12 34a12 12 0 0 1 24 0M5 39h38M24 14v4" /><circle cx="24" cy="12" r="2.4" {...G} /></g>,
  <g key="1"><circle cx="24" cy="24" r="16" {...S} /><path {...G} d="M31 17l-4.5 9.5L17 31l4.5-9.5z" /><path {...S} d="M24 6v3M24 39v3M6 24h3M39 24h3" /></g>,
  <g key="2"><rect x="8" y="16" width="32" height="22" rx="5" {...S} /><path {...S} d="M17 16v-3a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3" /><rect x="21" y="24" width="6" height="7" rx="1.5" fill="#fff" stroke="#d9a643" strokeWidth="2" /></g>,
  <g key="3"><path {...S} d="M24 6a10 10 0 0 1 10 10c0 8-10 19-10 19S14 24 14 16A10 10 0 0 1 24 6z" /><circle cx="24" cy="16" r="3.6" {...G} /><path {...S} d="M10 42c4-3 8-3 14-3s10 0 14 3" /></g>,
  <g key="4"><path {...S} d="M43 7L5 22l14 6 6 14z" /><path d="M19 28L43 7" fill="none" stroke="#d9a643" strokeWidth="2.6" strokeLinecap="round" /><path {...S} d="M7 40h12" opacity=".5" /></g>,
  <g key="5"><path {...S} d="M9 8h20a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H19l-6 5v-5H9a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3z" /><path {...G} d="M25 22h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-3v5l-6-5h-5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3z" fillOpacity=".9" /><path d="M16 15h8M16 19h5" stroke="#1d66d0" strokeWidth="2.2" strokeLinecap="round" /></g>,
  <g key="6"><rect x="11" y="5" width="26" height="38" rx="5" {...S} /><rect x="16" y="10" width="16" height="9" rx="2" {...G} /><g fill="#1d66d0">{[18, 24, 30].flatMap((x) => [26, 33].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.9" />))}</g></g>,
  <g key="7"><path {...S} d="M11 16h26l2 25H9z" /><path {...S} d="M17 20v-4a7 7 0 0 1 14 0v4" /><path {...G} strokeWidth={0} d="M28 28a5 5 0 1 0 0 8 4 4 0 1 1 0-8z" /></g>,
];

export function CategoryIcon({ index, size = 34, light = false }: { index: number; size?: number; light?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" style={light ? { filter: "brightness(1.5)" } : undefined}>
      {ICONS[index]}
    </svg>
  );
}

export function GateIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M10 42V22a14 14 0 0 1 28 0v20z" fill="none" stroke="#d9a643" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M18 42V24a6 6 0 0 1 12 0v18" fill="#d9a643" />
    </svg>
  );
}

export function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </svg>
  );
}

export function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 4l4 4 4-4" /></svg>
  );
}

const SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", SAR: "﷼", AED: "د.إ", QAR: "﷼", KWD: "د.ك", EGP: "E£", JOD: "د.ا", CHF: "Fr" };

export function CurrencyBadge({ code }: { code: string }) {
  if (code === "TRY") {
    return (
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <defs><linearGradient id="lira-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6dc8b" /><stop offset="1" stopColor="#d9a643" /></linearGradient></defs>
        <circle cx="13" cy="13" r="12.4" fill="url(#lira-g)" />
        <g fill="none" stroke="#08192f" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.4 6.2V19.2" /><path d="M10.4 11.4C15.2 10 17.4 12.2 17.4 14.4C17.4 16.9 15 18.8 10.4 18.5" /><path d="M7.4 12.4L15.2 9.6M7.4 15.2L15.2 12.4" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }
  return <span className="cs" aria-hidden="true">{SYMBOLS[code] ?? code.slice(0, 1)}</span>;
}
