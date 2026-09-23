// Rate limit sederhana in-memory — cukup untuk satu instance server.
// Untuk multi-instance nanti, pindahkan ke Upstash Redis (lihat ARCHITECTURE.md §8).
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit = 3, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
