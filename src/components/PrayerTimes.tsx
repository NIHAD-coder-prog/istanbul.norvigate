import { ISTANBUL, istanbulToday, prayerTimes } from "@/lib/prayer";
import type { ToolsDict } from "@/i18n/tools-dict";

const KEYS = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;

export function PrayerTimes({ t, compact = false }: { t: ToolsDict; compact?: boolean }) {
  const d = istanbulToday();
  const p = prayerTimes(d.y, d.m, d.d, ISTANBUL.lat, ISTANBUL.lng, ISTANBUL.tz);
  const list = compact ? KEYS.filter((k) => k !== "sunrise") : KEYS;
  if (compact) {
    return (<>{list.map((k) => (<span key={k} className="nw">{t[k]} <b dir="ltr">{p[k]}</b></span>))}</>);
  }
  return (
    <div>
      <ul className="ptimes">{list.map((k) => (<li key={k}><span>{t[k]}</span><b dir="ltr">{p[k]}</b></li>))}</ul>
      <p className="muted-s">{t.prMethod}</p>
    </div>
  );
}
