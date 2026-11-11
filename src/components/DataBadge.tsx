import type { DataStatus } from "@/data/types";
import type { Dict } from "@/i18n/dictionaries";
import type { PagesDict } from "@/i18n/pages-dict";

/** Every record shows what it is: sample, editorial draft, or nothing extra when verified. */
export function DataBadge({ status, d, p }: { status: DataStatus; d: Dict; p: PagesDict }) {
  if (status === "verified") return null;
  return <span className="sample">{status === "sample" ? d.common.sample : p.editorial}</span>;
}
