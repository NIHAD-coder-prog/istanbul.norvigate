import { test } from "node:test";
import assert from "node:assert/strict";
import { convert, rateBetween } from "../src/lib/currency/convert";

const rates = { ok: true, base: "TRY", rates: { TRY: 1, USD: 0.025, EUR: 0.02 }, providerUpdatedAt: "2026-11-04T00:00:00Z", fetchedAt: "2026-11-04T01:00:00Z", stale: false } as never;
test("same currency is identity", () => assert.equal(convert(10, "TRY", "TRY", rates), 10));
test("TRY to USD multiplies by the rate", () => assert.ok(Math.abs((convert(100, "TRY", "USD", rates) as number) - 2.5) < 1e-9));
test("cross rates go through the base", () => assert.ok(Math.abs((convert(1, "USD", "EUR", rates) as number) - 0.8) < 1e-9));
test("unknown currency returns null, never a made-up number", () => { assert.equal(convert(1, "TRY", "XXX", rates), null); assert.equal(rateBetween("USD", "ZZZ", rates), null); });
