# מה תוקן בפועל — 30.7.2026

מיושם על הקוד ומאומת מול build פרודקשן מקומי.
**שער אימות:** `npx tsc --noEmit` נקי · `npm test` 1707/1707 עוברים · `npm run build` נקי.

## מדידה לפני/אחרי — סריקה מלאה של 226 דפים

| מדד | לפני | אחרי |
|---|---|---|
| כותרות מעל 65 תווים | 50 | **1** |
| כותרות מעל 60 תווים | 131 | **63** |
| תיאורי meta מעל 160 | 29 | **0** |
| דפים ללא `og:image` | 102 | **0** |
| דפים ללא `<h1>` | 3 | **0** |
| כותרות עם סיומת מותג כפולה | 4 | **0** |
| קישורים נכנסים לכל `/business/<slug>` | 1 | **20** |
| קישורים נכנסים ל-`/tools/capital` | 0 | **14** |
| JSON-LD שבור | 0 | 0 |
| דפים ללא canonical | 0 | 0 |

*(הכותרת היחידה שנשארה מעל 65 היא `/business/clinic` ב-66 תווים — שם הענף עצמו ארוך.)*

## Lighthouse — נגישות

| דף | לפני | אחרי |
|---|---|---|
| `/` | — | **100** |
| `/business/cafe` | — | **100** |
| `/employee-rights/work-grant/eligibility` | — | **100** |
| `/personal-tax/salary-net-gross` | — | **98** |
| `/employee-rights/work-grant` | 91 | — |

SEO 100 בכל הדפים שנבדקו. `color-contrast` ו-`label`: **0 כשלים** בכל הדפים שנבדקו.

---

## 1. ביצועים — `app/layout.tsx`

- **`preconnect`** ל-`googletagmanager.com` ול-`google-analytics.com`. Lighthouse מדד 302ms בזבוז.
- **`strategy` שונה מ-`afterInteractive` ל-`lazyOnload`** עבור gtag. `gtag.js` הוא 167KB —
  22% ממשקל העמוד — ובתזמון הקודם הוא התחרה על ה-paint הראשון במובייל (LCP 6.2 שניות).

⚠️ **טרייד-אוף שכדאי לדעת עליו:** `lazyOnload` דוחה את טעינת GA עד אחרי שהעמוד נטען
במלואו. משמעות: ביקורים קצרים מאוד (bounce תוך פחות משנייה) עלולים לא להירשם. אם מדידת
bounce מדויקת חשובה יותר ממהירות מובייל — החזר ל-`afterInteractive` והשאר את ה-preconnect.

**המדידה האמיתית תגיע רק אחרי deploy** — Lighthouse מקומי רץ ללא latency רשת ואינו
משקף את השיפור.

## 2. נגישות — היקף גדול בהרבה ממה שהדוח תיאר

הדוח דיווח על 3 שדות ללא label, כי המדידה רצה על דף אחד. סריקת כל בסיס הקוד מצאה
**491 שדות קלט ללא שיוך label ב-72 קבצים**.

- **274 שדות** קיבלו `id` + `htmlFor` בסריקה אוטומטית של התבנית הבטוחה.
- **10 רכיבי `Field` משותפים** שוכתבו כך שהפקד יושב *בתוך* ה-`<label>` — שיוך משתמע,
  שעובד גם כשה-`children` הוא `ReactNode` שרירותי. זה כיסה את יתרת השדות.
- **ניגודיות צבע:**
  - `text-ink/40|45|50|55|60` → `text-ink/70` (ink/60 נתן 4.13:1 על cream-2, מתחת ל-4.5:1)
  - פוטר: `text-cream/35|40` → `text-cream/60`, ו-`text-gold` → `text-gold-light`
    (gold על ink-deep נתן 2.78:1; gold-light נותן 9.18:1)
  - `text-emerald-600|700` ו-`text-amber-600|700` → `-800`; `text-red-600` → `-700`
- **סדר כותרות:** `AuthorBox` — `<h4>` הוחלף ב-`<p>` (שם המחבר אינו כותרת מסמך;
  ה-Person schema נושא את המשמעות ל-SEO). `BusinessPlanCalculator` ו-`HeroSalaryCalc` —
  `<h3>` שהופיע לפני שהיה `<h2>` בעמוד קודם ל-`<h2>`.

## 3. דף חדש: `/employee-rights/work-grant/eligibility`

הכוונה עם הביקוש הגדול ביותר שאין לה URL: **261 חשיפות במיקומים 30–58, 0 קליקים**.
הפיצ'ר כבר היה בנוי כטאב בתוך דף המענק — כאן הוא קיבל route משלו.

- `NITCalculator` קיבל prop חדש `initialTab`, והדף נפתח ישירות על טאב הזכאות.
- `.answer-box` עם ארבעת התנאים והסכומים.
- `HowTo` schema (5 שלבים) + `FAQPage` (7 שאלות) + canonical + `og:image`.
- קישור דו-כיווני מ/אל `/employee-rights/work-grant`; נרשם ב-`app/sitemap.ts` וב-`public/llms.txt`.

**כל מספר בדף נגזר מ-`lib/calculators/work-grant.ts`** — `WORK_GRANT_MIN_INCOME_2026`,
`calculateMaxGrant()` וכו'. אין מספר כתוב ביד, בהתאם לכלל ה-YMYL ב-`CLAUDE.md`.

## 4. קישוריות פנימית

- **`/business/[type]`** — בלוק קישורי אחים לכל 19 הענפים האחרים + חזרה ל-hub.
  כל דף עלה מקישור נכנס אחד ל-20. זה הפער שגרם ל-`referringUrls: [sitemap.xml]` בלבד.
- **`app/tools/layout.tsx`** — הניווט הציג 4 מתוך 13 כלים. נוספו 9 (forecast, break-even,
  business-valuation, capital, customer-lifetime-value, loan-eligibility, cashflow-solo,
  budget-wizard, start). `/tools/capital` היה יתום מוחלט.

## 5. כותרות ותיאורים

- **26 דפים** הומרו ל-`title: { absolute: ... }` — מבטל את סיומת `| חשבונאי` מה-template
  בשורש (10 תווים) בדפים שנחתכו בגללה.
- **14 פוסטים בבלוג** — אותו טיפול ב-`page.mdx`.
- **`/business/[type]`** — התבנית קוצרה מ"מחשבון תוכנית עסקית 2026" ל"מחשבון עלויות 2026",
  והתיאור נבנה מהמשפט הראשון של `bt.intro` בלבד (היה 212–305 תווים).
- **`/glossary/[slug]`** — `absolute`.
- **8 תיאורים** נכתבו מחדש קצר יותר.
- **4 דפים** (`/about`, `/terms`, `/privacy`, `/accessibility`) — הוסרה סיומת המותג הכפולה.
  **זה היה באג קיים שהדוח הראשוני פספס**, לא נזק מהעבודה הזו.

## 6. `og:image` — 102 דפים

השורש כבר מגדיר `app/opengraph-image.tsx`, אבל ב-Next.js דף שמגדיר `openGraph` משלו
**מחליף** את האובייקט מההורה ומאבד את התמונה. `images: ['/opengraph-image']` נוסף
ל-22 בלוקי `openGraph` (חלקם תבניות שמייצרות עשרות דפים).

## 7. `<h1>` חסר

`/tools/capital`, `/tools/cash-flow`, `/tools/cashflow-solo` — ה-`<h2>` העליון קודם ל-`<h1>`.

---

## מה **לא** נעשה, ולמה

| פריט | סיבה |
|---|---|
| **Request Indexing ל-`/business`** | רק בעל החשבון יכול, ב-GSC. 4 מ-6 הדפים שנבדקו עדיין לא באינדקס. |
| **מספר רישיון רו"ח ל-`sameAs`** | צריך את המספר ממך. ה-LinkedIn כבר ב-`llms.txt` ואפשר להוסיף מיד עם המספר. |
| **`.answer-box` ל-192 דפים** | כתיבת תוכן YMYL — כל פסקה דורשת אימות מספרים מול `lib/calculators/`. הדף החדש קיבל אחד; היתר נשארו ב-Phase 3. |
| **הרחבת 10–15 מונחי מילון** | כנ"ל — כתיבת תוכן, לא שינוי מבני. |
| **העשרת 6 דפי hub דקים** | כנ"ל. |
| **`/tools/vat-extract` ודף מענק רטרואקטיבי** | בניית מחשבונים חדשים, לא תיקון. |
| **מדידת CWV אמיתית** | אין מפתח Google API; PSI חזר rate-limited. המספרים הם מעבדה. |
| **פרופיל backlinks** | אין מפתח Moz/Bing. |

## הצעד הבא

הכל בנוי ועובר את שער האימות, אבל **טרם נדחף** — הרווח האמיתי (מובייל LCP, אינדוקס
האשכול) נמדד רק בפרודקשן. אחרי deploy כדאי:

1. להריץ PageSpeed על `/employee-rights/work-grant` במובייל ולהשוות ל-66.
2. לבצע את שתי הפעולות ב-GSC (Request Indexing + מספר הרישיון).
3. לשמור baseline ל-drift: `"$HOME/.claude/skills/seo/bin/claude-seo" run drift_baseline.py https://cheshbonai.co.il/`
