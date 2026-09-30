import { useEffect, useState } from 'react'
import { ArrowUp, MessageCircle } from 'lucide-react'
import { CONTACT } from '@/data/menu'
import { useLang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function FloatingActions() {
  const { t } = useLang()
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t('whatsapp')}
        className="bg-gold text-night fixed bottom-6 start-6 z-40 flex size-14 items-center justify-center rounded-full shadow-[0_10px_30px_-8px_rgba(0,0,0,0.6)] transition-transform hover:-translate-y-0.5"
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <MessageCircle className="size-6" />
      </a>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('backToTop')}
        className={cn(
          'border-rule bg-night-3 text-moon fixed end-6 z-40 flex size-12 items-center justify-center rounded-full border transition-[opacity,transform] duration-300',
          showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0',
        )}
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <ArrowUp className="size-5" />
      </button>
    </>
  )
}
