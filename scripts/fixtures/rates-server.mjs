// Local stand-in for the exchange-rate provider, used only in tests (NORVIGATE_RATES_URL=http://localhost:3999).
import http from "node:http";
const now = Math.floor(Date.now() / 1000);
const body = JSON.stringify({ result: "success", base_code: "TRY", time_last_update_unix: now - 3600, time_next_update_unix: now + 82800,
  rates: { TRY: 1, USD: 0.0235, EUR: 0.0215, GBP: 0.0185, SAR: 0.0881, AED: 0.0863, QAR: 0.0855, KWD: 0.00722, EGP: 1.16, JOD: 0.01666, CHF: 0.0203, JPY: 3.5, CNY: 0.17 } });
http.createServer((_, res) => { res.setHeader("content-type", "application/json"); res.end(body); }).listen(3999, () => console.log("rates fixture on 3999"));
