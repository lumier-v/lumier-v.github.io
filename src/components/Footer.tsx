import { useLang, type Key } from '@/lib/i18n'

const LINKS: { href: string; key: Key }[] = [
  { href: '#menu', key: 'menu' },
  { href: '#visit', key: 'visit' },
]

export function Footer() {
  const { t, n } = useLang()

  return (
    <footer className="border-rule border-t py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 px-4 text-center sm:px-8">
        <nav className="text-moon-2 flex gap-6 text-sm">
          {LINKS.map(({ href, key }) => (
            <a key={href} href={href} className="hover:text-moon transition-colors">
              {t(key)}
            </a>
          ))}
        </nav>
        <img
          src="/img/logo.png"
          alt="قمرة"
          width={200}
          height={40}
          loading="lazy"
          className="logo-on-night h-14 w-auto opacity-80"
        />
        <p className="text-moon-2 text-xs">
          {t('rights')} · {n(new Date().getFullYear())}
        </p>
      </div>
    </footer>
  )
}
