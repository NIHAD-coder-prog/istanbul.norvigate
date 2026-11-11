import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type { FormKind } from "./forms";

/**
 * Submission storage (server only): one JSON object per line in <NORVIGATE_DATA_DIR>/submissions/<kind>.jsonl.
 * Outside /public (never served). Needs a writable, persistent volume. No IP address or user agent is stored.
 * Optional NORVIGATE_NOTIFY_WEBHOOK receives a minimal JSON notice (kind, id, locale — no personal data).
 */
export interface StoredSubmission { id: string; kind: FormKind; locale: string; receivedAt: string; sampleContext: true; data: Record<string, unknown> }

function dataDir() {
  const configured = process.env.NORVIGATE_DATA_DIR || ".data";
  return path.isAbsolute(configured) ? configured : path.join(process.cwd(), configured);
}
function newId(now: Date) {
  return `NV-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

async function notify(kind: string, id: string, locale: string) {
  const url = process.env.NORVIGATE_NOTIFY_WEBHOOK;
  if (!url) return;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    await fetch(url, { method: "POST", signal: ctrl.signal, headers: { "content-type": "application/json" }, body: JSON.stringify({ text: `NORVIGATE Istanbul: new ${kind} request ${id} (${locale})` }) });
    clearTimeout(t);
  } catch { /* notification is best-effort */ }
}

export async function saveSubmission(kind: FormKind, locale: string, data: Record<string, unknown>): Promise<{ id: string }> {
  const now = new Date();
  const record: StoredSubmission = { id: newId(now), kind, locale, receivedAt: now.toISOString(), sampleContext: true, data };
  const dir = path.join(dataDir(), "submissions");
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  await fs.appendFile(path.join(dir, `${kind}.jsonl`), JSON.stringify(record) + "\n", { mode: 0o600 });
  void notify(kind, record.id, locale);
  return { id: record.id };
}
