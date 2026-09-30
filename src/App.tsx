import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { MenuSection } from '@/components/MenuSection'
import { Story } from '@/components/Story'
import { Visit } from '@/components/Visit'
import { Footer } from '@/components/Footer'
import { FloatingActions } from '@/components/FloatingActions'
import { LangProvider, useLang } from '@/lib/i18n'

function SkipLink() {
  const { t } = useLang()
  return (
    <a
      href="#home"
      className="bg-gold text-night absolute start-4 top-0 z-[60] -translate-y-20 rounded-b-lg px-5 py-3 text-sm font-semibold transition-transform focus:translate-y-0"
    >
      {t('skipToContent')}
    </a>
  )
}

export default function App() {
  return (
    <LangProvider>
      <SkipLink />
      <Nav />
      <main>
        <Hero />
        <MenuSection />
        <Story />
        <Visit />
      </main>
      <Footer />
      <FloatingActions />
    </LangProvider>
  )
}
