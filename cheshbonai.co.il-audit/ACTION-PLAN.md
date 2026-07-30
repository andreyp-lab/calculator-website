# תוכנית פעולה — cheshbonai.co.il · 30.7.2026

> **עדכון:** רוב הפריטים כאן כבר בוצעו — ראה [CHANGES-APPLIED.md](CHANGES-APPLIED.md)
> למדידת לפני/אחרי. מה שנשאר פתוח מסומן למטה ב-⬜; מה שבוצע ב-✅.


ממוין לפי עדיפות. כל פריט כולל את הקובץ המדויק והראיה.

---

## ⛔ חוסם — רק המשתמש יכול (10 דקות ב-GSC)

### ⬜ 1. Request Indexing לאשכול `/business`
מתוך 6 דפים שנבדקו ב-30.7: `garage` ו-`restaurant` כבר **"Submitted and indexed"** (נסרקו 27.7),
אבל `/business` (ה-hub), `cafe`, `gym` ו-`pizzeria` עדיין **"URL is unknown to Google"**.
ה-sitemap עובד — הפריסה פשוט איטית. Request Indexing מאיץ אותה.

ב-Search Console → URL Inspection → Request Indexing, לכל אחד:
```
https://cheshbonai.co.il/business
https://cheshbonai.co.il/business/cafe
https://cheshbonai.co.il/business/restaurant
https://cheshbonai.co.il/business/gym
https://cheshbonai.co.il/business/online-store
```
*(הגשת ה-sitemap עצמה כבר בוצעה ואומתה — הפריט הזה מה-handoff סגור.
קישורי האחים בתוך האשכול כבר נוספו בקוד, כך שמעכשיו גוגל יוכל לגלות את הדפים גם דרך קישורים ולא רק דרך ה-sitemap.)*

### ⬜ 2. מספר רישיון רו"ח ל-`sameAs`
פתוח מ-1.7. תנאי-סף ל-E-E-A-T באתר YMYL. שלח לי את המספר ואת קישור ה-LinkedIn ואוסיף ל-`Person` schema (ה-LinkedIn כבר ב-`llms.txt`, רק לא ב-schema).

---

## Phase 1 — שבוע 1 · תיקונים קריטיים

### ✅ 3. `preconnect` ל-Google Analytics — 302ms, שורה אחת
`app/layout.tsx`, בתוך `<head>`:
```html
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://www.google-analytics.com" />
```
Lighthouse mobile מודד 302ms בזבוז. `gtag.js` הוא 167KB — 22% מ-748KB של העמוד.

### ✅ 4. שקול `strategy="lazyOnload"` ל-gtag
`app/layout.tsx:177`. מובייל LCP הוא 6.2 שניות מול 1.2 בדסקטופ; `afterInteractive` מכניס 167KB לתחרות על ה-paint הראשון. `lazyOnload` דוחה אותם. עלות: אובדן קצר של אירועי bounce מהירים.

### ✅ 5. תייג את שדות הקלט
**התברר שההיקף גדול פי 160:** 491 שדות ללא label ב-72 קבצים, לא 3. תוקנו כולם
(274 ב-`id`/`htmlFor`, היתר דרך עטיפת הפקד בתוך ה-`<label>` ב-10 רכיבי `Field` משותפים).
נגישות: 91 → 98–100.

### ✅ 6. `/tools/capital` — יתום עם 0 קישורים ואין H1
הוסף `<h1>` (וגם ל-`/tools/cash-flow`, `/tools/cashflow-solo`), וקשר אליו מ-`/tools`.

---

## Phase 2 — שבועות 2–3 · השפעה גבוהה

### ✅ 7. 🔴 דף `/employee-rights/work-grant/eligibility` — רגיש לזמן
**261 חשיפות במיקומים 30–58, 0 קליקים** על אשכול "בדיקת זכאות". חלון ההגשה נסגר בספטמבר.

**חשוב:** הפיצ'ר כבר בנוי — קיים טאב "בדיקת זכאות" בתוך `/employee-rights/work-grant`. המשימה היא להוציא אותו ל-route ייעודי עם:
- `<h1>` על הכוונה: "בדיקת זכאות למענק עבודה 2026 (מס הכנסה שלילי)"
- `.answer-box` עם התשובה בפסקה אחת
- `HowTo` + `FAQPage` schema
- canonical עצמאי, קישור דו-כיווני מ/אל דף האם

### ✅ 8. קישוריות פנימית ל-`/business`
כל 21 הדפים מקבלים **קישור נכנס אחד**. `/privacy` מקבל 226.
**תיקון:** `/business` כבר היה בניווט הראשי, ושני דפי ה-pillar כבר קישרו אליו — זה נעשה ב-26.7.
הפער היה בדפי הבן. נוסף בלוק קישורי אחים בין כל 20 הענפים: 1 → 20 קישורים נכנסים לכל דף.

זה גם הפתרון ארוך-הטווח לבעיית האינדוקס בסעיף 1.

### ✅ 9. קצר 50 כותרות מעל 65 תווים
הארוכות ביותר ב-82 תווים (`/business/office`, `/business/clinic`). הסרת הסיומת `| חשבונאי` מהדפים הארוכים בלבד חוסכת 10 תווים ופותרת את רובן. גם 29 meta descriptions מעל 160 — כולן קוצרו.

### ✅ 10. `og:image` ל-102 דפים
כל אשכול `/business`, `/about`, ועוד. תבנית OG דינמית ב-Next (`opengraph-image.tsx`) מכסה את כולם בבת אחת.

---

## Phase 3 — חודש 2 · תוכן וסמכות

### ⬜ 11. `.answer-box` ל-192 דפים שאין להם
כרגע 34 מתוך 226 (15%). ה-`quickAnswer` slot ב-`CalculatorLayout` הוא המנגנון לציטוט ב-AI Overviews ולפסקאות נבחרות. התחל ב-20 הדפים עם הכי הרבה חשיפות.

### ⬜ 12. הרחב 10–15 מונחי מילון מעבר ל-60 מילים
כל 63 המונחים `noindex` כי כולם מתחת ל-60 מילים (`app/glossary/[slug]/page.tsx:24-28`). המנגנון מחזיר אותם לאינדקס **אוטומטית** ברגע שהם עוברים את הסף.
מועמדים לפי נתוני חיפוש: `מס יסף`, `נקודות זיכוי`, `דמי הבראה`, `סעיף 14`, `מס שולי`, `תיאום מס`, `קרן השתלמות`.

### ⬜ 13. העשר 6 דפי hub דקים
`/investments` (265 מילים, מיקום 86.5), `/personal-tax` (מיקום 84.9), `/real-estate` (81.6), `/insurance` (219 מילים), `/loans`, `/employee-rights` (66.7).

### ⬜ 14. דפים חסרים לפי ביקוש מדוד
- **`/tools/vat-extract`** — "חילוץ מעמ", מיקום 84.2. כוונה נפרדת מהמדריך הכללי.
- **מענק עבודה רטרואקטיבי** — "בדיקת מענק עבודה 2017", 20 חשיפות במיקום 39.
- **`דמי לידה`** — 77 חשיפות במיקום 52.2; הדף הקיים במיקום 40.1 עם 345 חשיפות.

### ✅ 15. תקן ניגודיות צבעים
גם כאן ההיקף היה גדול יותר: `text-ink/40|45|50|55|60` → `/70`, פוטר `text-cream/35|40` → `/60`
ו-`text-gold` → `text-gold-light`, ופלטת הסטטוס `emerald/amber/red` הועמקה. `color-contrast`: 0 כשלים.

---

## Phase 4 — מתמשך

### ⬜ 16. סמכות off-site — התקרה האמיתית
363 מתוך 500 שאילתות במדגם עדיין במיקום 21+. אופטימיזציית on-page לא תפרוץ את זה. OF-1..OF-6 במסמך האב.

### ⬜ 17. הקם baseline ל-drift
אין baseline שמור. אחרי Phase 1:
```bash
"$HOME/.claude/skills/seo/bin/claude-seo" run drift_baseline.py https://cheshbonai.co.il/
```

### ⬜ 18. הוסף מפתחות API כדי לסגור פערי מדידה
- **Google API key** — נתוני CrUX שדה אמיתיים במקום מעבדה (חינם)
- **Moz API** — DA/PA ופרופיל קישורים (חינם, 2,500 שורות לחודש)

---

## מה לא לעשות

**אל תיגע בכותרות של `/blog/vat-complete-guide-israel` ו-`/blog/surtax-yesef-2026-explained`.**
573 ו-216 חשיפות במיקומים 7.7 ו-10.2 עם 0 קליקים — אלו שאילתות ידע קצרות שגוגל עונה עליהן ב-AI Overview. זה סיגנל שהאתר מצוטט, לא כשל CTR.

**אל תיגע ב-`/self-employed/hourly-rate` (CTR 4.69%), `/employee-rights/sick-pay` (2.52%), `/vehicles/fuel-cost` (2.01%), `/employee-rights/annual-leave`.**
