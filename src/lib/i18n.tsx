import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type Lang = 'ar' | 'en'

/** Every string on the page, in both languages. */
export interface Phrase {
  ar: string
  en: string
}

export const T = {
  // chrome
  skipToContent: { ar: 'تخطي إلى المحتوى', en: 'Skip to content' },
  menu: { ar: 'القائمة', en: 'Menu' },
  menuShop: { ar: 'القائمة والمتجر', en: 'Menu & Shop' },
  driveThru: { ar: 'اطلب وأنت بسيارتك', en: 'Order from your car' },
  joinUs: { ar: 'سجّل وكن من عملائنا', en: 'Sign up and become a regular' },
  story: { ar: 'قصتنا', en: 'Our Story' },
  visit: { ar: 'زورونا', en: 'Visit Us' },
  openMenu: { ar: 'افتح القائمة', en: 'Open navigation' },
  closeMenu: { ar: 'أغلق القائمة', en: 'Close navigation' },

  // status
  open: { ar: 'الفرع متاح لخدمتكم', en: 'The branch is open' },
  closed: { ar: 'الفرع مغلق', en: 'The branch is closed' },
  checking: { ar: 'نتأكد من الدوام…', en: 'Checking hours…' },

  // hero
  heroTitle: {
    ar: 'من الحبة للفنجان، كل خطوة نسويها بعناية',
    en: 'From bean to cup, every step done with care',
  },
  heroSub: {
    ar: 'نحمّص بُننا بإيدينا بدفعات صغيرة، ونجهز كل كوب أول ما تطلبه.',
    en: 'We roast our beans by hand in small batches, and prepare every cup the moment you order it.',
  },
  coffeeMenu: { ar: 'قائمة القهوة', en: 'Coffee Menu' },
  store: { ar: 'متجر قمرة', en: 'Qamrah Store' },
  googleRating: { ar: 'تقييم قوقل', en: 'Google Rating' },
  reviews: { ar: 'تقييم من زبائننا', en: 'Customer Reviews' },

  // menu
  menuLead: {
    ar: 'قهوة مقطرة، مشروبات إسبريسو، خيارات منعشة بدون قهوة، وحلاياتنا.',
    en: 'Pour-over coffee, espresso drinks, refreshing non-coffee options, and our desserts.',
  },
  kcal: { ar: 'سعرة حرارية', en: 'kcal' },
  riyal: { ar: 'ريال سعودي', en: 'Saudi Riyal' },

  // story
  storyTitle: {
    ar: 'قهوة قمرة تبدأ قبل التحميص بمدة طويلة',
    en: 'Qamrah coffee starts long before roasting',
  },
  storyP1: {
    ar: 'من اختيار الحبّة إلى لحظة التقديم، نمنح كل تفصيلة وقتها واهتمامها.',
    en: 'From choosing the bean to the moment it is served, we give every detail the time and care it deserves.',
  },
  storyP2: {
    ar: 'فريقنا يزن ويطحن كل كوب بدقة، لأن نص درجة حرارة أو جرام زيادة يغيّر المذاق كله.',
    en: 'Our team weighs and grinds every cup with precision, because half a degree or a single gram changes the whole taste.',
  },

  // visit
  address: {
    ar: 'طريق الملك عبدالعزيز، البستان — الغاط ١٥٧٣٢',
    en: 'King Abdulaziz Road, Al Bustan — Al Ghat 15732',
  },
  directions: { ar: 'الاتجاهات على الخريطة', en: 'Get Directions' },
  hours: { ar: 'أوقات الدوام', en: 'Opening Hours' },
  contact: { ar: 'تواصل معنا', en: 'Get in Touch' },
  phone: { ar: 'جوال', en: 'Phone' },
  instagram: { ar: 'انستقرام', en: 'Instagram' },
  tiktok: { ar: 'تيك توك', en: 'TikTok' },
  snapchat: { ar: 'سناب شات', en: 'Snapchat' },
  whatsapp: { ar: 'واتساب', en: 'WhatsApp' },

  // day labels
  sunWed: { ar: 'الأحد – الأربعاء', en: 'Sun – Wed' },
  thu: { ar: 'الخميس', en: 'Thursday' },
  fri: { ar: 'الجمعة', en: 'Friday' },
  sat: { ar: 'السبت', en: 'Saturday' },
  sunWedHours: { ar: '٧ ص – ١٢ ص', en: '7am – 12am' },
  thuHours: { ar: '٧ ص – ١ ص', en: '7am – 1am' },
  friHours: { ar: '١١:٣٠ ص – ١ ص', en: '11:30am – 1am' },
  satHours: { ar: '١١:٣٠ ص – ١٢ ص', en: '11:30am – 12am' },

  rights: { ar: 'قهوة مختصة في الغاط', en: 'Specialty coffee in Al Ghat' },
} satisfies Record<string, Phrase>

export type Key = keyof typeof T

const AR_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

/** Latin digits render as Arabic-Indic in Arabic, unchanged in English. */
export function localiseDigits(value: string, lang: Lang): string {
  if (lang === 'en') return value
  return value.replace(/[0-9]/g, (d) => AR_DIGITS[Number(d)])
}

interface LangContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: Key) => string
  /** Pick the right half of any bilingual pair that lives outside the dictionary. */
  p: (phrase: Phrase) => string
  n: (value: string | number) => string
}

const LangContext = createContext<LangContextValue | null>(null)

/**
 * Every visit opens in Arabic, whatever language the device is set to — the
 * shop is in Al Ghat and speaks Arabic first. The switch changes the language
 * for this visit only; nothing is remembered, so the next one opens in Arabic
 * again.
 */
export const INITIAL_LANG: Lang = 'ar'

export function applyLangToDocument(lang: Lang): void {
  const root = document.documentElement
  root.lang = lang
  root.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(INITIAL_LANG)

  useEffect(() => {
    applyLangToDocument(lang)
  }, [lang])

  const t = useCallback((key: Key) => T[key][lang], [lang])
  const p = useCallback((phrase: Phrase) => phrase[lang], [lang])
  const n = useCallback((value: string | number) => localiseDigits(String(value), lang), [lang])

  const value = useMemo(() => ({ lang, setLang, t, p, n }), [lang, t, p, n])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}
