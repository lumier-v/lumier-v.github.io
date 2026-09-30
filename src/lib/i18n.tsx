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
  story: { ar: 'قصتنا', en: 'Our Story' },
  visit: { ar: 'زورونا', en: 'Visit Us' },
  openMenu: { ar: 'افتح القائمة', en: 'Open navigation' },
  closeMenu: { ar: 'أغلق القائمة', en: 'Close navigation' },

  // status
  open: { ar: 'قمرة متاح لخدمتكم', en: 'Qamrah is open' },
  closed: { ar: 'قمرة غير متاح الآن', en: 'Qamrah is closed' },
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
    ar: 'القهوة الزينة تبدأ قبل التحميص بمدة طويلة',
    en: 'Great coffee starts long before roasting',
  },
  storyP1: {
    ar: 'نختار حبوبنا من مزارع صغيرة نعرف أصحابها بأسمائهم، ونحمّصها بدفعات صغيرة عشان نقدر نوقف عند الدرجة اللي تطلع أحلى شي في كل أصل.',
    en: 'We select our beans from small farms whose owners we know by name, and roast them in batches small enough that we can stop at the exact degree that brings out the best in each origin.',
  },
  storyP2: {
    ar: 'فريقنا يزن ويطحن كل كوب بدقة، لأن نص درجة حرارة أو جرام زيادة يغيّر الفنجان كله.',
    en: 'Our team weighs and grinds every cup with precision, because half a degree or a single gram changes the whole cup.',
  },

  // visit
  address: {
    ar: 'طريق الملك عبدالعزيز، البستان — الغاط ١٥٧٣٢',
    en: 'King Abdulaziz Road, Al Bustan — Al Ghat 15732',
  },
  directions: { ar: 'الاتجاهات على الخريطة', en: 'Get Directions' },
  hours: { ar: 'أوقات الدوام', en: 'Opening Hours' },
  phone: { ar: 'جوال', en: 'Phone' },
  instagram: { ar: 'انستقرام', en: 'Instagram' },
  tiktok: { ar: 'تيك توك', en: 'TikTok' },
  whatsapp: { ar: 'راسلنا على واتساب', en: 'Message us on WhatsApp' },
  backToTop: { ar: 'ارجع لفوق', en: 'Back to top' },

  // day labels
  sunWed: { ar: 'الأحد – الأربعاء', en: 'Sun – Wed' },
  thu: { ar: 'الخميس', en: 'Thursday' },
  fri: { ar: 'الجمعة', en: 'Friday' },
  sat: { ar: 'السبت', en: 'Saturday' },
  sunWedHours: { ar: '٧ ص – ١٢ ص', en: '7am – 12am' },
  thuHours: { ar: 'فاتحين ٢٤ ساعة', en: 'Open 24 hours' },
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

const STORAGE_KEY = 'qamrah:lang'

/**
 * A visitor's own choice always wins; otherwise follow the browser. Anything
 * that is neither Arabic nor English falls back to Arabic — the shop is in
 * Al Ghat, so Arabic is the sensible default for a passer-by.
 *
 * Deterministic on purpose: main.tsx calls this before the first render to set
 * lang/dir, so an English visitor never sees a frame of right-to-left layout.
 */
export function detectLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* private windows and blocked storage both throw — fall through */
  }

  try {
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language]
    for (const tag of preferences) {
      const code = tag?.toLowerCase() ?? ''
      if (code.startsWith('ar')) return 'ar'
      if (code.startsWith('en')) return 'en'
    }
  } catch {
    /* ignore and use the default */
  }

  return 'ar'
}

export function applyLangToDocument(lang: Lang): void {
  const root = document.documentElement
  root.lang = lang
  root.dir = lang === 'ar' ? 'rtl' : 'ltr'
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang)

  // Only an explicit switch is remembered, so a visitor who never touches the
  // toggle keeps following their browser rather than being pinned by one visit.
  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* the choice still applies for this visit */
    }
  }, [])

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
