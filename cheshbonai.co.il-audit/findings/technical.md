## Technical SEO — 82

### ✅ מה תקין
- `robots.txt` מדויק, כולל בלוק מפורש שמתיר GPTBot / ClaudeBot / PerplexityBot / CCBot / Google-Extended.
- `sitemap.xml` — 162 URLs, XML תקין, 0 warnings, 0 errors ב-GSC. **הוגש מחדש 26.7.2026 20:23 ונקרא על ידי גוגל שנייה וחצי אחר כך.** הבלוקר מהסשן הקודם — בוצע.
- HSTS `max-age=63072000`, HTTP/2, Vercel edge, `x-nextjs-prerender: 1` (prerendered), TTFB 60ms.
- 0 שרשראות הפניה, 0 קישורים שבורים מתוך ~2,400 קישורים פנימיים.

### 🔴 קריטי — אשכול `/business` לא מגיע לאינדקס
URL Inspection מחזיר **"URL is unknown to Google"** גם ל-`/business` (ה-hub) וגם ל-`/business/cafe`. גוגל מדווח `indexed: 0` מתוך 162 שהוגשו.

זה לא כשל sitemap — ה-sitemap נקרא. זה כשל **גילוי דרך קישורים**: כל דף `/business/<slug>` מקבל **קישור פנימי נכנס אחד בלבד**, מדף ה-hub. וה-hub עצמו לא מקושר מהניווט הראשי.

הראיה שזה עובד כשיש גילוי: `/business/garage`, `/business/restaurant` ו-`/business/minimarket` **כן** צברו חשיפות ב-GSC (7, 8, ו-2). כלומר חלק מהאשכול נגיש — פשוט בקושי.

**תיקון:** Request Indexing ידני ב-GSC ל-5 הדפים המובילים (רק המשתמש יכול), ובמקביל להוסיף את `/business` לניווט הראשי ולקשר אליו מ-`/self-employed/opening-business` ומ-`/self-employed/business-setup-cost`.

### 🟡 `/tools/capital` — דף יתום
0 קישורים פנימיים נכנסים, גם אין `<h1>`. הוא כן ב-sitemap (`app/sitemap.ts:143`) וצבר 4 חשיפות במיקום 49.

### 🟡 3 דפים ללא H1
`/tools/capital`, `/tools/cash-flow`, `/tools/cashflow-solo`.

---
