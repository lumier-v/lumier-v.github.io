export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * The page's scroll position and viewport height, read once per scroll or
 * resize and shared. Scroll events come at the start of a frame, before any
 * frame callback has written to the page, so reading them there is free;
 * reading scrollY or innerHeight inside a frame callback, after another one
 * has just changed a style, makes the browser recompute every style on the
 * spot — and with four scroll-driven pieces on the page, that was most of each
 * frame's work. Registered when this module loads, so before any component's
 * own scroll listener: those can read it too.
 */
export const view = { y: 0, h: 0 }
{
  const read = () => {
    view.y = window.scrollY
    view.h = window.innerHeight
  }
  read()
  window.addEventListener('scroll', read, { passive: true })
  window.addEventListener('resize', read)
}

export interface FollowOptions {
  /** The glide's time constant in ms for mice and trackpads; it settles in about three. */
  lag?: number
  /** The same for touch screens. 0 follows the finger directly. */
  touchLag?: number
  /**
   * The most progress per second, however fast the page is flung — so a hard
   * flick still plays the animation out instead of skipping to its end.
   */
  maxRate?: number
  /**
   * While this returns true the glide is dropped for a steady run straight to
   * the goal at `rushRate` per second — no long tail to wait out.
   */
  rush?: () => boolean
  rushRate?: number
}

/**
 * Drives `apply` with a scroll-linked progress that trails the real one. A
 * wheel notch jumps the page ~100px at once; gliding toward the new position
 * plays that jump out, so a scrubbed animation moves like footage rather than
 * stepping from still to still. The glide is measured in time, not frames, so
 * a 120Hz screen glides exactly like a 60Hz one.
 *
 * `target` runs every frame while anything is moving, so it should read only
 * cheap things (`view`, cached measurements) — not even scrollY itself: any
 * layout read there, after another animation has just written to the page,
 * forces the browser to restyle and lay the page out again mid-frame. `apply`
 * is skipped when the value has not moved enough to show. Returns the cleanup.
 */
export function followScroll(
  target: () => number,
  apply: (progress: number) => void,
  { lag = 140, touchLag = 0, maxRate = Infinity, rush, rushRate = 2 }: FollowOptions = {},
): () => void {
  const glide = window.matchMedia('(pointer: fine)').matches ? lag : touchLag
  let current = target()
  let applied = current
  let frame = 0
  let last = 0
  apply(current)

  const step = (now: number) => {
    const goal = target()
    const dt = last ? Math.min(now - last, 64) : 16
    last = now
    let move: number
    if (rush?.()) {
      move = Math.sign(goal - current) * Math.min(Math.abs(goal - current), (rushRate * dt) / 1000)
    } else {
      move = (goal - current) * (glide > 0 ? 1 - Math.exp(-dt / glide) : 1)
      const cap = (maxRate * dt) / 1000
      if (Math.abs(move) > cap) move = Math.sign(move) * cap
    }
    current += move
    if (Math.abs(goal - current) < 0.0005) current = goal
    if (current === goal || Math.abs(current - applied) >= 0.0008) {
      applied = current
      apply(current)
    }
    if (current === goal) {
      frame = 0
      last = 0
    } else {
      frame = requestAnimationFrame(step)
    }
  }
  const wake = () => {
    if (!frame) frame = requestAnimationFrame(step)
  }

  window.addEventListener('scroll', wake, { passive: true })
  window.addEventListener('resize', wake)
  return () => {
    window.removeEventListener('scroll', wake)
    window.removeEventListener('resize', wake)
    cancelAnimationFrame(frame)
  }
}

/** Re-runs `measure` whenever the page's own size changes (resize, fonts, images). */
export function remeasure(measure: () => void): () => void {
  measure()
  if (!('ResizeObserver' in window)) return () => {}
  const ro = new ResizeObserver(measure)
  ro.observe(document.documentElement)
  return () => ro.disconnect()
}
