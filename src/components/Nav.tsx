import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { useLang, type Key } from '@/lib/i18n'
import { cn } from '@/lib/utils'

// The story section stays on the page and keeps its footer link; the top bar is
// kept to the two things someone arrives wanting — what you serve, and where you are.
const LINKS: { href: string; key: Key }[] = [
  { href: '#menu', key: 'menu' },
  { href: '#visit', key: 'visit' },
]

export function Nav() {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky z-50 border-b transition-[background-color,border-color,box-shadow] duration-300',
        'top-[env(safe-area-inset-top,0px)]',
        scrolled
          ? 'border-rule bg-night/80 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl backdrop-saturate-150'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="relative mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-8">
        <a href="#home" className="shrink-0" aria-label="Qamrah">
          <img
            src="/img/logo.png"
            alt="قمرة"
            width={148}
            height={30}
            className={cn(
              'logo-on-night w-auto transition-[height] duration-300',
              scrolled ? 'h-7' : 'h-8',
            )}
          />
        </a>

        {/* Logo · status · links share one axis. The status is the most useful
            thing on the page for a shop that is open round the clock on Thursdays. */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <StatusBadge className="max-sm:px-3 max-sm:py-1.5 max-sm:text-xs" />
        </div>

        <nav className="hidden items-center gap-7 text-[0.92rem] md:flex">
          {LINKS.map(({ href, key }) => (
            <a key={href} href={href} className="text-moon-2 hover:text-moon transition-colors">
              {t(key)}
            </a>
          ))}
        </nav>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
          className="shrink-0 text-xs font-bold tracking-wider max-sm:hidden"
        >
          {lang === 'ar' ? 'EN' : 'عربي'}
        </Button>
      </div>
    </header>
  )
}
