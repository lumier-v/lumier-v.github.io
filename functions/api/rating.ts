/**
 * Google rating for the shop, refreshed on its own every 90 days.
 *
 * Runs on Cloudflare Pages Functions, so the API key never reaches the browser.
 * The answer is held in Cloudflare's edge cache rather than KV: no binding to
 * configure, and if the edge evicts it early the next request simply refetches.
 * At one call a quarter this stays far inside the free allowance either way.
 *
 * If Google fails or the quota is gone, the last figures we know are returned
 * with a short TTL, so the page shows a plausible number instead of nothing and
 * retries soon after.
 */

interface Env {
  GOOGLE_MAPS_API_KEY: string
  GOOGLE_PLACE_ID: string
}

interface RatingPayload {
  rating: number
  count: number
  /** 'live' came from Google just now; 'fallback' is the built-in figure. */
  source: 'live' | 'fallback'
}

const REFRESH_SECONDS = 90 * 24 * 60 * 60 // 90 days
const RETRY_SECONDS = 60 * 30 // back off half an hour after a failure

/** Last figures confirmed by hand — only ever shown if Google cannot answer. */
const FALLBACK: RatingPayload = { rating: 4.6, count: 154, source: 'fallback' }

function json(payload: RatingPayload, maxAge: number): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}`,
      'Access-Control-Allow-Origin': '*',
    },
  })
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const cache = caches.default
  const cacheKey = new Request(new URL('/api/rating', ctx.request.url).toString())

  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const { GOOGLE_MAPS_API_KEY, GOOGLE_PLACE_ID } = ctx.env
  if (!GOOGLE_MAPS_API_KEY || !GOOGLE_PLACE_ID) {
    return json(FALLBACK, RETRY_SECONDS)
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(GOOGLE_PLACE_ID)}`,
      {
        headers: {
          'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
          'X-Goog-FieldMask': 'rating,userRatingCount',
        },
      },
    )
    if (!res.ok) throw new Error(`Places API ${res.status}`)

    const data = (await res.json()) as { rating?: number; userRatingCount?: number }
    if (typeof data.rating !== 'number' || typeof data.userRatingCount !== 'number') {
      throw new Error('Places API returned no rating')
    }

    const fresh = json(
      { rating: data.rating, count: data.userRatingCount, source: 'live' },
      REFRESH_SECONDS,
    )
    ctx.waitUntil(cache.put(cacheKey, fresh.clone()))
    return fresh
  } catch {
    // Never surface the failure to the visitor — show what we know and retry soon.
    return json(FALLBACK, RETRY_SECONDS)
  }
}
