import { promises as fs } from "node:fs";
import path from "node:path";

// Owner tool: lists recent form submissions. Usage: NORVIGATE_DATA_DIR=/data npx tsx scripts/list-submissions.ts [kind] [limit]
const dir = path.join(process.env.NORVIGATE_DATA_DIR || ".data", "submissions");
const kindArg = process.argv[2];
const limit = Number(process.argv[3] || 20);
async function main() {
  let files: string[] = [];
  try { files = (await fs.readdir(dir)).filter((f) => f.endsWith(".jsonl")); } catch { console.log("No submissions yet."); return; }
  const rows: { receivedAt: string; id: string; kind: string; locale: string; data: Record<string, unknown> }[] = [];
  for (const f of files) {
    if (kindArg && f !== `${kindArg}.jsonl`) continue;
    for (const line of (await fs.readFile(path.join(dir, f), "utf8")).split("\n").filter(Boolean)) rows.push(JSON.parse(line));
  }
  rows.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  for (const r of rows.slice(0, limit)) console.log(`${r.receivedAt}  ${r.id}  ${r.kind}  [${r.locale}]\n  ${JSON.stringify(r.data)}\n`);
  console.log(`${rows.length} submission(s) found${kindArg ? ` for ${kindArg}` : ""}.`);
}
main();
