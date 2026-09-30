import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CONTACT } from '@/data/menu'
import { useLang } from '@/lib/i18n'
import { useRating } from '@/lib/rating'

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
      <span className="text-moon text-2xl font-bold tabular-nums">
        {n(value.toFixed(decimals))}
      </span>
      <span className="text-moon-2 text-xs">{label}</span>
    </div>
  )
}

export function Hero() {
  const { t } = useLang()
  const rating = useRating()

  return (
    <section id="home" className="relative overflow-hidden">
      {/* The café line drawing, inverted so its ink reads as light, screened
          onto the night and faded out before it reaches the copy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(78%,460px)] bg-[url('/img/hero-bg.png')] bg-cover bg-[center_64%] bg-no-repeat opacity-30 mix-blend-screen [filter:invert(1)_sepia(.45)_saturate(.7)_brightness(.95)] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,.22)_0%,rgba(0,0,0,.82)_42%,rgba(0,0,0,.4)_76%,transparent_100%)]"
      />
      {/* The real Moon, with its halo bleeding past the limb. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[12%] -end-[6%] aspect-square w-[min(420px,56%)] opacity-60 mix-blend-screen"
        style={{
          background:
            "url('/img/moon-full.jpg') center / 68% auto no-repeat, radial-gradient(circle at 50% 50%, rgba(217,190,135,.20), rgba(217,190,135,.06) 44%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32">
        <h1 className="animate-rise max-w-[16ch] text-4xl font-medium sm:text-5xl lg:text-6xl">
          {t('heroTitle')}
        </h1>
        <p
          className="text-moon-2 animate-rise max-w-[46ch] text-base sm:text-lg"
          style={{ animationDelay: '120ms' }}
        >
          {t('heroSub')}
        </p>

        <div className="animate-rise flex flex-wrap gap-3" style={{ animationDelay: '240ms' }}>
          <Button asChild>
            <a href="#menu">{t('coffeeMenu')}</a>
          </Button>
          <Button asChild variant="outline">
            <a href={CONTACT.store} target="_blank" rel="noopener noreferrer">
              {t('store')}
            </a>
          </Button>
        </div>

        <div
          className="animate-rise mt-2 flex items-center gap-6"
          style={{ animationDelay: '360ms' }}
        >
          {/* Keyed on the figure so the count-up replays once the live numbers
              land, instead of the value jumping without explanation. */}
          <Stat
            key={`r-${rating.rating}`}
            target={rating.rating}
            decimals={1}
            label={t('googleRating')}
          />
          <span className="bg-rule h-8 w-px" />
          <Stat
            key={`c-${rating.count}`}
            target={rating.count}
            decimals={0}
            label={t('reviews')}
          />
        </div>
      </div>
    </section>
  )
}
