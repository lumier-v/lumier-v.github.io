import { Instagram, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MoonPhase } from '@/components/MoonPhase'
import { CONTACT } from '@/data/menu'
import { SCHEDULE } from '@/lib/hours'
import { useLang, type Key } from '@/lib/i18n'
import { step, trail, useScrollReveal } from '@/lib/reveal'

/**
 * Inside another page's frame (a preview, an embed), a sandboxed frame may not
 * hand a tel: link to the phone itself, so there the number opens the call the
 * way the other contact links open, as a new window. On its own page it is a
 * plain link.
 */
const FRAMED = typeof window !== 'undefined' && window.self !== window.top

/** TikTok's mark (Simple Icons, CC0); lucide carries no brand icon for it. */
function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

/** Snapchat's ghost (Simple Icons, CC0); lucide carries no brand icon for it either. */
function Snapchat({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
    </svg>
  )
}

/** WhatsApp's mark (Simple Icons, CC0), so its button carries the logo, not the name. */
function WhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

/** Day id → the two dictionary keys that describe it. */
const HOUR_LABELS: Record<string, { day: Key; hours: Key }> = {
  sunWed: { day: 'sunWed', hours: 'sunWedHours' },
  thu: { day: 'thu', hours: 'thuHours' },
  fri: { day: 'fri', hours: 'friHours' },
  sat: { day: 'sat', hours: 'satHours' },
}

export function Visit() {
  const { t, n } = useLang()
  const ref = useScrollReveal<HTMLElement>()

  // The two ways to talk to us now, the number over WhatsApp as a pair of
  // buttons no wider than the number; across from them, at the far side, the
  // accounts to follow as their marks alone, stepping in and out — near, far,
  // near — with room around each ring.
  const talk = [
    {
      key: 'phone',
      href: `tel:${CONTACT.phoneRaw}`,
      newWindow: FRAMED,
      icon: <Phone />,
      label: (
        <span dir="ltr" className="tabular-nums">
          {CONTACT.phoneDisplay}
        </span>
      ),
      name: `${t('phone')} ${CONTACT.phoneDisplay}`,
    },
    {
      key: 'whatsapp',
      href: CONTACT.whatsapp,
      newWindow: true,
      icon: <WhatsApp className="size-5!" />,
      label: null,
      name: t('whatsapp'),
    },
  ]
  const follow = [
    {
      key: 'instagram',
      href: CONTACT.instagram,
      icon: <Instagram className="size-5" />,
      name: t('instagram'),
    },
    {
      key: 'tiktok',
      href: CONTACT.tiktok,
      icon: <TikTok className="size-[1.1rem]" />,
      name: t('tiktok'),
    },
    {
      key: 'snapchat',
      href: CONTACT.snapchat,
      icon: <Snapchat className="size-5" />,
      name: t('snapchat'),
    },
  ]

  // Drawn in by the scroll, step by step: the place down the first column, and
  // the week's hours down the second a beat behind it — each day's words
  // first, then its moon.
  return (
    <section ref={ref} id="visit" className="pt-10 pb-20 sm:pt-14 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 {...step(0)} className="mb-5 text-3xl font-medium sm:text-4xl">
              {t('visit')}
            </h2>
            <address {...step(1)} className="text-moon-2 mb-6 flex items-start gap-2.5 not-italic">
              <MapPin className="mt-1 size-4 shrink-0" />
              {t('address')}
            </address>
            {/* Its own transform is the press; the reveal moves a wrapper instead. */}
            <div {...step(2)} className="w-fit">
              <Button asChild>
                <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer">
                  {t('directions')}
                </a>
              </Button>
            </div>

            <h3
              {...step(3)}
              className="font-body text-moon-2 mt-12 mb-6 text-[0.7rem] font-semibold tracking-[0.14em] uppercase rtl:tracking-normal"
            >
              {t('contact')}
            </h3>
            <div className="flex max-w-md items-center justify-between gap-4">
              <div {...step(4)} className="flex w-fit flex-col gap-4">
                {talk.map((c) => (
                  <Button key={c.key} asChild variant="outline" className="h-12 px-5 text-sm">
                    <a
                      href={c.href}
                      target={c.newWindow ? '_blank' : undefined}
                      rel={c.newWindow ? 'noopener noreferrer' : undefined}
                      aria-label={c.name}
                    >
                      <span className="text-gold">{c.icon}</span>
                      {c.label}
                    </a>
                  </Button>
                ))}
              </div>
              <ul {...step(5)} className="flex w-24 flex-col gap-1.5">
                {follow.map((c, i) => (
                  <li key={c.key} className={i % 2 ? 'self-end' : 'self-start'}>
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={c.name}
                      title={c.name}
                      className="border-gold/30 text-gold hover:border-gold hover:bg-gold/10 flex size-11 items-center justify-center rounded-full border transition-colors"
                    >
                      {c.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* A fuller moon means a longer day: Thursday, seven to one, is full;
              Sunday to Wednesday a gibbous whose shadow is Saturday's crescent
              exactly; Friday half; Saturday, the shortest, the crescent. */}
          <div>
            {/* A small label like the menu's group labels, so it takes their body
                face; the calligraphic display face doesn't hold up at this size.
                Spaced out in English only: tracking pulls Arabic's joins apart. */}
            <h3
              {...step(1)}
              className="font-body text-moon-2 mb-6 text-[0.7rem] font-semibold tracking-[0.14em] uppercase rtl:tracking-normal"
            >
              {t('hours')}
            </h3>
            <ul className="space-y-1">
              {SCHEDULE.map((day, i) => {
                const labels = HOUR_LABELS[day.id]
                return (
                  <li key={day.id} className="flex items-center gap-4 py-3.5">
                    {/* Comes in once its day's words are in, and always all the way. */}
                    <span {...trail(2 + i)} className="shrink-0">
                      <MoonPhase phase={day.phase} />
                    </span>
                    <span {...step(2 + i)} className="flex-1">
                      {t(labels.day)}
                    </span>
                    <span {...step(2 + i)} className="text-moon-2 tabular-nums">
                      {n(t(labels.hours))}
                    </span>
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
