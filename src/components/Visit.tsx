import { MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MoonPhase } from '@/components/MoonPhase'
import { CONTACT } from '@/data/menu'
import { SCHEDULE } from '@/lib/hours'
import { useLang, type Key } from '@/lib/i18n'

/** Day id → the two dictionary keys that describe it. */
const HOUR_LABELS: Record<string, { day: Key; hours: Key }> = {
  sunWed: { day: 'sunWed', hours: 'sunWedHours' },
  thu: { day: 'thu', hours: 'thuHours' },
  fri: { day: 'fri', hours: 'friHours' },
  sat: { day: 'sat', hours: 'satHours' },
}

export function Visit() {
  const { t, n } = useLang()

  return (
    <section id="visit" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="mb-5 text-3xl font-medium sm:text-4xl">{t('visit')}</h2>
            <address className="text-moon-2 mb-7 flex items-start gap-2.5 not-italic">
              <MapPin className="mt-1 size-4 shrink-0" />
              {t('address')}
            </address>
            <Button asChild>
              <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer">
                {t('directions')}
              </a>
            </Button>

            <dl className="mt-10 space-y-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Phone className="text-moon-2 size-4 shrink-0" />
                <dt className="sr-only">{t('phone')}</dt>
                {/* Shown as selectable text, not only as a tel: link. */}
                <dd dir="ltr" className="tabular-nums select-all">
                  {CONTACT.phoneDisplay}
                </dd>
              </div>
              <div className="flex gap-6">
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-moon-2 hover:text-gold transition-colors"
                >
                  {t('instagram')}
                </a>
                <a
                  href={CONTACT.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-moon-2 hover:text-gold transition-colors"
                >
                  {t('tiktok')}
                </a>
              </div>
            </dl>
          </div>

          {/* A fuller moon means a longer day — Thursday is open round the clock,
              so it gets the full moon and Friday the thinnest crescent. */}
          <div>
            <h3 className="text-moon-2 mb-6 text-[0.7rem] font-semibold tracking-[0.14em] uppercase">
              {t('hours')}
            </h3>
            <ul className="space-y-1">
              {SCHEDULE.map((day) => {
                const labels = HOUR_LABELS[day.id]
                return (
                  <li
                    key={day.id}
                    className="border-rule flex items-center gap-4 border-b py-3.5 last:border-b-0"
                  >
                    <MoonPhase phase={day.phase} />
                    <span className="flex-1">{t(labels.day)}</span>
                    <span className="text-moon-2 tabular-nums">{n(t(labels.hours))}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
