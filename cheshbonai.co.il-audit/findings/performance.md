# ביצועים ונגישות — 2.10.2026

המדידות הן Lighthouse מקומי ולא נתוני CrUX שדה. ציוני Performance משתנים בין הרצות ולכן יש להתייחס למדדים ולכשלים, לא לציון יחיד.

## לפני התיקון

- `/course/business`: Performance 55, נגישות 92, Best Practices 96, SEO 100; LCP/FCP כ־13.5 שניות בהרצה הבעייתית.
- `/vehicles/fuel-cost`: Performance 81, נגישות 89, Best Practices 100, SEO 100.
- דף הבית: Performance 49, נגישות/Best Practices/SEO 100; LCP 6.3 שניות ו־TBT 790ms.

בדפי הקורס נמצאו פונטים חוסמי render, בקשות יחסיות לקובצי UUID שאינם קיימים, landmark חסר, סדר כותרות וניגודיות.

## אחרי התיקון המקומי

- `/course/business`: Performance נע בין 83 ל־98, נגישות 100, Best Practices 100, SEO 100; אין שגיאות console וכשלי main/heading/contrast עברו.
- `/vehicles/fuel-cost`: Performance 90, נגישות 100, SEO 100. Best Practices 96 בסביבת הפיתוח בלבד בגלל בקשת Vercel Insights שאינה זמינה מקומית.

## פעולות שבוצעו

- הוסרו טעינות Google Fonts והצהרות פונט שבורות משני דפי הקורס.
- נוספו `main`, היררכיית כותרות וצבעים נגישים יותר.
- נוספו labels/aria-labels במחשבון הדלק ובחיפוש המשותף.
- תוקן סדר כותרת ברכיב disclaimer וברכיב השכר.

## נשאר למעקב

- למדוד INP ו־LCP שדה לאחר הפריסה; long tasks נצפו בדף הבית, בקורס ובכלים אינטראקטיביים.
- להוסיף מידות או aspect-ratio ל־14 תמונות בדפי הקורס.
- לבדוק את תרומת Analytics ו־Recharts ל־JavaScript לא בשימוש.
- אזהרות ResponsiveContainer ב־prerender נשארו; build מצליח ואין עדיין הוכחה לכשל runtime.
