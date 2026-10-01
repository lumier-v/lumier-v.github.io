import { useLayoutEffect, useRef } from 'react'
import { LogoMark } from '@/components/LogoMark'
import { clamp01, followScroll, remeasure, view } from '@/lib/scroll'

/** Starts and finishes each part of the writing gently instead of at a constant rate. */
const smoothstep = (x: number) => x * x * (3 - 2 * x)

/** Just the mark, large, on its own band between Visit and the closing words,
 *  writing itself as it rises up the screen and unwriting on the way back. It
 *  waits until the mark's whole space is on screen, so the reader first sees
 *  where it will go empty, and is done by the time the mark is a fifth of the
 *  way from the top — or by the end of the page, if that comes first. The band
 *  keeps the deeper night the closing section used to have, so the run of
 *  colours down the page is unchanged. At 208px a 2× screen asks a little more
 *  than the 320px-tall artwork has; a few flat strokes carry that fine. */
export function Signature() {
  const ref = useRef<HTMLElement>(null)
  const markRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    const mark = markRef.current
    if (!el || !mark) return
    // Measured once and again only when the page's size changes; per frame it is
    // arithmetic on the shared scroll position and viewport height.
    let markTop = 0
    let markHeight = 0
    let pageHeight = 0
    const unmeasure = remeasure(() => {
      const r = mark.getBoundingClientRect()
      markTop = r.top + window.scrollY
      markHeight = r.height
      pageHeight = document.documentElement.scrollHeight
    })
    const unfollow = followScroll(
      () => {
        const vh = view.h
        const top = markTop - view.y
        // Done a fifth of the way down the screen, or wherever the mark's top
        // stands when the page can scroll no further, whichever is lower.
        const endTop = Math.max(markTop - (pageHeight - vh), vh * 0.22)
        // Not before the whole mark is on screen with a little air beneath it.
        const startTop = vh - markHeight - vh * 0.06
        return clamp01((startTop - top) / Math.max(1, startTop - endTop))
      },
      (p) => {
        // Each part picks up a little before the last one finishes, so the pen
        // never stops between the name, the line and QAMRAH.
        el.style.setProperty('--w', String(smoothstep(clamp01(p / 0.48))))
        el.style.setProperty('--l', String(smoothstep(clamp01((p - 0.4) / 0.36))))
        el.style.setProperty('--n', String(smoothstep(clamp01((p - 0.7) / 0.3))))
      },
      // The moon's glide, and unlike the moon a glide on touch screens too: the
      // writing should drift in, not step.
      { lag: 240, touchLag: 200 },
    )
    return () => {
      unmeasure()
      unfollow()
    }
  }, [])

  return (
    <section ref={ref} className="bg-night-2 border-rule border-t py-16 sm:py-20">
      <div className="flex justify-center px-4">
        <LogoMark ref={markRef} size="h-36 sm:h-52" tone="opacity-80" lazy />
      </div>
    </section>
  )
}
