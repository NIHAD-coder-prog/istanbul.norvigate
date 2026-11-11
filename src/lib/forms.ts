import { worldLanguageCodes, OTHER_LANGUAGE } from "@/i18n/world-languages";

/**
 * Form definitions and validation, shared by the browser (instant feedback) and the server (authoritative).
 * Error values are CODES mapped to localized messages by the UI.
 */
export type FormKind = "contact" | "listing" | "tourism" | "translation" | "travelAssist" | "premium" | "order";
export const formKinds: FormKind[] = ["contact", "listing", "tourism", "translation", "travelAssist", "premium", "order"];
export type FieldType = "text" | "email" | "tel" | "url" | "textarea" | "select" | "date" | "number" | "checkbox";

export interface FieldSpec {
  name: string;
  type: FieldType;
  required?: boolean;
  min?: number;
  max?: number;
  options?: readonly string[];
  optionGroup?: string;
  languages?: boolean;
  autoComplete?: string;
  half?: boolean;
  rows?: number;
}

export const contactTopics = ["general", "business", "listing", "store", "translation", "other"] as const;
export const listingCategories = ["travel-tourism", "real-estate", "shopping", "business-investment", "education", "health-wellness", "other"] as const;
export const requestTypes = ["trip", "transport", "stay", "experience", "other"] as const;
export const translationTypes = ["written", "interpreting", "assistance", "certified"] as const;
export const requestKinds = ["flight", "hotel"] as const;
const languageValues: readonly string[] = [...worldLanguageCodes, OTHER_LANGUAGE];
const consent: FieldSpec = { name: "consent", type: "checkbox", required: true };

export const formSpecs: Record<FormKind, FieldSpec[]> = {
  contact: [
    { name: "name", type: "text", required: true, min: 2, max: 120, autoComplete: "name", half: true },
    { name: "email", type: "email", required: true, max: 254, autoComplete: "email", half: true },
    { name: "topic", type: "select", required: true, options: contactTopics, optionGroup: "topic" },
    { name: "message", type: "textarea", required: true, min: 10, max: 4000, rows: 6 },
    consent,
  ],
  listing: [
    { name: "businessName", type: "text", required: true, min: 2, max: 160, half: true },
    { name: "category", type: "select", required: true, options: listingCategories, optionGroup: "category", half: true },
    { name: "contactPerson", type: "text", required: true, min: 2, max: 120, autoComplete: "name", half: true },
    { name: "email", type: "email", required: true, max: 254, autoComplete: "email", half: true },
    { name: "phone", type: "tel", max: 32, autoComplete: "tel", half: true },
    { name: "website", type: "url", max: 300, autoComplete: "url", half: true },
    { name: "description", type: "textarea", required: true, min: 20, max: 3000, rows: 6 },
    consent,
  ],
  tourism: [
    { name: "requestType", type: "select", required: true, options: requestTypes, optionGroup: "requestType" },
    { name: "name", type: "text", required: true, min: 2, max: 120, autoComplete: "name", half: true },
    { name: "email", type: "email", required: true, max: 254, autoComplete: "email", half: true },
    { name: "phone", type: "tel", max: 32, autoComplete: "tel", half: true },
    { name: "travelers", type: "number", required: true, min: 1, max: 50, half: true },
    { name: "preferredDate", type: "date", half: true },
    { name: "notes", type: "textarea", required: true, min: 10, max: 3000, rows: 5 },
    consent,
  ],
  translation: [
    { name: "name", type: "text", required: true, min: 2, max: 120, autoComplete: "name", half: true },
    { name: "email", type: "email", required: true, max: 254, autoComplete: "email", half: true },
    { name: "serviceType", type: "select", required: true, options: translationTypes, optionGroup: "translationType" },
    { name: "sourceLanguage", type: "select", required: true, options: languageValues, languages: true, half: true },
    { name: "targetLanguage", type: "select", required: true, options: languageValues, languages: true, half: true },
    { name: "deadline", type: "date", half: true },
    { name: "notes", type: "textarea", required: true, min: 10, max: 3000, rows: 5 },
    consent,
  ],
  travelAssist: [
    { name: "requestKind", type: "select", required: true, options: requestKinds, optionGroup: "requestKind" },
    { name: "name", type: "text", required: true, min: 2, max: 120, autoComplete: "name", half: true },
    { name: "email", type: "email", required: true, max: 254, autoComplete: "email", half: true },
    { name: "origin", type: "text", max: 120, half: true },
    { name: "destination", type: "text", required: true, min: 2, max: 120, half: true },
    { name: "departDate", type: "date", half: true },
    { name: "returnDate", type: "date", half: true },
    { name: "travelers", type: "number", required: true, min: 1, max: 50, half: true },
    { name: "notes", type: "textarea", max: 3000, rows: 4 },
    consent,
  ],
  order: [
    { name: "name", type: "text", required: true, min: 2, max: 120, autoComplete: "name", half: true },
    { name: "email", type: "email", required: true, max: 254, autoComplete: "email", half: true },
    { name: "phone", type: "tel", max: 32, autoComplete: "tel", half: true },
    { name: "country", type: "text", required: true, min: 2, max: 80, autoComplete: "country-name", half: true },
    { name: "city", type: "text", required: true, min: 2, max: 80, autoComplete: "address-level2", half: true },
    { name: "address", type: "textarea", required: true, min: 8, max: 400, rows: 3, autoComplete: "street-address" },
    { name: "notes", type: "textarea", max: 1000, rows: 3 },
    consent,
  ],
  premium: [
    { name: "name", type: "text", required: true, min: 2, max: 120, autoComplete: "name", half: true },
    { name: "email", type: "email", required: true, max: 254, autoComplete: "email", half: true },
    { name: "organization", type: "text", max: 160 },
    { name: "message", type: "textarea", max: 2000, rows: 4 },
    consent,
  ],
};

export type FormValues = Record<string, string | boolean>;
export type FormErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const todayISO = (now = new Date()) => now.toISOString().slice(0, 10);
/** One day of slack so a visitor whose local date differs from UTC is never told today is in the past. */
export const earliestAllowedDate = (now = new Date()) => new Date(now.getTime() - 24 * 3600 * 1000).toISOString().slice(0, 10);

function isValidISODate(s: string) {
  if (!ISO_DATE_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
function isValidUrl(s: string) {
  try { const u = new URL(s); return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes("."); } catch { return false; }
}
function isValidPhone(s: string) {
  if (!/^[+()\d][\d\s().-]*$/.test(s)) return false;
  const n = s.replace(/\D/g, "").length;
  return n >= 6 && n <= 15;
}

export function validateForm(kind: FormKind, values: FormValues, opts: { now?: Date } = {}): FormErrors {
  const errors: FormErrors = {};
  const earliest = earliestAllowedDate(opts.now);
  for (const f of formSpecs[kind]) {
    const raw = values[f.name];
    if (f.type === "checkbox") {
      if (f.required && raw !== true && raw !== "true" && raw !== "on") errors[f.name] = "consent";
      continue;
    }
    const v = typeof raw === "string" ? raw.trim() : "";
    if (!v) { if (f.required) errors[f.name] = "required"; continue; }
    switch (f.type) {
      case "email": errors[f.name] = v.length > (f.max ?? 254) ? "tooLong" : !EMAIL_RE.test(v) ? "email" : ""; break;
      case "url": errors[f.name] = v.length > (f.max ?? 300) ? "tooLong" : !isValidUrl(v) ? "url" : ""; break;
      case "tel": errors[f.name] = v.length > (f.max ?? 32) ? "tooLong" : !isValidPhone(v) ? "phone" : ""; break;
      case "select": errors[f.name] = f.options && !f.options.includes(v) ? "invalid" : ""; break;
      case "date": errors[f.name] = !isValidISODate(v) ? "invalid" : v < earliest ? "pastDate" : ""; break;
      case "number": { const n = Number(v); errors[f.name] = !Number.isInteger(n) || n < (f.min ?? 0) || n > (f.max ?? 1_000_000) ? "range" : ""; break; }
      default: errors[f.name] = f.min && v.length < f.min ? "tooShort" : f.max && v.length > f.max ? "tooLong" : "";
    }
    if (!errors[f.name]) delete errors[f.name];
  }
  if (kind === "translation" && !errors.sourceLanguage && !errors.targetLanguage) {
    const s = values.sourceLanguage, t = values.targetLanguage;
    if (s && t && s === t && s !== OTHER_LANGUAGE) errors.targetLanguage = "sameLanguage";
  }
  if (kind === "travelAssist" && !errors.departDate && !errors.returnDate) {
    const a = values.departDate, b = values.returnDate;
    if (typeof a === "string" && typeof b === "string" && a && b && b < a) errors.returnDate = "dateOrder";
  }
  return errors;
}
