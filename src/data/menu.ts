import type { Phrase } from '@/lib/i18n'

export interface MenuItem {
  name: Phrase
  /** Printed as-is either side of an en dash for ranges, e.g. "13–16". */
  price: string
  /** Desserts carry a photo and a calorie count; drinks carry neither. */
  image?: string
  kcal?: number
  /** A brewing or preparation note — the detail only a specialty shop has. */
  note?: Phrase
}

export interface MenuGroup {
  /** Optional sub-heading inside a category, e.g. "Coffee of the Day". */
  label?: Phrase
  items: MenuItem[]
}

export interface MenuCategory {
  id: string
  title: Phrase
  groups: MenuGroup[]
}

export const MENU: MenuCategory[] = [
  {
    id: 'pour-over',
    title: { ar: 'القهوة المقطرة', en: 'Pour-Over Coffee' },
    groups: [
      {
        label: { ar: 'قهوة اليوم', en: 'Coffee of the Day' },
        items: [
          { name: { ar: 'وسط', en: 'Medium' }, price: '7' },
          { name: { ar: 'كبير', en: 'Large' }, price: '9' },
        ],
      },
      {
        items: [
          {
            name: { ar: 'ايس دريب', en: 'Ice Drip' },
            price: '10–18',
          },
          {
            name: { ar: 'V60', en: 'V60' },
            price: '13–16',
          },
        ],
      },
    ],
  },
  {
    id: 'hot',
    title: { ar: 'المشروبات الساخنة', en: 'Hot Drinks' },
    groups: [
      {
        items: [
          { name: { ar: 'إسبريسو', en: 'Espresso' }, price: '9–12' },
          { name: { ar: 'أمريكانو', en: 'Americano' }, price: '10' },
          { name: { ar: 'كابتشينو', en: 'Cappuccino' }, price: '12' },
          { name: { ar: 'فلات وايت', en: 'Flat White' }, price: '13' },
          { name: { ar: 'لاتيه', en: 'Latte' }, price: '14' },
          { name: { ar: 'سبانش لاتيه', en: 'Spanish Latte' }, price: '15' },
          { name: { ar: 'شوكولاتة ساخنة', en: 'Hot Chocolate' }, price: '10' },
          {
            name: { ar: 'شوكولاتة ساخنة + اسبريسو', en: 'Hot Chocolate + Espresso' },
            price: '13',
          },
          { name: { ar: 'قهوة سعودية', en: 'Saudi Coffee' }, price: '3–5' },
          { name: { ar: 'شاهي', en: 'Tea' }, price: '3–6' },
        ],
      },
    ],
  },
  {
    id: 'cold',
    title: { ar: 'المشروبات الباردة', en: 'Cold Drinks' },
    groups: [
      {
        items: [
          { name: { ar: 'آيس أمريكانو', en: 'Iced Americano' }, price: '13' },
          { name: { ar: 'آيس لاتيه', en: 'Iced Latte' }, price: '14' },
          { name: { ar: 'وايت موكا', en: 'White Mocha' }, price: '16' },
          { name: { ar: 'سبانش لاتيه', en: 'Spanish Latte' }, price: '16' },
        ],
      },
      {
        label: { ar: 'مشروبات منعشة', en: 'Refreshing Drinks' },
        items: [
          { name: { ar: 'آيس تي خوخ', en: 'Iced Peach Tea' }, price: '12' },
          { name: { ar: 'كركديه', en: 'Karkade' }, price: '12' },
          { name: { ar: 'موهيتو سجنتشر', en: 'Signature Mojito' }, price: '10' },
        ],
      },
    ],
  },
  {
    id: 'desserts',
    title: { ar: 'حلى', en: 'Desserts' },
    groups: [
      {
        items: [
          {
            name: { ar: 'كوكيز كلاسيك', en: 'Classic Cookies' },
            price: '9.75',
            kcal: 384,
            image: '/img/dessert-cookies-classic.png',
          },
          {
            name: { ar: 'بيكا', en: 'Beka' },
            price: '23',
            kcal: 287,
            image: '/img/dessert-beka.png',
          },
          {
            name: { ar: 'كرانشي', en: 'Crunchy' },
            price: '9',
            kcal: 120,
            image: '/img/dessert-crunchy.png',
          },
          {
            name: { ar: 'بسبوسة', en: 'Basbousa' },
            price: '6',
            kcal: 112,
            image: '/img/dessert-basbousa.png',
          },
          {
            name: { ar: 'دولتشي', en: 'Dolce' },
            price: '22',
            kcal: 298,
            image: '/img/dessert-dolce.png',
          },
          {
            name: { ar: 'بودينق الشوكولاتة', en: 'Chocolate Pudding' },
            price: '12',
            kcal: 333,
            image: '/img/dessert-chocolate-pudding.png',
          },
          {
            name: { ar: 'تشيز كيك توت', en: 'Berry Cheesecake' },
            price: '20',
            kcal: 270,
            image: '/img/dessert-berry-cheesecake.png',
          },
        ],
      },
    ],
  },
]

export const CONTACT = {
  phoneDisplay: '+966 53 384 7992',
  phoneRaw: '+966533847992',
  whatsapp:
    'https://wa.me/966533847992?text=' +
    encodeURIComponent('السلام عليكم، ودي أستفسر عن'),
  instagram: 'https://www.instagram.com/qamrah.coffee',
  tiktok: 'https://www.tiktok.com/@qamrah.coffee',
  store: 'https://salla.sa/qamrahcoffee',
  maps: 'https://www.google.com/maps/search/?api=1&query=26.0235295,44.9579574',
  // Stated as floors, not snapshots: shown as "4.5+" and "150+" so they
  // stay true as the real figures grow, with no feed to keep in sync.
  ratingFloor: '4.5',
  reviewFloor: '150',
} as const
