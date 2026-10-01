import type { MoonPhase as Phase } from '@/lib/hours'
import { cn } from '@/lib/utils'

const SRC: Record<Phase, string> = {
  full: '/img/phase-full.webp',
  gibbous: '/img/phase-gibbous.webp',
  half: '/img/phase-half.webp',
  crescent: '/img/phase-crescent.webp',
}

/**
 * NASA/SVS renders of the real Moon from Lunar Reconnaissance Orbiter data
 * (Moon Phase and Libration 2026, public domain). The files are already cut to
 * the disc, with the frame's black screened onto the night, at three times the
 * size they show at — so there is no clip or blend left for the browser to do.
 * The gibbous is the crescent turned inside out: the full frame with the
 * crescent's lit part laid over it as shadow.
 */
export function MoonPhase({ phase, className }: { phase: Phase; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('bg-night block size-8 shrink-0 rounded-full', className)}
    >
      <img src={SRC[phase]} alt="" width={32} height={32} loading="lazy" decoding="async" className="size-full" />
    </span>
  )
}
