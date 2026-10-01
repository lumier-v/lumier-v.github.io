import { useLayoutEffect, useRef, type CSSProperties } from 'react'
import { clamp01, followScroll, remeasure, view } from '@/lib/scroll'

const smoothstep = (x: number) => x * x * (3 - 2 * x)

/**
 * Each [data-step] child of the section is drawn in by the scroll itself: it
 * fades in as it settles a few pixels up, over the first fifth of the screen
 * it rises through — so it is there by the time it is read, and the foot of
 * the screen is never left empty — and goes back the same way on the way up.
 * Each step starts a beat after the one numbered before it (step(n) below), so
 * a block close together, or two columns side by side, still arrive in turn.
 * A step that can never rise that far, being near the foot of the page, is
 * done when the page can scroll no further. Only opacity and transform change,
 * and only steps mid-way carry a layer of their own. Where reduced motion is asked for, it only fades; nothing moves.
 *
 * A trailing step (trail(n) below) is not scrubbed: it waits, hidden, until the
 * step it shares a number with is more than half in, then plays in on its own clock —
 * so it always comes after its words, and is always whole by the time they are
 * read, however far the page is scrolled past them.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const steps = [...el.querySelectorAll<HTMLElement>('[data-step]')]
    const order = steps.map((s) => Number(s.style.getPropertyValue('--step')) || 0)
    const trails = steps.map((s) => s.hasAttribute('data-trail'))
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'
    steps.forEach((s, i) => {
      if (trails[i]) s.style.transition = `opacity 700ms ${ease}, transform 700ms ${ease}`
    })
    let tops: number[] = []
    let pageHeight = 0
    const unmeasure = remeasure(() => {
      // Measured without whatever offset the reveal has put on them.
      tops = steps.map((s) => s.offsetTop + offsetParentTop(s))
      pageHeight = document.documentElement.scrollHeight
    })
    const shown = steps.map(() => -1)
    const unfollow = followScroll(
      () => view.y,
      (y) => {
        const vh = view.h
        steps.forEach((s, i) => {
          const top = tops[i] - y
          // Where the step's top is when it is fully in: a fifth of the screen
          // up from the foot, or as high as the page lets it get.
          const done = Math.max(vh * 0.8 - order[i] * 24, tops[i] - (pageHeight - vh))
          const p = smoothstep(clamp01((done + vh * 0.22 - top) / (vh * 0.22)))
          if (trails[i]) {
            const on = p >= 0.6 ? 1 : 0
            if (on === shown[i]) return
            shown[i] = on
            s.style.opacity = on ? '' : '0'
            s.style.transform = on || still ? '' : 'translateY(10px)'
            return
          }
          if (Math.abs(p - shown[i]) < 0.002) return
          shown[i] = p
          if (p >= 1) {
            s.style.opacity = s.style.transform = s.style.willChange = ''
            return
          }
          s.style.willChange = p > 0 ? 'opacity, transform' : ''
          s.style.opacity = String(p)
          s.style.transform = still ? '' : `translateY(${((1 - p) * 14).toFixed(1)}px)`
        })
      },
      // A light glide for the wheel's steps; on touch it keeps up with the finger.
      { lag: 120, touchLag: 0 },
    )
    return () => {
      unmeasure()
      unfollow()
      for (const s of steps) s.style.opacity = s.style.transform = s.style.willChange = s.style.transition = ''
    }
  }, [])

  return ref
}

/** The page offset of an element's offsetParent, so offsetTop can be made absolute. */
function offsetParentTop(el: HTMLElement): number {
  let top = 0
  for (let p = el.offsetParent as HTMLElement | null; p; p = p.offsetParent as HTMLElement | null) {
    top += p.offsetTop
  }
  return top
}

/** Props for the nth step of a section revealed by useScrollReveal. */
export const step = (n: number) => ({
  'data-step': '',
  style: { '--step': n } as CSSProperties,
})

/** Props for a step that plays in after the nth step is in, rather than with the scroll. */
export const trail = (n: number) => ({ ...step(n), 'data-trail': '' })
