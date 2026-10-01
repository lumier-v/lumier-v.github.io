import { useLang } from '@/lib/i18n'
import { step, useScrollReveal } from '@/lib/reveal'

export function Story() {
  const { t } = useLang()
  // Drawn in by the scroll, step by step, as the reader comes down to it.
  const ref = useScrollReveal<HTMLElement>()

  // The closing words, last on the page. In the night of the page itself: the
  // band above, with the mark, keeps the deeper one.
  return (
    <section ref={ref} id="story" className="border-rule relative border-t py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="max-w-[56ch]">
          <h2 {...step(0)} className="mb-6 text-3xl font-medium sm:text-4xl">
            {t('storyTitle')}
          </h2>
          <p {...step(1)} className="text-moon-2 mb-4">
            {t('storyP1')}
          </p>
          <p {...step(2)} className="text-moon-2">
            {t('storyP2')}
          </p>
        </div>
      </div>
    </section>
  )
}
