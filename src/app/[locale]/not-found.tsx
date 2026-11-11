"use client";
import { useParams } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export default function NotFound() {
  const p = useParams<{ locale?: string }>();
  const locale = isLocale(p?.locale) ? p.locale : "en";
  const d = getDictionary(locale);
  return (
    <div className="stub wrap">
      <h1>{d.notFound.title}</h1>
      <p>{d.notFound.text}</p>
      <a className="back" href={`/${locale}`}>{d.common.back}</a>
    </div>
  );
}
