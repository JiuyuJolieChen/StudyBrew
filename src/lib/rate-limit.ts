import 'server-only'

// In-memory, per-instance rate limiter. Good enough to stop naive scripts hitting
// a single warm serverless instance, but each instance has its own Map — a
// distributed attack spread across many cold starts / instances won't be caught
// as reliably. If this needs to be airtight later, swap this module for
// Upstash Redis (URL/TOKEN are already scaffolded in .env.example) without
// touching call sites — checkRateLimit's signature can stay the same.

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/**
 * Returns true if the request under `key` is still within `limit` calls per `windowMs`.
 * Returns false once the caller has exceeded the limit for the current window.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= limit) return false

  bucket.count += 1
  return true
}

/** Best-effort client IP extraction behind a proxy (Vercel, etc.). */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return 'unknown'
}
