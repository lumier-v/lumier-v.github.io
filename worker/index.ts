/**
 * The site itself is static and served from the assets binding; this Worker
 * exists for the one thing a static file cannot do — ask Google for the shop's
 * current rating without putting the API key in the browser.
 *
 * Requests that match a built file never reach this code, so in practice this
 * runs only for /api/rating and for genuine 404s.
 */

interface Env {
  ASSETS: Fetcher
  GOOGLE_MAPS_API_KEY?: string
  GOOGLE_PLACE_ID?: string
}

interface RatingPayload {
  rating: number
  count: number
  /** 'live' came from Google; 'fallback' is the figure shipped in the bundle. */
  source: 'live' | 'fallback'
}

const REFRESH_SECONDS = 90 * 24 * 60 * 60 // refresh itself quarterly
const RETRY_SECONDS = 60 * 30 // back off half an hour after a failure

/** Last figures confirmed by hand — only shown when Google cannot answer. */
const FALLBACK: RatingPayload = { rating: 4.6, count: 154, source: 'fallback' }

function json(payload: RatingPayload, maxAge: number): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${maxAge}`,
    },
  })
}

async function rating(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const cache = caches.default
  const cacheKey = new Request(new URL('/api/rating', request.url).toString())

  // Held in the edge cache rather than KV: nothing to provision, and an early
  // eviction only costs one extra call to Google.
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const key = env.GOOGLE_MAPS_API_KEY
  const placeId = env.GOOGLE_PLACE_ID
  if (!key || !placeId) return json(FALLBACK, RETRY_SECONDS)

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount',
      },
    })
    if (!res.ok) throw new Error(`Places API ${res.status}`)

    const data = (await res.json()) as { rating?: number; userRatingCount?: number }
    if (typeof data.rating !== 'number' || typeof data.userRatingCount !== 'number') {
      throw new Error('Places API returned no rating')
    }

    const fresh = json({ rating: data.rating, count: data.userRatingCount, source: 'live' }, REFRESH_SECONDS)
    ctx.waitUntil(cache.put(cacheKey, fresh.clone()))
    return fresh
  } catch {
    // Never show the visitor a failure — serve what we know and retry soon.
    return json(FALLBACK, RETRY_SECONDS)
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/rating') return rating(request, env, ctx)
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
