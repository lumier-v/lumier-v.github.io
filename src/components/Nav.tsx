import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogoMark } from '@/components/LogoMark'
import { StatusBadge } from '@/components/StatusBadge'
import { CONTACT } from '@/data/menu'
import { useLang, type Key } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { view } from '@/lib/scroll'

// The top bar is kept to the two things someone arrives wanting — what you
// serve, and where you are. The menu lives off-site, so that one opens a tab.
const LINKS: { href: string; key: Key; external?: boolean }[] = [
  { href: CONTACT.menu, key: 'menu', external: true },
  { href: '#visit', key: 'visit' },
]

export function Nav() {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(view.y > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Publish the bar's height as --header-h, so whatever pins beneath it (the
  // hero) pins exactly at its lower edge — it is one row on md+ and two below.
  const headerRef = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const el = headerRef.current
    if (!el) return
    const publish = () =>
      document.documentElement.style.setProperty('--header-h', `${el.offsetHeight}px`)
    publish()
    if (!('ResizeObserver' in window)) return
    const ro = new ResizeObserver(publish)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky z-50 border-b transition-[background-color,border-color,box-shadow] duration-300',
        'top-[env(safe-area-inset-top,0px)]',
        scrolled
          ? 'border-rule bg-night/85 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 max-[379px]:gap-1.5 sm:gap-4 sm:px-8">
        <a href="#home" className="flex h-16 shrink-0 items-center" aria-label="Qamrah">
          {/* The same mark as the footer's, writing itself once as the page opens. */}
          <LogoMark
            className="animate-logo-write"
            size={cn(
              'transition-[height] duration-300 max-sm:h-7 max-[359px]:h-6',
              scrolled ? 'h-9' : 'h-10',
            )}
          />
        </a>

        {/* Logo · status · links share one line at every width. The status is
            the most useful thing on the page for a shop that is open round the
            clock on Thursdays: from md up it sits at the page's centre; on a
            phone it takes the middle of what is left, a size smaller like the
            links and switch, and if even that is too wide its words wrap inside
            the pill rather than push the switch off the screen. */}
        <div className="mx-auto flex min-w-0 justify-center md:absolute md:left-1/2 md:mx-0 md:-translate-x-1/2">
          <StatusBadge className="max-w-full max-sm:gap-1.5 max-sm:px-2.5 max-sm:py-1 max-sm:text-center max-sm:text-[11px] max-sm:leading-tight max-sm:whitespace-normal max-[379px]:px-2" />
        </div>

        {/* Links and the language switch sit at the far end, across from the logo. */}
        <nav className="flex shrink-0 items-center gap-2.5 text-[0.8rem] max-[379px]:gap-2 sm:gap-5 sm:text-[0.92rem] md:ms-auto lg:gap-7">
          {LINKS.map(({ href, key, external }) => (
            <a
              key={href}
              href={href}
              {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
              className="text-moon-2 hover:text-moon transition-colors"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="shrink-0 text-xs font-bold tracking-wider max-sm:h-8 max-sm:px-3"
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </Button>
      </div>
    </header>
  )
}
