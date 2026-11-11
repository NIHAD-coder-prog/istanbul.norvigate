import { test } from "node:test";
import assert from "node:assert/strict";
import { ISTANBUL, prayerTimes } from "../src/lib/prayer";

const t = (y: number, m: number, d: number) => prayerTimes(y, m, d, ISTANBUL.lat, ISTANBUL.lng, ISTANBUL.tz);
const mins = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

test("times are in chronological order all year", () => {
  for (const [m, d] of [[1, 15], [3, 21], [6, 21], [9, 23], [12, 21]]) {
    const p = t(2026, m, d);
    const order = [p.fajr, p.sunrise, p.dhuhr, p.asr, p.maghrib, p.isha].map(mins);
    assert.deepEqual([...order].sort((a, b) => a - b), order, `${m}/${d}: ${JSON.stringify(p)}`);
  }
});
test("midsummer day is longer than midwinter day", () => {
  const sum = t(2026, 6, 21), win = t(2026, 12, 21);
  assert.ok(mins(sum.maghrib) - mins(sum.sunrise) > mins(win.maghrib) - mins(win.sunrise) + 240);
});
test("noon prayer near 12:00-13:30 local time in Istanbul", () => {
  for (const [m, d] of [[1, 15], [7, 15]]) { const x = mins(t(2026, m, d).dhuhr); assert.ok(x > 11 * 60 + 30 && x < 13 * 60 + 30, String(x)); }
});
test("times are formatted HH:MM", () => assert.match(t(2026, 11, 4).fajr, /^\d\d:\d\d$/));
