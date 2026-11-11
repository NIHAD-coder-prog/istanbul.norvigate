/**
 * Prayer times by astronomical calculation (no network). Method: Fajr 18°, Isha 17° (the angles the Turkish
 * Diyanet publishes), standard Asr (shadow = object height). Result is within a few minutes of official
 * timetables, which also add small safety offsets. Always label it as calculated.
 */
export interface PrayerTimes { fajr: string; sunrise: string; dhuhr: string; asr: string; maghrib: string; isha: string }

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const fix = (v: number, n: number) => ((v % n) + n) % n;

function julian(y: number, m: number, d: number): number {
  if (m <= 2) { y -= 1; m += 12; }
  const a = Math.floor(y / 100), b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524.5;
}

function sun(jd: number) {
  const D = jd - 2451545;
  const g = fix(357.529 + 0.98560028 * D, 360), q = fix(280.459 + 0.98564736 * D, 360);
  const L = fix(q + 1.915 * Math.sin(rad(g)) + 0.02 * Math.sin(rad(2 * g)), 360);
  const e = 23.439 - 0.00000036 * D;
  const ra = fix(deg(Math.atan2(Math.cos(rad(e)) * Math.sin(rad(L)), Math.cos(rad(L)))), 360) / 15;
  return { decl: deg(Math.asin(Math.sin(rad(e)) * Math.sin(rad(L)))), eqt: q / 15 - ra };
}

const hhmm = (h: number) => {
  const t = fix(h, 24) * 60, m = Math.round(t) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/** Times as local clock time. `tz` is the UTC offset in hours (Istanbul is UTC+3 all year). */
export function prayerTimes(y: number, m: number, d: number, lat: number, lng: number, tz: number): PrayerTimes {
  const { decl, eqt } = sun(julian(y, m, d) + 0.5);
  const noon = 12 + tz - lng / 15 - eqt;
  const angle = (a: number) => {
    const c = (-Math.sin(rad(a)) - Math.sin(rad(decl)) * Math.sin(rad(lat))) / (Math.cos(rad(decl)) * Math.cos(rad(lat)));
    return deg(Math.acos(Math.min(1, Math.max(-1, c)))) / 15;
  };
  const asrA = -deg(Math.atan(1 / (1 + Math.tan(rad(Math.abs(lat - decl))))));
  const asr = noon + angle(asrA);
  return {
    fajr: hhmm(noon - angle(18)),
    sunrise: hhmm(noon - angle(0.833)),
    dhuhr: hhmm(noon),
    asr: hhmm(asr),
    maghrib: hhmm(noon + angle(0.833)),
    isha: hhmm(noon + angle(17)),
  };
}

export const ISTANBUL = { lat: 41.0082, lng: 28.9784, tz: 3 } as const;

/** Today's date in Istanbul, independent of the server's time zone. */
export function istanbulToday(now = new Date()): { y: number; m: number; d: number } {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" }).format(now).split("-").map(Number);
  return { y: p[0], m: p[1], d: p[2] };
}
