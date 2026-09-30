# قمرة | Qamrah Coffee

موقع قهوة مختصة قمرة — الغاط، السعودية.

## التشغيل محلياً

```bash
npm install
npm run dev        # خادم تطوير
npm run build      # بناء للإنتاج في dist/
npm run preview    # معاينة البناء
```

## النشر — Cloudflare Pages

الموقع يُبنى وينشر تلقائياً مع كل push على `main`.

**الإعداد مرة واحدة** في لوحة Cloudflare → Workers & Pages → Create → Pages → Connect to Git:

| الحقل | القيمة |
| --- | --- |
| Repository | `lumier-v/lumier-v.github.io` |
| Production branch | `main` |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |

إصدار Node مثبّت في `.node-version`، فما يحتاج متغير بيئة.

بعد أول نشر يعطيك رابطاً على `pages.dev`. وكل Pull Request يحصل على رابط معاينة مستقل قبل ما يندمج.

## بنية المشروع

```
src/
  components/      أقسام الصفحة + مكوّنات shadcn/ui في components/ui
  data/menu.ts     القائمة وبيانات التواصل — عدّل الأسعار من هنا
  lib/hours.ts     أوقات الدوام كنطاقات دقائق أسبوعية بتوقيت الرياض
  lib/i18n.tsx     نصوص عربي/إنجليزي
public/
  img/             صور بأسماء ثابتة
  _headers         سياسات التخزين المؤقت لـ Cloudflare
```

## ملاحظات

**التخزين المؤقت.** ملفات `assets/` مبصومة بهاش فتُخزَّن سنة كاملة. صور `img/` أسماؤها ثابتة فتُخزَّن يوماً واحداً — لو خزّنّاها أطول، أي صورة نستبدلها تبقى قديمة عند الزوار.

**حالة الدوام.** تُحسب في متصفح الزائر بتوقيت `Asia/Riyadh` مهما كان موقعه، وتتحدث كل دقيقة. لتعديل الأوقات: `src/lib/hours.ts` (النطاقات) و`src/lib/i18n.tsx` (النصوص المعروضة) — الاثنان معاً.

**صور القمر** من NASA Scientific Visualization Studio، إصدار Moon Phase and Libration 2026 المبني على بيانات مسبار Lunar Reconnaissance Orbiter. ملك عام.

**رمز الريال** رمز البنك المركزي السعودي الرسمي (فبراير ٢٠٢٥)، مضمّن كمسار SVG لأن المحرف اليونيكودي U+20C0 لا يزال بلا دعم في أغلب الخطوط.

**`legacy-index.html`** هو الموقع القديم بملف واحد قبل إعادة البناء، محفوظ للمرجع.
