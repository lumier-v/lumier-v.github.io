import type { MoonPhase as Phase } from '@/lib/hours'
import { cn } from '@/lib/utils'

const SRC: Record<Phase, string> = {
  full: '/img/moon-full.jpg',
  half: '/img/moon-half.jpg',
  crescent: '/img/moon-crescent.jpg',
}

/**
 * NASA/SVS renders of the real Moon from Lunar Reconnaissance Orbiter data
 * (Moon Phase and Libration 2026, public domain). The frames ship on black; the
 * wrapper paints the night colour underneath so the screen blend has something
 * to blend into, and `.moon-disc` clips the square away regardless.
 */
export function MoonPhase({ phase, className }: { phase: Phase; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('bg-night block size-8 shrink-0 rounded-full', className)}
    >
      <img src={SRC[phase]} alt="" loading="lazy" className="moon-disc size-full" />
    </span>
  )
}
