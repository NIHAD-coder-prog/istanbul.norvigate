// API checks for the forms endpoint. Usage: BASE=http://localhost:3100 NORVIGATE_DATA_DIR=/tmp/nvdata node scripts/test-api.mjs
import fs from "node:fs";
import path from "node:path";
const BASE = process.env.BASE || "http://localhost:3100";
const DIR = path.join(process.env.NORVIGATE_DATA_DIR || ".data", "submissions");
let pass = 0, fail = 0;
const ok = (name, cond, extra = "") => { (cond ? pass++ : fail++); console.log(`${cond ? "PASS" : "FAIL"}  ${name} ${cond ? "" : extra}`); };
const lines = (kind) => { try { return fs.readFileSync(path.join(DIR, `${kind}.jsonl`), "utf8").split("\n").filter(Boolean).length; } catch { return 0; } };
const post = (body, headers = {}) => fetch(`${BASE}/api/submit`, { method: "POST", headers: { "content-type": "application/json", origin: BASE, "x-forwarded-for": headers.xff || "10.0.0.1", ...headers }, body: typeof body === "string" ? body : JSON.stringify(body) });
const contact = { kind: "contact", locale: "ar", data: { name: "Test User", email: "test@example.com", topic: "general", message: "This is a long enough message.", consent: true } };

let r = await post(contact); let j = await r.json();
ok("valid contact accepted", r.status === 200 && j.ok && /^NV-\d{8}-[0-9A-F]{6}$/.test(j.id), JSON.stringify(j));
ok("contact stored as one JSON line", lines("contact") === 1, String(lines("contact")));
const rec = JSON.parse(fs.readFileSync(path.join(DIR, "contact.jsonl"), "utf8").trim().split("\n").pop());
ok("record has no IP or user-agent", !JSON.stringify(rec).match(/10\.0\.0\.1|ip|user-?agent/i) && rec.locale === "ar", JSON.stringify(rec));

r = await post({ ...contact, data: { ...contact.data, email: "nope" } }); j = await r.json();
ok("invalid email rejected with 422 + code", r.status === 422 && j.errors?.email === "email", JSON.stringify(j));
r = await post({ ...contact, data: { ...contact.data, consent: false } }); j = await r.json();
ok("missing consent rejected", r.status === 422 && j.errors?.consent === "consent");
const before = lines("contact");
r = await post({ ...contact, data: { ...contact.data, company_url: "http://spam.example" } }); j = await r.json();
ok("honeypot: fake success, nothing stored", r.status === 200 && j.id === "NV-00000000-000000" && lines("contact") === before);
r = await post(contact, { origin: "https://evil.example" });
ok("cross-origin POST rejected (403)", r.status === 403, String(r.status));
r = await post(JSON.stringify(contact), { "content-type": "text/plain" });
ok("non-JSON content type rejected (415)", r.status === 415, String(r.status));
r = await post("x".repeat(70000));
ok("oversized body rejected (413)", r.status === 413, String(r.status));
r = await post({ kind: "nope", data: {} });
ok("unknown kind rejected (400)", r.status === 400, String(r.status));
r = await fetch(`${BASE}/api/submit`);
ok("GET not allowed (405)", r.status === 405);
r = await post({ kind: "translation", locale: "fr", data: { name: "Test User", email: "t@example.com", serviceType: "written", sourceLanguage: "ar", targetLanguage: "ar", notes: "Some details here", consent: true } }); j = await r.json();
ok("same source/target language rejected", r.status === 422 && j.errors?.targetLanguage === "sameLanguage", JSON.stringify(j));
r = await post({ kind: "travelAssist", locale: "es", data: { requestKind: "hotel", name: "Test User", email: "t@example.com", destination: "Somewhere", travelers: "2", departDate: "2000-01-01", consent: true } }); j = await r.json();
ok("past date rejected", r.status === 422 && j.errors?.departDate === "pastDate", JSON.stringify(j));
r = await post({ kind: "premium", locale: "tr", data: { name: "Test User", email: "t@example.com", consent: true } }); j = await r.json();
ok("premium early-access accepted", r.status === 200 && j.ok, JSON.stringify(j));
r = await post({ kind: "listing", locale: "en", data: { businessName: "Sample Co", category: "shopping", contactPerson: "A B", email: "a@b.co", website: "ftp://x", description: "A description that is long enough to pass.", consent: true } }); j = await r.json();
ok("bad website URL rejected", r.status === 422 && j.errors?.website === "url", JSON.stringify(j));
// rate limit: 12 allowed per window per client, the 13th is refused
let last = 0; for (let i = 0; i < 14; i++) { last = (await post(contact, { xff: "10.9.9.9" })).status; }
ok("rate limit returns 429 after the window quota", last === 429, String(last));
// order requests: the server resolves prices from the catalogue and ignores anything the browser claims
const order = { name: "Test User", email: "t@example.com", country: "Testland", city: "Testville", address: "1 Test Street, Apt 2", consent: true };
r = await post({ kind: "order", locale: "tr", data: { ...order, lines: [{ id: "pr-tea:250", qty: 2, priceMinor: 1, unitMinor: 1 }] } }, { xff: "10.2.2.2" }); j = await r.json();
ok("order request accepted", r.status === 200 && j.ok, JSON.stringify(j));
const ord = JSON.parse(fs.readFileSync(path.join(DIR, "order.jsonl"), "utf8").trim().split("\n").pop());
ok("order total computed on the server from the catalogue (2 × 140.00 TRY)", ord.data.totalMinor === 28000 && ord.data.lines[0].unitMinor === 14000 && ord.data.currency === "TRY", JSON.stringify(ord.data));
r = await post({ kind: "order", locale: "en", data: { ...order, lines: [{ id: "pr-tea:999", qty: 1 }] } }, { xff: "10.2.2.2" }); j = await r.json();
ok("unknown variant rejected", r.status === 422 && j.errors?.lines === "lines", JSON.stringify(j));
r = await post({ kind: "order", locale: "en", data: { ...order, lines: [{ id: "pr-tea:250", qty: 99 }] } }, { xff: "10.2.2.2" }); j = await r.json();
ok("quantity above the limit rejected", r.status === 422 && j.errors?.lines === "lines");
r = await post({ kind: "order", locale: "en", data: { ...order, lines: [] } }, { xff: "10.2.2.2" }); j = await r.json();
ok("empty cart rejected", r.status === 422 && j.errors?.lines === "lines");
r = await fetch(`${BASE}/api/health`); ok("health endpoint ok", r.status === 200 && (await r.json()).ok === true);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
