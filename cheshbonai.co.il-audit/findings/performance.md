## Performance — 66

Lighthouse 12.8, מדידה מקומית (PSI API היה rate-limited ללא מפתח; אין נתוני CrUX שדה).

| | דסקטופ | מובייל |
|---|---|---|
| Performance | **97** | **66** |
| FCP | 0.8s | 3.8s |
| **LCP** | 1.2s | **6.2s** ❌ |
| TBT | 0ms | 80ms |
| **CLS** | **0** ✅ | **0** ✅ |
| Accessibility | 91 | 91 |
| SEO | 100 | — |
| Best Practices | 100 | — |

CLS 0 ו-TBT 80ms מצוינים. הבעיה היחידה היא **זמן טעינה ראשוני במובייל**, ורכיב ה-LCP הוא פסקת טקסט — כלומר זה חסם רשת/פונטים, לא תמונה.

### הגורם המרכזי: gtag.js
| משאב | גודל | לא בשימוש |
|---|---|---|
| `googletagmanager.com/gtag/js` | **167 KB** | 70 KB |
| chunk `0f918l78~8~xp.js` | 108 KB | 46 KB |
| chunk `16~dd7dj-fqnh.js` | 72 KB | 25 KB |
| פונט woff2 #1 | 44 KB | — |
| פונט woff2 #2 | 41 KB | — |

**סה"כ עמוד: 748 KB, מהם 167 KB (22%) הם GA4** — שהותקן ב-26.7 (`app/layout.tsx:176`, `strategy="afterInteractive"`). Lighthouse מזהה 302ms בזבוז על היעדר `preconnect` ל-`google-analytics.com`.

3 משפחות פונטים נטענות (`Heebo`, `JetBrains_Mono`, `Frank_Ruhl_Libre`) — 85 KB.

### נגישות — 91, ו-3 כשלים אמיתיים
- **`color-contrast`: 17 אלמנטים** — בעיקר `text-ink/60` על רקע cream.
- **`label`: 3 שדות** — `<input type="number">` במחשבון מענק עבודה ללא `<label>` משויך.
- **`heading-order`: 2** — `<h4>` ללא `<h3>` שקדם לו.

לאתר יש דף `/accessibility` והצהרת נגישות. הפער בין ההצהרה למימוש הוא חשיפה רגולטורית, לא רק ניקוד.

---
