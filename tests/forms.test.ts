import { test } from "node:test";
import assert from "node:assert/strict";
import { validateForm } from "../src/lib/forms";

const base = { name: "Ada Lovelace", email: "ada@example.com", topic: "general", message: "A sufficiently long message.", consent: true };
test("valid contact passes", () => assert.deepEqual(validateForm("contact", base), {}));
test("missing fields are reported as required", () => assert.equal(validateForm("contact", {}).name, "required"));
test("bad email", () => assert.equal(validateForm("contact", { ...base, email: "x@y" }).email, "email"));
test("consent is mandatory", () => assert.equal(validateForm("contact", { ...base, consent: false }).consent, "consent"));
test("unknown select value is invalid", () => assert.equal(validateForm("contact", { ...base, topic: "hack" }).topic, "invalid"));
test("website must be http(s) with a dot", () => {
  const v = { businessName: "Co", category: "shopping", contactPerson: "A B", email: "a@b.co", description: "x".repeat(30), consent: true };
  assert.equal(validateForm("listing", { ...v, website: "javascript:alert(1)" }).website, "url");
  assert.deepEqual(validateForm("listing", { ...v, website: "https://example.com" }), {});
});
test("dates in the past are rejected, today is accepted", () => {
  const now = new Date("2026-11-04T10:00:00Z");
  const v = { requestKind: "hotel", name: "Test", email: "a@b.co", destination: "Somewhere", travelers: "2", consent: true };
  assert.equal(validateForm("travelAssist", { ...v, departDate: "2026-01-01" }, { now }).departDate, "pastDate");
  assert.deepEqual(validateForm("travelAssist", { ...v, departDate: "2026-11-04" }, { now }), {});
});
test("impossible calendar dates are invalid", () => {
  const v = { requestKind: "hotel", name: "Test", email: "a@b.co", destination: "Somewhere", travelers: "2", consent: true };
  assert.equal(validateForm("travelAssist", { ...v, departDate: "2027-02-30" }).departDate, "invalid");
});
test("return date must not precede departure", () => {
  const v = { requestKind: "hotel", name: "Test", email: "a@b.co", destination: "Somewhere", travelers: "2", consent: true };
  assert.equal(validateForm("travelAssist", { ...v, departDate: "2030-05-10", returnDate: "2030-05-01" }).returnDate, "dateOrder");
});
test("translation needs two different languages", () => {
  const v = { name: "Test", email: "a@b.co", serviceType: "written", notes: "Some details here", consent: true };
  assert.equal(validateForm("translation", { ...v, sourceLanguage: "ar", targetLanguage: "ar" }).targetLanguage, "sameLanguage");
  assert.deepEqual(validateForm("translation", { ...v, sourceLanguage: "ar", targetLanguage: "tr" }), {});
});
test("travelers must be a whole number in range", () => {
  const v = { requestType: "trip", name: "Test", email: "a@b.co", notes: "Some details here", consent: true };
  assert.equal(validateForm("tourism", { ...v, travelers: "0" }).travelers, "range");
  assert.equal(validateForm("tourism", { ...v, travelers: "2.5" }).travelers, "range");
  assert.deepEqual(validateForm("tourism", { ...v, travelers: "4" }), {});
});
