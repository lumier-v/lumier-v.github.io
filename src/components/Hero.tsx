import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CONTACT } from '@/data/menu'
import { useLang } from '@/lib/i18n'
import { clamp01, followScroll, remeasure, view } from '@/lib/scroll'

/** Counts up once, when the figures first scroll into view. */
function Stat({ target, decimals, label }: { target: number; decimals: number; label: string }) {
  const { n } = useLang()
  const [value, setValue] = useState(target)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    setValue(0)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1200, 1)
          setValue(target * (1 - Math.pow(1 - p, 3)))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target])

  return (
    <div ref={ref} className="flex flex-col items-center gap-0.5">
      {/* Forced left-to-right so the plus always sits after the digits; in an
          RTL paragraph it would otherwise flip to the wrong side of the number. */}
      <span dir="ltr" className="flex items-baseline gap-px">
        <span className="text-moon text-2xl font-bold tabular-nums">
          {n(value.toFixed(decimals))}
        </span>
        <span className="text-gold text-lg font-bold">+</span>
      </span>
      <span className="text-moon-2 text-xs">{label}</span>
    </div>
  )
}

/**
 * The night side of the disc at phase angle φ (0 new, π full), as a path in the
 * moon's 0–1 box: the dark limb from pole to pole, closed by the terminator,
 * which is half an ellipse r·|cos φ| wide. Waxing lights the right limb and
 * waning the left, as the Moon is seen from Al Ghat, so the dark limb is the
 * other one.
 */
function shadowPath(phi: number): string {
  const s = Math.cos(phi)
  if (s < -0.9995) return 'M0.5,0.5Z' // full: no shadow
  if (s > 0.9995) return 'M0.5,0A0.5,0.5 0 0 1 0.5,1A0.5,0.5 0 0 1 0.5,0Z' // new: all of it
  const waxing = Math.sin(phi) >= 0
  const rx = (0.5 * Math.abs(s)).toFixed(4)
  const darkLimb = waxing ? 0 : 1
  // A crescent's terminator bows toward the lit limb, a gibbous one away from it.
  const terminator = waxing === s > 0 ? 0 : 1
  return `M0.5,0A0.5,0.5 0 0 ${darkLimb} 0.5,1A${rx},0.5 0 0 ${terminator} 0.5,0Z`
}

const DOWN_KEYS = new Set(['ArrowDown', 'PageDown', 'End', ' ', 'Spacebar'])

/**
 * Keeps the page from scrolling on past `end` until `done()` — so a reader who
 * flings through the Moon's runway waits at its foot while the Moon finishes
 * its round, rather than leaving it half-way. Only going down is held: wheel,
 * swipe and keys are refused, and a scrollbar drag or momentum that slips past
 * is put back at `end`. In-page links (the header's "زورونا") are let through,
 * since the reader asked to be taken somewhere. Returns the cleanup.
 *
 * A wheel or touchmove listener that may cancel makes the browser wait on the
 * page before every scroll step, anywhere on the page; so those two are only
 * attached within a screen of the foot while the Moon is still going round.
 */
function holdUntilFull(end: () => number, done: () => boolean): () => void {
  // The browser's own jumps — a restored scroll position on reload, a #hash in
  // the address — come before the reader has touched anything, and are left be.
  let engaged = false
  // Set by an in-page link; lasts until the Moon has caught up with where the
  // link went, or the reader is back up in the runway.
  let passing = false
  let passedAt = 0
  let touchY = 0

  const settlePass = () => {
    if (passing && (done() || (Date.now() - passedAt > 1500 && view.y < end() - 1))) {
      passing = false
    }
  }
  const held = () => {
    settlePass()
    return !done() && !passing
  }
  const atFoot = () => view.y >= end() - 1

  const onWheel = (e: WheelEvent) => {
    engaged = true
    if (e.deltaY > 0 && atFoot() && held()) e.preventDefault()
  }
  const onTouchStart = (e: TouchEvent) => {
    engaged = true
    touchY = e.touches[0]?.clientY ?? 0
  }
  const onTouchMove = (e: TouchEvent) => {
    const y = e.touches[0]?.clientY ?? touchY
    // A finger moving up the screen scrolls the page down.
    if (y < touchY && atFoot() && held()) e.preventDefault()
    touchY = y
  }
  const onKey = (e: KeyboardEvent) => {
    engaged = true
    if (!DOWN_KEYS.has(e.key) || (e.key === ' ' && e.shiftKey)) return
    // Space on a button presses it; that is not a scroll.
    if ((e.target as Element | null)?.closest?.('button, input, select, textarea, [contenteditable]')) return
    if (atFoot() && held()) e.preventDefault()
  }
  const onPointerDown = () => {
    engaged = true
  }

  let armed = false
  const arm = (on: boolean) => {
    if (on === armed) return
    armed = on
    if (on) {
      window.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('touchmove', onTouchMove, { passive: false })
    } else {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }

  // The page's own overflow is never switched off to stop a fling: on iOS that
  // can leave nothing pinned. On touch the Moon follows the finger directly, so
  // a fling rarely outruns it anyway.
  const onScroll = () => {
    settlePass()
    arm(!done() && view.y >= end() - view.h)
    // What still gets through — a scrollbar drag, a fling already under way —
    // is set back at the foot of the runway.
    if (engaged && view.y > end() + 1 && held()) {
      window.scrollTo({ top: end(), behavior: 'instant' })
    }
  }
  const onClick = (e: MouseEvent) => {
    if ((e.target as Element | null)?.closest?.('a[href^="#"]')) {
      passing = true
      passedAt = Date.now()
    }
  }

  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('pointerdown', onPointerDown, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('click', onClick, true)
  onScroll()
  return () => {
    arm(false)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('scroll', onScroll)
    document.removeEventListener('click', onClick, true)
  }
}

/**
 * The copy is lit by the same moon: as the shadow crosses it, each part of the
 * text dims toward new and brightens back to full with it — the heading word
 * by word, then the line under it, then the figures, each a little behind the
 * one before, so the dark passes across the words the way it passes across the
 * disc. Only opacity changes, on layers of their own, so the text is never
 * repainted for it; nothing moves, and nothing ever goes fully dark.
 */
const SHADOW_SPREAD = 0.3
function moonlight(parts: HTMLElement[], p: number) {
  const last = Math.max(1, parts.length - 1)
  parts.forEach((el, i) => {
    const q = clamp01((p - (i / last) * SHADOW_SPREAD) / (1 - SHADOW_SPREAD))
    const lit = (1 + Math.cos(2 * Math.PI * q)) / 2
    el.style.opacity = lit > 0.999 ? '' : (0.3 + 0.7 * lit).toFixed(3)
  })
}

export function Hero() {
  const { t } = useLang()
  // The heading surfaces a word at a time on arrival, then the line under it,
  // then the figures — on its own clock, not the scroll's.
  const words = t('heroTitle').split(' ')
  const after = 150 + words.length * 110
  const runwayRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const spacerRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<SVGPathElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  // The hero holds still under the header while the runway below it scrolls
  // past, and that scroll takes the Moon once round its phases, full to full.
  useLayoutEffect(() => {
    const runway = runwayRef.current
    const stage = stageRef.current
    const spacer = spacerRef.current
    const shadow = shadowRef.current
    const title = titleRef.current
    const sub = subRef.current
    const stats = statsRef.current
    if (!runway || !stage || !spacer || !shadow || !title || !sub || !stats) return
    // Measured once and again only when the page's size changes, so the per-frame
    // work is arithmetic on scrollY and a single path rewrite.
    let startY = 0
    let length = 1
    let pinnedAt = 0
    // Whether the stage really pins, found out once a little way into the
    // runway. Where it doesn't (some browser in some frame), the runway would
    // only be an empty screen-high gap under the hero, so it is dropped: the
    // Moon then goes round as the hero itself scrolls away, and nothing waits.
    let pins: boolean | null = null
    const unmeasure = remeasure(() => {
      // At rest the section sits where the stage pins, so pinning starts at the
      // scroll that brings the section's top up to that line.
      pinnedAt = parseFloat(getComputedStyle(stage).top) || 0
      startY = runway.getBoundingClientRect().top + window.scrollY - pinnedAt
      length = (pins === false ? stage.offsetHeight : spacer.offsetHeight) || 1
    })
    const checkPin = () => {
      const into = view.y - startY
      // Up to and including the foot, a pinned stage sits exactly at its line.
      if (into < 12 || into > length) return
      window.removeEventListener('scroll', checkPin)
      pins = Math.abs(stage.getBoundingClientRect().top - pinnedAt) < 4
      if (!pins) {
        spacer.style.display = 'none'
        length = stage.offsetHeight || 1
      }
    }
    window.addEventListener('scroll', checkPin, { passive: true })
    // How far round the Moon actually is on screen, which can trail the scroll.
    let shown = 0
    const unfollow = followScroll(
      () => clamp01((view.y - startY) / length),
      (p) => {
        shown = p
        shadow.setAttribute('d', shadowPath(Math.PI + 2 * Math.PI * p))
        // The heading's words are read afresh: a language switch changes them.
        moonlight([...title.querySelectorAll<HTMLElement>('.animate-unveil'), sub, stats], p)
      },
      // A long glide on mice and trackpads; on touch the finger leads directly.
      // No cap on its speed: a Moon held back from a fast scroll reads as the
      // page sticking. Once the page is at the runway's foot, where it waits
      // for the Moon, the Moon stops easing and runs the rest of the way, so
      // the glide's tail is never waited out.
      {
        lag: 240,
        rush: () => view.y >= startY + length - 1,
        rushRate: 2,
      },
    )
    // Only where the Moon glides behind the scroll. On touch it follows the
    // finger, so there is nothing to wait for — and setting a fling back is
    // itself a judder on iOS, right where the hero hands over to Visit.
    const unhold = window.matchMedia('(pointer: fine)').matches
      ? holdUntilFull(() => startY + length, () => pins === false || shown >= 0.999)
      : () => {}
    return () => {
      window.removeEventListener('scroll', checkPin)
      unmeasure()
      unfollow()
      unhold()
    }
  }, [])

  return (
    <section id="home" ref={runwayRef}>
      <div
        ref={stageRef}
        className="sticky top-[calc(env(safe-area-inset-top,0px)+var(--header-h,4rem))] flex min-h-[calc(100dvh-var(--header-h,4rem))] flex-col overflow-hidden"
      >
        {/* While pinned the stage is the whole screen under the header — the copy
            centred in it and the menu band along its foot — so the runway never
            shows as an empty strip below. */}
        {/* The café line drawing, its ink turned to light on the night and faded
            out before it reaches the copy. The turning (an invert, a warm tint,
            a screen blend at 30%) is baked into the file, so the pinned stage
            carries no filter or blend while it scrolls. Mirrored in Arabic, so
            the barista stands on the side away from the moon, as he does in
            English, rather than behind it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(78%,460px)] rtl:-scale-x-100 bg-[url('/img/hero-bg.webp')] bg-cover bg-[center_64%] bg-no-repeat [mask-image:linear-gradient(to_bottom,rgba(0,0,0,.22)_0%,rgba(0,0,0,.82)_42%,rgba(0,0,0,.4)_76%,transparent_100%)]"
        />
        <div className="relative flex flex-1 flex-col justify-center">
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 pt-10 pb-6 sm:gap-6 sm:px-8 sm:pt-28 sm:pb-12">
          {/* The real Moon: the NASA frame cropped to the disc with only the black
              around it made transparent. From sm up it stands opposite the whole
              copy block, centred on it, as large as the free half of the column
              allows at each width; phones have no free half, so there it takes
              its own place above the heading. The -lg file is the full-resolution
              crop for the large sizes on dense screens. Its phases are a shadow
              laid over the photo, the night colour at 86%, so earthshine keeps the
              dark limb faintly there. The photo is painted once and never again;
              the shadow is a single flat shape on a layer of its own, the only
              thing redrawn as the page scrolls. At rest it is full.
              On phones it is about half the width, or what the pinned screen
              leaves room for, but never under 9rem: a phone browser's own bars
              (and a viewer's frame around the page) can leave a good deal less
              height than the screen has, and the moon should still read as big.
              The phone layout's gaps are kept tight to give it that room. */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative -mt-6 size-[clamp(9rem,min(56vw,calc(100svh_-_var(--header-h,4rem)_-_23rem)),16rem)] self-end sm:absolute sm:end-8 sm:top-28 sm:bottom-12 sm:my-auto sm:size-28 md:size-56 lg:size-80"
          >
            {/* The dark side still blocks what is behind it, as the real one does. */}
            <div className="bg-night absolute inset-[0.3%] rounded-full" />
            {/* The browser picks the file for the size and the screen: 342px for
                most, the full 684px crop for the large sizes on dense screens.
                It is the first thing to see, so it is fetched first. */}
            <img
              src="/img/moon-full.webp"
              srcSet="/img/moon-full.webp 342w, /img/moon-full-lg.webp 684w"
              sizes="(min-width: 1024px) 320px, (min-width: 768px) 224px, (min-width: 640px) 112px, min(56vw, 256px)"
              alt=""
              width={342}
              height={342}
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 size-full"
            />
            <svg viewBox="0 0 1 1" className="absolute inset-0 size-full will-change-transform">
              <path ref={shadowRef} d={shadowPath(Math.PI)} className="fill-night" fillOpacity="0.86" />
            </svg>
          </div>
          <h1 ref={titleRef} className="max-w-[16ch] text-4xl font-medium sm:text-5xl lg:text-6xl">
            {words.map((word, i) => (
              <span key={i}>
                {i > 0 && ' '}
                {/* Each word is a layer of its own, and Safari cuts a layer at
                    its box — where the tail of a final lam, deeper than the
                    line, hangs below it. The padding widens the box over the
                    whole letter; the margin takes it back out of the line. */}
                <span
                  className="animate-unveil -mx-[0.1em] -my-[0.25em] inline-block px-[0.1em] py-[0.25em] will-change-[opacity]"
                  style={{ animationDelay: `${150 + i * 110}ms` }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>
          <p
            ref={subRef}
            className="text-moon-2 animate-unveil max-w-[46ch] will-change-[opacity] text-base sm:text-lg"
            style={{ animationDelay: `${after + 100}ms` }}
          >
            {t('heroSub')}
          </p>

          <div
            ref={statsRef}
            className="animate-unveil mt-2 flex items-center gap-6 will-change-[opacity]"
            style={{ animationDelay: `${after + 350}ms` }}
          >
            <Stat target={Number(CONTACT.ratingFloor)} decimals={1} label={t('googleRating')} />
            <span className="bg-rule h-8 w-px" />
            <Stat target={Number(CONTACT.reviewFloor)} decimals={0} label={t('reviews')} />
          </div>
        </div>
        </div>

        {/* The way into the menu: on a row of its own at the foot of the scene,
            dressed like the open-now badge — a gold hairline on the night, not a
            slab of gold — and breathing in the same moonlight. The menu itself
            lives off-site, and so do ordering from the car and signing up, which
            a smaller line under the name tells of. */}
        <a
          href={CONTACT.menu}
          target="_blank"
          rel="noopener noreferrer"
          className="animate-menu-glow border-gold/40 bg-gold/5 text-gold hover:border-gold/70 hover:bg-gold/10 relative mx-auto mb-6 block w-[min(26rem,calc(100%-2rem))] rounded-full border px-4 py-3 text-center transition-colors sm:mb-14"
        >
          <span className="block text-lg font-semibold">{t('menuShop')}</span>
          <span className="text-gold/75 mt-0.5 block text-[0.8rem] text-balance">
            {t('driveThru')} · {t('joinUs')}
          </span>
        </a>
      </div>
      {/* The runway itself. A pinned element can only travel inside its parent's
          content box, so this has to be a real block — padding wouldn't count.
          Shorter on touch screens, where a swipe already carries the page far. */}
      <div ref={spacerRef} aria-hidden="true" className="h-[150svh] pointer-coarse:h-[80svh]" />
    </section>
  )
}
