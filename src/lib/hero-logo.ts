import "server-only";
import fs from "node:fs";
import path from "node:path";

const STOPS = '<stop offset="0" stop-color="#b98a2d"/><stop offset=".35" stop-color="#f6dc8b"/><stop offset=".65" stop-color="#d9a643"/><stop offset="1" stop-color="#a77a22"/>';
/** Inline version of the Istanbul lockup whose gold shares one gradient (see SheenLogo). Read once per process. */
let cache: { svg: string; vbX: number; vbW: number } | null = null;
export function heroLogo() {
  if (cache) return cache;
  const raw = fs.readFileSync(path.join(process.cwd(), "public/brand/istanbul-lockup-on-dark.svg"), "utf8");
  const m = raw.match(/viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/);
  const vbX = m ? Number(m[1]) : 0, vbW = m ? Number(m[3]) : 2000;
  const def = `<defs><linearGradient id="nvSheen" gradientUnits="userSpaceOnUse" x1="${vbX - vbW * 0.05}" y1="0" x2="${vbX + vbW * 1.05}" y2="0">${STOPS}</linearGradient></defs>`;
  const svg = raw.replace(/fill="#d9a643"/g, 'fill="url(#nvSheen)"').replace(/(<svg[^>]*>)/, `$1${def}`).replace(/<svg /, '<svg style="width:100%;height:auto;display:block" ');
  cache = { svg, vbX, vbW };
  return cache;
}
