import { Status, type StatusKey } from "./Status";
import { kashida } from "@/lib/kashida";
import { readRoadmap } from "@/lib/roadmap";
import { LOCALE_META, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n/dictionaries";

const KEYS: StatusKey[] = ["live", "beta", "dev", "plan"];

export function Roadmap({ locale, d, as: H = "h2" }: { locale: Locale; d: Dict; as?: "h1" | "h2" }) {
  const r = d.roadmap;
  const roadmap = readRoadmap();
  const date = new Intl.DateTimeFormat(LOCALE_META[locale].intl, { dateStyle: "long", timeZone: "UTC" }).format(new Date(roadmap.reviewed + "T00:00:00Z"));
  const title = locale === "ar" ? kashida(r.title, 2) : r.title;
  return (
    <section className="s wrap" aria-labelledby="roadmap-h">
      <H id="roadmap-h" className="sec-h" aria-label={r.title}>{title}</H>
      <div className="lgd">
        {KEYS.map((k, i) => (
          <div className="lg" key={k}><Status kind={k} label={r.statuses[i]} /><p>{r.meanings[i]}</p></div>
        ))}
      </div>
      <ul className="rl">
        {roadmap.items.map((it) => (
          <li className="rr" key={it.id}>
            <span>{(r.items as Record<string, string>)[it.id]}</span>
            <Status kind={it.status as StatusKey} label={r.statuses[KEYS.indexOf(it.status as StatusKey)]} />
          </li>
        ))}
      </ul>
      <p className="note">{r.reviewed}: {date}</p>
    </section>
  );
}
