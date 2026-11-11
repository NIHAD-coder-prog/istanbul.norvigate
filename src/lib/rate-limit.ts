/**
 * Tiny in-memory sliding-window limiter. Keys live only in process memory (never written to disk) and expire quickly.
 * It slows down casual abuse of the forms API; it is NOT a substitute for edge/WAF rate limiting in production,
 * and it resets when the process restarts or is scaled to several instances.
 */
const hits = new Map<string, number[]>();

export function rateLimited(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return false;
}
