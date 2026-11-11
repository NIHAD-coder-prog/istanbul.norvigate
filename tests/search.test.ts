import { test } from "node:test";
import assert from "node:assert/strict";
import { normalize } from "../src/lib/normalize";

test("Turkish dotted/dotless i fold together", () => assert.equal(normalize("İstanbul ISTANBUL ıstanbul"), normalize("istanbul istanbul istanbul")));
test("Arabic diacritics and tatweel are ignored", () => assert.equal(normalize("إِسْـطَنْبُول"), normalize("اسطنبول")));
test("accents fold in Latin scripts", () => assert.equal(normalize("Café Müller"), normalize("cafe muller")));
