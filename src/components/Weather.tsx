"use client";
import { useEffect, useState } from "react";
import type { ToolsDict } from "@/i18n/tools-dict";

type Cond = "clear" | "partly" | "fog" | "rain" | "snow" | "storm";
interface Data { temp: number; feels: number; wind: number; humidity: number; code: number; days: { date: string; min: number; max: number; code: number }[] }
const cond = (c: number): Cond => (c === 0 ? "clear" : c <= 3 ? "partly" : c === 45 || c === 48 ? "fog" : c >= 95 ? "storm" : (c >= 71 && c <= 77) || c === 85 || c === 86 ? "snow" : "rain");
const URL_ = "https://api.open-meteo.com/v1/forecast?latitude=41.0082&longitude=28.9784&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FIstanbul&forecast_days=4";

function useWeather() {
  const [data, setData] = useState<Data | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const ctl = new AbortController();
    fetch(URL_, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j) => {
        const c = j.current, d = j.daily;
        setData({ temp: c.temperature_2m, feels: c.apparent_temperature, wind: c.wind_speed_10m, humidity: c.relative_humidity_2m, code: c.weather_code,
          days: d.time.slice(1).map((date: string, i: number) => ({ date, min: d.temperature_2m_min[i + 1], max: d.temperature_2m_max[i + 1], code: d.weather_code[i + 1] })) });
      })
      .catch((e) => { if (e?.name !== "AbortError") setFailed(true); });
    return () => ctl.abort();
  }, []);
  return { data, failed };
}

export function Weather({ t, locale }: { t: ToolsDict; locale: string }) {
  const { data, failed } = useWeather();
  if (failed) return <p role="alert">{t.wxError}</p>;
  if (!data) return <p role="status">{t.wxLoading}</p>;
  const day = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" });
  const n = (v: number) => new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(v);
  return (
    <div>
      <p className="wx-big">{n(data.temp)}°C <span>{t[cond(data.code)]}</span></p>
      <p>{t.feels} {n(data.feels)}°C · {t.wind} {n(data.wind)} km/h · {t.humidity} {n(data.humidity)}%</p>
      <h3 style={{ marginBlock: "14px 6px" }}>{t.nextDays}</h3>
      <ul className="plain">{data.days.map((d) => (<li key={d.date}>{day.format(new Date(`${d.date}T12:00:00`))}: {n(d.min)}° / {n(d.max)}°C · {t[cond(d.code)]}</li>))}</ul>
      <p className="muted-s">{t.source}: <span dir="ltr">Open-Meteo</span></p>
    </div>
  );
}

export function WeatherMini({ t }: { t: ToolsDict }) {
  const { data, failed } = useWeather();
  if (failed) return <span>{t.wxError}</span>;
  if (!data) return <span>{t.wxLoading}</span>;
  return <span><b dir="ltr">{new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(data.temp)}°C</b> {t[cond(data.code)]}</span>;
}
