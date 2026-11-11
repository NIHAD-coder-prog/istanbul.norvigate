import type { Product } from "@/data/types";

const BG: Record<string, [string, string]> = {
  sweets: ["#0a1f40", "#12315e"],
  packaged: ["#0b3a52", "#0a5470"],
  specialties: ["#10264a", "#1c3d70"],
  gifts: ["#1d1a47", "#2f2a7a"],
  "made-in-istanbul": ["#0d3b3a", "#12595a"],
};

const MOTIFS: Record<Product["motif"], React.ReactNode> = {
  delight: (
    <g>
      <rect x="18" y="40" width="30" height="30" rx="5" fill="#d9a643" />
      <rect x="40" y="30" width="30" height="30" rx="5" fill="#05bceb" />
      <rect x="52" y="52" width="30" height="30" rx="5" fill="#f3e2b3" />
      {[26, 34, 60, 66, 74, 58].map((x, i) => <circle key={i} cx={x} cy={[48, 60, 42, 50, 62, 70][i]} r="1.6" fill="#fff" opacity=".8" />)}
    </g>
  ),
  baklava: (
    <g>
      <path d="M50 18 82 44 50 70 18 44Z" fill="#e9c15f" />
      <path d="M50 30 70 46 50 62 30 46Z" fill="#d9a643" />
      <path d="M50 40 60 47 50 54 40 47Z" fill="#7ac943" />
      <path d="M18 44 50 70 82 44v10L50 80 18 54Z" fill="#a77a22" />
    </g>
  ),
  halva: (
    <g>
      <rect x="16" y="34" width="68" height="40" rx="6" fill="#e9d3a4" />
      {[26, 38, 50, 62, 74].map((x) => <path key={x} d={`M${x} 34v40`} stroke="#c9a96a" strokeWidth="2" />)}
      <rect x="16" y="28" width="68" height="10" rx="5" fill="#f4e4bd" />
    </g>
  ),
  tea: (
    <g>
      <path d="M26 44h42v16a18 18 0 0 1-18 18h-6a18 18 0 0 1-18-18V44Z" fill="#fff" opacity=".92" />
      <path d="M68 48h6a8 8 0 0 1 0 16h-8" fill="none" stroke="#fff" strokeWidth="5" />
      <path d="M38 36c-4-6 4-8 0-14M50 36c-4-6 4-8 0-14M62 36c-4-6 4-8 0-14" stroke="#05bceb" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="47" cy="44" rx="21" ry="4" fill="#d9a643" />
    </g>
  ),
  spread: (
    <g>
      <rect x="28" y="34" width="44" height="46" rx="8" fill="#8a4b1f" />
      <rect x="26" y="26" width="48" height="12" rx="4" fill="#d9a643" />
      <rect x="34" y="48" width="32" height="18" rx="4" fill="#fff" opacity=".9" />
    </g>
  ),
  spice: (
    <g>
      <path d="M20 56h60a30 24 0 0 1-60 0Z" fill="#fff" opacity=".92" />
      <path d="M26 56c4-20 44-20 48 0Z" fill="#d9531e" />
      <circle cx="42" cy="40" r="2" fill="#e9c15f" /><circle cx="58" cy="44" r="2" fill="#e9c15f" />
    </g>
  ),
  coffee: (
    <g>
      <path d="M32 40h36l-5 36H37Z" fill="#a77a22" />
      <path d="M32 40h36l-2 10H34Z" fill="#d9a643" />
      <path d="M68 46h8v18h-9" fill="none" stroke="#d9a643" strokeWidth="5" />
      <rect x="44" y="28" width="12" height="12" rx="3" fill="#d9a643" />
    </g>
  ),
  gift: (
    <g>
      <rect x="22" y="42" width="56" height="38" rx="4" fill="#d9a643" />
      <rect x="18" y="34" width="64" height="12" rx="3" fill="#e9c15f" />
      <rect x="46" y="34" width="8" height="46" fill="#05bceb" />
      <path d="M50 34c-12-14-24-6-14 0M50 34c12-14 24-6 14 0" fill="none" stroke="#05bceb" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  soap: (
    <g>
      <rect x="20" y="40" width="60" height="34" rx="12" fill="#cfe9a6" />
      <rect x="26" y="46" width="48" height="22" rx="8" fill="#e5f5c9" />
      <circle cx="74" cy="30" r="7" fill="none" stroke="#fff" strokeWidth="2.5" /><circle cx="62" cy="24" r="4" fill="none" stroke="#fff" strokeWidth="2.5" />
    </g>
  ),
  textile: (
    <g>
      <rect x="18" y="26" width="64" height="52" rx="4" fill="#fff" opacity=".92" />
      {[34, 46, 58, 70].map((y, i) => <rect key={y} x="18" y={y} width="64" height="6" fill={i % 2 ? "#d9a643" : "#0a1f40"} />)}
      {[24, 34, 44, 54, 64, 74].map((x) => <path key={x} d={`M${x} 78v8`} stroke="#fff" strokeWidth="2" />)}
    </g>
  ),
  olive: (
    <g>
      <rect x="40" y="18" width="20" height="14" rx="3" fill="#fff" />
      <path d="M40 32h20c10 6 14 14 14 24v22a4 4 0 0 1-4 4H30a4 4 0 0 1-4-4V56c0-10 4-18 14-24Z" fill="#9b1d2e" />
      <rect x="34" y="52" width="32" height="20" rx="3" fill="#fff" opacity=".9" />
    </g>
  ),
  nuts: (
    <g>
      <ellipse cx="38" cy="54" rx="14" ry="18" fill="#c68a4d" transform="rotate(-20 38 54)" />
      <ellipse cx="62" cy="52" rx="12" ry="16" fill="#8bbf5a" transform="rotate(18 62 52)" />
      <ellipse cx="50" cy="68" rx="13" ry="15" fill="#ddb06f" transform="rotate(8 50 68)" />
    </g>
  ),
};

/** Procedural illustration: no stock or invented photography, and always labelled as a sample. */
export function ProductArt({
  product,
  sampleLabel,
  small,
}: {
  product: Pick<Product, "motif" | "categoryId">;
  sampleLabel?: string;
  small?: boolean;
}) {
  const [a, b] = BG[product.categoryId] ?? BG.sweets;
  return (
    <div className={`product-art${small ? " product-art--sm" : ""}`} style={{ background: `linear-gradient(160deg, ${a}, ${b})` }} aria-hidden="true">
      <svg viewBox="0 0 100 100" role="presentation">{MOTIFS[product.motif]}</svg>
      {sampleLabel && !small ? <span className="chip chip--sample">{sampleLabel}</span> : null}
    </div>
  );
}
