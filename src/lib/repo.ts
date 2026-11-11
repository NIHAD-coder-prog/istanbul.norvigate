/**
 * Data access layer. Pages call these functions, never the files directly.
 * Content lives as JSON files (see lib/content.ts and CONTENT-AR.md): adding a record = adding a file.
 */
import { readAllergenLabels, readCollection } from "./content";
import type { LText } from "@/i18n/content";
import type { Experience, ExternalLink, FaqItem, GuideSection, Product, Provider, ProviderCategory } from "@/data/types";

export async function listProviderCategories(): Promise<ProviderCategory[]> { return readCollection<ProviderCategory>("categories"); }
export async function getProviderCategory(id: string): Promise<ProviderCategory | undefined> { return (await listProviderCategories()).find((c) => c.id === id); }

export async function listProviders(opts: { categoryId?: string } = {}): Promise<Provider[]> {
  return readCollection<Provider>("providers").filter((p) => !opts.categoryId || p.categoryId === opts.categoryId);
}
export async function getProvider(slug: string): Promise<Provider | undefined> { return (await listProviders()).find((p) => p.slug === slug); }

export async function listExperiences(): Promise<Experience[]> { return readCollection<Experience>("experiences"); }
export async function listProducts(opts: { categoryId?: string } = {}): Promise<Product[]> {
  return readCollection<Product>("products").filter((p) => !opts.categoryId || p.categoryId === opts.categoryId);
}
export async function getProduct(slug: string): Promise<Product | undefined> { return (await listProducts()).find((p) => p.slug === slug); }

export async function listFaq(): Promise<FaqItem[]> { return readCollection<FaqItem>("faq"); }
export async function listGuide(): Promise<GuideSection[]> { return readCollection<GuideSection>("guide"); }
export async function getExternalLinks(kind: ExternalLink["kind"]): Promise<ExternalLink[]> {
  return readCollection<ExternalLink>("external-links").filter((l) => l.kind === kind);
}
export async function getAllergenLabels(): Promise<Record<string, LText>> { return readAllergenLabels(); }
