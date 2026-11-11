import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVisibility } from "@/lib/visibility";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { allLocalePaths } from "@/lib/paths";
import { Roadmap } from "@/components/Roadmap";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: getDictionary(locale).nav.vision, alternates: { canonical: `/${locale}/vision`, languages: allLocalePaths("/vision") } };
}

export default async function Vision({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  if (!(await getVisibility()).showRoadmap) notFound();
  return <Roadmap locale={locale} d={getDictionary(locale)} as="h1" />;
}
