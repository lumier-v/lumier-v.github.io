import { useEffect, useState } from 'react'
import { isOpenNow } from '@/lib/hours'
import { useLang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/** Re-checks every minute so a badge left open on screen stays truthful. */
export function useOpenNow(): boolean | null {
  const [open, setOpen] = useState<boolean | null>(() => isOpenNow())

  useEffect(() => {
    const id = window.setInterval(() => setOpen(isOpenNow()), 60_000)
    return () => window.clearInterval(id)
  }, [])

  return open
}

export function StatusBadge({ className }: { className?: string }) {
  const { t } = useLang()
  const open = useOpenNow()

  const label = open === null ? t('checking') : open ? t('open') : t('closed')

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
        open
          ? 'text-gold border-gold/35 bg-gold/5'
          : 'text-moon-2 border-rule bg-transparent',
        className,
      )}
    >
      {/* Moonlight, not a blinking indicator: only the halo breathes, and only
          while the shop is actually open. */}
      <span
        className={cn(
          'size-2.5 shrink-0 rounded-full',
          open ? 'bg-gold animate-moon-glow' : 'bg-moon-2 opacity-45',
        )}
      />
      {label}
    </div>
  )
}
