import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

/* The mark in three same-size layers (logo-word, logo-line, logo-latin, split out
   of logo.png), each revealed by its own number so it can be written one part
   at a time: the Arabic name, then the drip-bag line, then QAMRAH. The numbers
   are registered properties in index.css (1 = written), so whoever holds the
   mark can set them from script — the footer, by scroll — or animate them — the
   header, once on load. Nothing moves, so either way it runs for reduced-motion
   visitors too.
     word  (ink x 35–70%): right to left, as it is written — edge 82% → 35% (--w)
     line  (ink y 5–80%):  top to bottom, down the string to the bag — 4% → 92% (--l)
     latin (ink x 33–66%): left to right — 32% → 78% (--n)
   Each edge has a 12% feather, so ink arrives as a soft wash rather than a cut.
   The files are the dark-brown artwork already turned to the page's cream (it
   was a CSS filter, run again on every repaint of a mask that changes by the
   frame), so the browser only has to draw them. */
const reveal = (gradient: string): CSSProperties => ({ maskImage: gradient, WebkitMaskImage: gradient })
const WORD = reveal(
  'linear-gradient(to right, transparent calc(70% - var(--w) * 47%), #000 calc(82% - var(--w) * 47%))',
)
const LINE = reveal(
  'linear-gradient(to bottom, #000 calc(-8% + var(--l) * 88%), transparent calc(4% + var(--l) * 88%))',
)
const LATIN = reveal(
  'linear-gradient(to right, #000 calc(20% + var(--n) * 46%), transparent calc(32% + var(--n) * 46%))',
)

export function LogoMark({
  className,
  size,
  tone,
  lazy,
  ref,
}: {
  /** On the wrapper — where an animation of the reveal numbers goes. */
  className?: string
  /** Height classes; the width follows the artwork's 635×320. */
  size: string
  /** Shared by all three layers, e.g. an opacity. */
  tone?: string
  /** For a mark below the fold: fetched and decoded only when it is needed. */
  lazy?: boolean
  ref?: React.Ref<HTMLDivElement>
}) {
  return (
    <div ref={ref} className={cn('relative', className)}>
      <img
        src="/img/logo-word.webp"
        loading={lazy ? 'lazy' : undefined}
        decoding="async"
        alt="قمرة"
        width={635}
        height={320}
        className={cn('w-auto', size, tone)}
        style={WORD}
      />
      <img
        src="/img/logo-line.webp"
        loading={lazy ? 'lazy' : undefined}
        decoding="async"
        alt=""
        aria-hidden="true"
        className={cn('absolute inset-0 size-full', tone)}
        style={LINE}
      />
      <img
        src="/img/logo-latin.webp"
        loading={lazy ? 'lazy' : undefined}
        decoding="async"
        alt=""
        aria-hidden="true"
        className={cn('absolute inset-0 size-full', tone)}
        style={LATIN}
      />
    </div>
  )
}
