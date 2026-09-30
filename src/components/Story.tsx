import { useLang } from '@/lib/i18n'

export function Story() {
  const { t } = useLang()

  return (
    <section id="story" className="bg-night-2 border-rule relative border-y py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <div className="max-w-[56ch]">
          <h2 className="mb-6 text-3xl font-medium sm:text-4xl">{t('storyTitle')}</h2>
          <p className="text-moon-2 mb-4">{t('storyP1')}</p>
          <p className="text-moon-2">{t('storyP2')}</p>
        </div>
      </div>
    </section>
  )
}
