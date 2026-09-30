import { useEffect, useState } from 'react'
import { CONTACT } from '@/data/menu'

export interface Rating {
  rating: number
  count: number
  /** True once the figures came back from the endpoint rather than the seed. */
  live: boolean
}

/**
 * Reads the shop's Google rating from our own endpoint, which refreshes itself
 * quarterly. The hook starts from the figures baked into the bundle so the stats
 * row is never blank or zero on first paint, then swaps in the live numbers.
 *
 * In `npm run dev` there is no Functions runtime, so the fetch fails and the
 * seed figures simply stay — which is the intended behaviour, not an error.
 */
export function useRating(): Rating {
  const [value, setValue] = useState<Rating>({
    rating: Number(CONTACT.rating),
    count: Number(CONTACT.reviewCount),
    live: false,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/rating', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { rating?: number; count?: number }) => {
        if (typeof data.rating !== 'number' || typeof data.count !== 'number') return
        setValue({ rating: data.rating, count: data.count, live: true })
      })
      .catch(() => {
        /* keep the seeded figures */
      })

    return () => controller.abort()
  }, [])

  return value
}
