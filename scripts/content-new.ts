import fs from "node:fs";
import path from "node:path";

// Creates a ready-to-edit content file. Usage: npm run content:new -- provider "My Business Name"
const [kind, ...rest] = process.argv.slice(2);
const title = rest.join(" ").trim();
const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-") || "item";
const today = new Date().toISOString().slice(0, 10);
const root = path.resolve(process.env.NORVIGATE_CONTENT_DIR || "content");
const T = (s: string) => ({ en: s, tr: "", ar: "", es: "", fr: "" });
if (!["provider", "experience", "product", "faq"].includes(kind) || !title) {
  console.error('Usage: npm run content:new -- <provider|experience|product|faq> "Title"'); process.exit(1);
}
const slug = slugify(title);
const dirs: Record<string, string> = { provider: "providers", experience: "experiences", product: "products", faq: "faq" };
const templates: Record<string, object> = {
  provider: { id: `p-${slug}`, slug, categoryId: "business-services", name: T(title), summary: T("One short sentence."), description: T("A few sentences about the business."), area: T("District"), languages: ["en"], lastUpdated: today, dataStatus: "verified" },
  experience: { id: `e-${slug}`, title: T(title), summary: T("One short sentence."), description: T("A few sentences."), area: T("District"), duration: T("About 1 hour"), dataStatus: "verified" },
  product: { id: `pr-${slug}`, slug, categoryId: "sweets", motif: "gift", name: T(title), summary: T("One short sentence."), description: T("Description."), variants: [{ id: "std", label: T("Standard"), weightGrams: 0, priceMinor: 0, currency: "TRY" }], ingredients: T(""), allergens: { status: "unverified", contains: [] }, storage: T(""), stock: { status: "unverified" }, shipping: { methods: [], destinations: [] }, taxes: { disclosure: "notCalculated" }, fulfilment: { status: "notConfigured" }, dataStatus: "verified", lastUpdated: today },
  faq: { id: slug, q: T(title), a: T("Answer.") },
};
const dir = path.join(root, dirs[kind]); fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `${slug}.json`);
if (fs.existsSync(file)) { console.error(`${file} already exists`); process.exit(1); }
fs.writeFileSync(file, JSON.stringify(templates[kind], null, 2) + "\n");
console.log(`Created ${file}\nFill the English text (en) — other languages are optional and fall back to English. Then run: npm run content:check`);
