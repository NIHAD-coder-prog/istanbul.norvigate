import type { LText } from "@/i18n/content";

/**
 * Every record carries a dataStatus so the UI can never present demonstration content as verified.
 *  - "sample":    invented for demonstration (providers, prices, products, services)
 *  - "editorial": general descriptive text written for the guide; still draft, check official sources
 * "verified" is intentionally NOT used anywhere in V0.1: nothing has been verified with a real provider.
 */
/** sample = invented demonstration data; editorial = our own general text; verified = real data supplied and checked by the founder. */
export type DataStatus = "sample" | "editorial" | "verified";

export type ProviderCategoryId =
  | "accommodation"
  | "transport"
  | "business-services"
  | "food-dining"
  | "shopping"
  | "health-wellness"
  | "education"
  | "relocation"
  | "experiences";

export interface ProviderCategory {
  id: ProviderCategoryId;
  name: LText;
  description: LText;
  icon: string;
}

/** A provider profile. Optional fields are rendered only when present; nothing is invented. */
export interface Provider {
  id: string;
  slug: string;
  categoryId: ProviderCategoryId;
  name: LText;
  summary: LText;
  description: LText;
  /** District-level only. Street addresses are never invented. */
  area: LText;
  serviceArea?: LText;
  languages: string[];
  accessibility?: LText;
  /** Only set when verified. No sample listing has hours, phone, email or price. */
  openingHours?: LText;
  priceInfo?: LText;
  contact?: { phone?: string; email?: string; website?: string };
  lastUpdated: string; // ISO date
  dataStatus: DataStatus;
}

export type ExperienceCategory = "history" | "markets" | "waterfront" | "neighbourhoods";

export interface Experience {
  id: string;
  slug: string;
  category: ExperienceCategory;
  title: LText;
  summary: LText;
  description: LText;
  area: LText;
  duration?: LText;
  dataStatus: DataStatus;
  lastUpdated: string;
}

export type TravelCategory = "tours" | "transfers" | "transport" | "assistance";

export interface TravelService {
  id: string;
  slug: string;
  category: TravelCategory;
  title: LText;
  summary: LText;
  description: LText;
  location: LText;
  duration?: LText;
  inclusions: LText[];
  exclusions: LText[];
  /** Only set if a verified price exists. None do in V0.1. */
  indicativePrice?: LText;
  dataStatus: DataStatus;
  lastUpdated: string;
}

export type ProductCategoryId = "sweets" | "packaged" | "specialties" | "gifts" | "made-in-istanbul";

export type DestinationRuleStatus = "notEnabled" | "underReview" | "enabled";

export interface DestinationRule {
  /** ISO 3166-1 alpha-2, or "*" for "any destination not listed". */
  country: string;
  status: DestinationRuleStatus;
  /** What must be reviewed before this destination can be enabled. */
  reviewItems?: ("importRestrictions" | "foodLabelling" | "shippingFeasibility" | "fulfilment")[];
}

export interface ProductVariant {
  id: string;
  label: LText;
  weightGrams: number;
  /** Minor units (kuruş). Sample price. */
  priceMinor: number;
  currency: "TRY";
  sku?: string;
}

export interface Product {
  id: string;
  slug: string;
  categoryId: ProductCategoryId;
  name: LText;
  summary: LText;
  description: LText;
  /** Procedural illustration key (no stock or invented photography). */
  motif: "delight" | "baklava" | "halva" | "tea" | "spread" | "spice" | "coffee" | "gift" | "soap" | "textile" | "olive" | "nuts";
  variants: ProductVariant[];
  ingredients?: LText;
  allergens: { status: "unverified" | "verified"; contains: string[] };
  shelfLifeDays?: number;
  storage?: LText;
  /** Inventory is NOT synchronised in V0.1. */
  stock: { status: "unverified" | "inquire"; quantity?: number };
  shipping: {
    packageWeightGrams?: number;
    methods: string[]; // empty in V0.1: no shipping methods configured
    destinations: DestinationRule[];
  };
  /** Placeholder for later tax/duty disclosure. */
  taxes: { disclosure: "notCalculated" };
  fulfilment: { status: "notConfigured" };
  dataStatus: DataStatus;
  lastUpdated: string;
}

export interface FaqItem {
  id: string;
  q: LText;
  a: LText;
}

export interface GuideLink {
  label: LText;
  url: string;
  /** Date the link was fetched and confirmed to resolve. Links that were not confirmed are not included. */
  checkedAt: string;
}

export interface GuideSection {
  id: string;
  title: LText;
  body: LText[];
  /** Time-sensitive sections are flagged so readers know to verify. */
  timeSensitive: boolean;
  reviewedAt: string;
  links: GuideLink[];
  dataStatus: "editorial";
}

export interface ExternalLink {
  id: string;
  kind: "flights" | "hotels";
  name: string;
  description: LText;
  url: string;
  /** Date the page was fetched and its identity/purpose confirmed. Links that failed the check are not included. */
  checkedAt: string;
}
