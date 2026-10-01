# מבנה אתר, בעלות כוונה וקישוריות

## עקרונות ארכיטקטורה

1. **URL אחד לכל כוונה מרכזית.** ניסוח חלופי, שגיאת כתיב ושאלה קרובה נכנסים לאותו owner.
2. **Hub מארגן; owner עונה; support מרחיב; tool מבצע; course ממשיך.** אין דף שעושה הכול.
3. **קורס הוא יעד המשך לפי קהל, לא יעד פנימי מכל עמוד.** שכיר אינו נשלח אוטומטית לקורס עסקי.
4. **מדריך לא נקרא מחשבון.** כתובת היסטורית יכולה להישאר, אך title, H1 וקישורים מתארים את הפונקציה האמיתית.
5. **קוד מנותק אינו נכס SEO.** הוא אינו נכלל בספירת כלים ואינו מוחזר ללא אימות חדש.

## עץ יעד

```text
/
├── self-employed/                         hub עצמאים
│   ├── opening-business/                  owner: פתיחת עסק
│   ├── vat-threshold/                     owner: תקרת עוסק פטור
│   ├── vat/                               tool: הוספה/חילוץ מע״מ
│   ├── invoices/                          owner: מסמכים וחשבוניות
│   ├── allowed-expenses/                  owner: הוצאות מוכרות
│   ├── social-security/                   owner: ביטוח לאומי
│   ├── tax-advances/                      owner: מקדמות
│   ├── mandatory-pension/                 owner: פנסיה לעצמאי
│   ├── net/                               guide: נתונים לנטו
│   ├── business-finance/                  owner: ניהול כספים לעסק
│   └── corporation-vs-individual/         owner: חברה מול עוסק
├── compare/
│   └── osek-patur-vs-murshe/              owner חדש: החלטת פטור/מורשה
├── tools/                                 hub כלי ניהול
│   ├── budget/                            tool: תקציב
│   ├── cash-flow/                         tool: תזרים לעסק
│   ├── cashflow-solo/                     tool: תזרים פשוט לעצמאי
│   ├── break-even/                        tool: נקודת איזון
│   └── ...                                רק לפי סטטוס אימות
├── business/                              hub הקמת עסק לפי סוג
│   └── [type]/                            צ׳קליסט הצעות/נתונים, לא benchmark
├── salaried/, personal-tax/, employee-rights/, salary/[amount]
│                                             cluster שכירים; ללא CTA עסקי גורף
├── real-estate/, savings/, investments/, vehicles/, insurance/
│                                             clusters משלימים
├── blog/, guides/, glossary/, news/, topics
│                                             support/discovery
└── course/
    ├── self-employed                      CPA
    └── business                           CFO
```

## מודל קישור פנימי

```text
Support article ──► Owner guide ──► Verified tool (אם קיים)
      │                  │                     │
      └──── related ─────┴──── contextual ────┘
                         │
                  Relevant course
```

### כללי קישור

- מאמר תומך מקשר ל־owner בפסקה שבה הכוונה מופיעה, לא רק בתחתית.
- owner מקשר ל־hub, לכלי מתאים, למקור רשמי ולהמשך הקורס.
- כלי מקשר להסבר assumptions ול־owner; CTA לקורס מופיע אחרי הפעולה או בסוף, לא לפני הקלט.
- anchor מתאר את העבודה: “השוואת עוסק פטור ומורשה”, לא “לחצו כאן”.
- משתמשים ומרחיבים את `related-calculators` ואת registry המאמרים במקום ליצור בלוקים שונים בכל דף.
- כל owner צריך לפחות קישור אחד מ־hub, שניים מתוכן תומך וקישור sibling אחד.

## מטריצת קישוריות וקורסים

| מקור | יעד מרכזי | קישורי המשך | קורס |
| --- | --- | --- | --- |
| `/self-employed` | opening, comparison, threshold, invoices, expenses | social security, advances, pension | CPA לפי הקטע |
| `/self-employed/opening-business` | comparison + official registration | threshold, setup cost, invoices | CPA |
| `/compare/osek-patur-vs-murshe` | threshold + VAT + invoices | opening, expenses | CPA |
| `/self-employed/vat-threshold` | comparison + official service | VAT, invoices | CPA |
| `/self-employed/allowed-expenses` | invoices/VAT distinctions | year-end, advances | CPA |
| `/self-employed/business-finance` | budget + cash-flow | break-even, financial analysis | CFO |
| `/tools/budget` | business-finance | cash-flow, break-even | CFO |
| `/tools/cash-flow` | business-finance | budget, cashflow-solo | CFO |
| `/business/[type]` | `/business` + opening | finance, budget, cash-flow | CFO |
| salary/employee routes | hub וכלי שכיר רלוונטי | tax/refund/rights | ללא קורס עסקי |

## בעלות canonical ו־redirects

- `/compare/company-vs-osek-murshe` → `/self-employed/corporation-vs-individual` קיים; להשאיר redirect קבוע.
- `/compare/leasing-vs-buying-comparison` → `/vehicles/leasing-vs-buying` קיים; להשאיר redirect קבוע.
- אין ליצור `/osek-patur-vs-morshe`, `/patur-or-murshe` או גרסאות כתיב לעמוד ההשוואה החדש; כולן מכוסות בתוכן/redirect רק אם URL היסטורי אמיתי מופיע בלוגים.
- שינוי slug מחייב redirect יחיד, עדכון sitemap וכל הקישורים הפנימיים.
- `/lp/cpa.html` ו־`/lp/cfo.html` נשארים מקורות rewrite חסומים לסריקה; כתובות הקורס הנקיות הן canonical.

## מלאי כלים: מותר לקדם בגבולות מתועדים

| כלי/משפחה | URL | מה מותר לומר | מגבלה שחייבת להופיע |
| --- | --- | --- | --- |
| שכר נטו/ברוטו | `/personal-tax/salary-net-gross`, `/salary/[amount]` | אומדן 2026 לפי הקלט | לא תלוש; מניח שכר מבוטח=ברוטו ואינו כולל זיכוי אפשרי על הפקדת עובד לפנסיה |
| מע״מ בסיסי כללי | `/self-employed/vat`, `/embed/vat` | הוספה/חילוץ 18%; `/self-employed/vat` הוא owner הכללי | אינו קובע חייבות, תשומות או סיווג עסקה |
| חילוץ מע״מ ממוקד | `/tools/vat-extract` | חילוץ רכיב מע״מ מסכום כולל | metadata ותוכן צריכים להתמקד בחילוץ; אם הדף ממשיך לכוון גם להוספה, לאחד/להפנות ל־`/self-employed/vat` |
| משכנתא בסיסית | `/real-estate/mortgage` | תשלום מסלול יחיד בריבית קבועה, שפיצר/קרן שווה | בלי הצמדה, משתנה, עמלות, ביטוחים או תמהיל |
| מס רכישה | `/real-estate/purchase-tax` | אומדן לתרחישים המכוסים | סיווג וזכאות דורשים בדיקה רשמית |
| דמי הבראה | `/employee-rights/recreation-pay` | אומדן בסיסי לפי הקלט וההסדר המתואר | תלוי מגזר/הסכם/צו |
| יעד תעריף שעתי | `/self-employed/hourly-rate` | יעד הכנסה ÷ שעות חיוב | לא מחיר שוק ולא חישוב מס |
| ערך עבודה | `/personal-tax/work-value` | השוואת קלטים שהמשתמש כבר בדק | אין המלצת תעסוקה |
| ריבית דריבית | `/investments/compound-interest` | תרחיש מתמטי על הנחות משתמש | אין תשואה, אינפלציה או מס ברירת מחדל מובטחים |
| החזר הלוואה | `/savings/loan-repayment` | החזר בריבית קבועה | ללא עמלות, APR/אישור או דירוג יכולת |
| עלות דלק | `/vehicles/fuel-cost` | צריכה × מחיר עריך | מחיר והנחות משתנים |
| break-even/ROI | `/tools/break-even`, `/investments/roi` | אריתמטיקה/תרחיש קלט | לא benchmark ולא המלצת השקעה |
| תקציב ותזרים | `/tools/budget`, `/tools/cash-flow`, `/tools/cashflow-solo` | ניהול נתוני משתמש ותרחישים | תחזיות, סיכון וברירות מחדל ענפיות דורשים סייג/אימות |

## סיווג מלא של נתיבי `/tools/*` הציבוריים

| URL | סיווג לתוכנית | שימוש SEO/מוצר מותר כעת | פעולה נדרשת |
| --- | --- | --- | --- |
| `/tools` | Hub | ניווט לכלים לפי פעולה וסטטוס | להסיר/לתקן “60+”, benchmark ויכולות שאינן מוכחות |
| `/tools/budget` | כלי פעיל עם מגבלות | תקציב על קלט משתמש | להציג עלויות מעסיק/מס כהנחות או שורות משתמש; ללא benchmark |
| `/tools/cash-flow` | כלי פעיל עם מגבלות | תזרים עסקי על נתוני משתמש | לסייג תחזיות, סיכון ותרחישי חוב |
| `/tools/cashflow-solo` | כלי פעיל ממוקד | תזרים פשוט לעצמאי | לבדל מ־`cash-flow` לפי קהל ופונקציה |
| `/tools/break-even` | תרחיש אריתמטי | נקודת איזון על קלט משתמש | אין benchmark ענפי או המלצת מחיר |
| `/tools/vat-extract` | כלי אריתמטי ממוקד | חילוץ מע״מ בלבד | לצמצם metadata/content; אחרת לאחד עם `/self-employed/vat` |
| `/tools/budget-wizard` | כלי פעיל אך מוגבל | איסוף נתונים ובניית תקציב | אין ברירות מחדל/אזהרות המבוססות על benchmark ענפי; audit לפני קידום |
| `/tools/unified` | אגרגטור פעיל אך מוגבל | ממשק מאוחד לנתוני משתמש | טאבי benchmark נותקו; אין לשווקם, ולקדם רק אחרי QA מלא של כל מודול |
| `/tools/forecast` | תרחיש לאימות נוסף | תחזית על הנחות משתמש בלבד | לא לקדם כ“חיזוי מקצועי” עד audit של הנחות, סיכון וברירות מחדל |
| `/tools/financial-analysis` | תרחיש לאימות נוסף | ניתוח נתונים שהמשתמש מזין | benchmark/ציונים הוסרו; audit לפני קידום או תוצאה החלטית |
| `/tools/capital` | תרחיש לאימות נוסף | DCF/Cap Table על הנחות משתמש | להציג רגישות ומגבלות; לא “שווי חברה” ודאי |
| `/tools/customer-lifetime-value` | מדריך | שיטת חישוב ונתונים לאיסוף | אין threshold בריאות אוניברסלי או מחשבון ישן |
| `/tools/business-valuation` | מדריך | שיטות, נתונים ומגבלות | אין מכפיל ענפי או שווי עסקה אוטומטי |
| `/tools/loan-eligibility` | מדריך | מסלולים ותנאים לבדיקה | אין קביעת זכאות או אישור אשראי |
| `/tools/start` | Launcher עם טענות stale | ניווט לכלי מתאים בלבד | להסיר הבטחות benchmark/Monte Carlo/“מקצועי” שלא אומתו לפני קידום |

“תרחיש לאימות נוסף” אינו retired: הנתיב יכול להישאר פעיל, אך אין למצבו כמחשבון מקצועי או להרחיב את החשיפה האורגנית שלו לפני בדיקת הנחות, קלטים ופלטים. “מדריך” נשאר indexable לפי איכות, אך אינו נספר ככלי חישוב.

## מדריכים ששמרו URL של “מחשבון” אך אינם כלי אישי

- `/self-employed/net`
- `/self-employed/year-end-tax-simulator`
- `/self-employed/corporation-vs-individual`
- `/self-employed/dividend-vs-salary`
- `/self-employed/employer-cost`
- `/self-employed/mandatory-pension`
- זכויות עובד שבהן הוסר מנוע אישי: פיצויים, חופשה, בונוס, מחלה ומסלולים נוספים לפי היומן.
- `/real-estate/mortgage-optimizer` והחלטות מתקדמות שנשמרו כמדריכים.
- `/compare/rent-vs-buy` ועמודי ליסינג שבהם מנוע ההכרעה הוסר.
- 20 נתיבי `/business/[type]` — צ׳קליסטים לאיסוף נתונים והצעות, לא תחזיות ענף.

Metadata וקישורים פנימיים חייבים לקרוא להם “מדריך”, “בדיקה” או “תרחיש” לפי הפונקציה האמיתית.

## מנועים מנותקים/שהוסרו — denylist

אין להחזיר או לקדם ללא פרויקט אימות נפרד:

- `allowed-expenses`
- `bituach-leumi-self-employed`
- `corporation-vs-individual`
- `dividend-vs-salary`
- `employer-cost`
- `hourly-rate` הישן (הדף הציבורי נשאר אריתמטיקה פשוטה בלבד)
- `self-employed-net`
- `self-employed-pension`
- `tax-advances`
- `vat` הישן ו־`vat-threshold`
- `year-end-tax-simulator`
- `combined-income`
- מנועי severance, annual bonus, annual leave/employee-benefits ו־sick pay הישנים
- mortgage optimizer/tabs מתקדמים, תמהיל/מחזור/כושר החזר לא מאומתים
- leasing-vs-buying, finance-vs-operating lease ומנוע rent-vs-buy מלא
- pension payout estimate
- מאגר עלויות/רווחיות ל־`business/[type]`
- `industry-benchmarks.ts`, `IndustryBenchmarks.tsx`, `suggestDefaults` כמקור לציבור

בדיקות יחידה של קוד אינן מאמתות את הנתונים או את תחולת הדין.

## hubs ותוכן תומך

### `/self-employed`

מבנה מומלץ:

1. מתחילים: opening → comparison → threshold.
2. מוציאים מסמכים: VAT → invoices → expenses.
3. מנהלים שוטף: advances → social security → pension.
4. בודקים סוף שנה: net/year-end guide.
5. גדלים: business-finance → tools → CFO.

### `/tools`

יש להציג קטגוריות לפי פעולה וסטטוס:

- כלים מאומתים אריתמטית.
- תרחישים על קלט משתמש.
- מדריכים/צ׳קליסטים.
- אין להציג benchmarks או יכולת “חיזוי” ללא מקור ובדיקה.

### בלוג

לכל מאמר יש owner אחד שאליו הוא מקשר. `relatedCalculator` ו־`related` הם נקודת התחלה, אך יש להוסיף קישור בתוך גוף הטקסט. בלוג אינו מקבל CTA course ישיר בכל מקום; ברירת המחדל היא support → owner → course.

## indexation ו־schema

- owner, hub, כלי ומאמר מהותי: index + canonical עצמי, אם איכות התוכן מספיקה.
- מילון דק: להמשיך `noindex` עד תוכן ייחודי אמיתי; אין להרחיב במסה לשם ספירה.
- `Article`/`BlogPosting`, `BreadcrumbList`, `Organization`, `WebSite` ו־schema של קורס לפי התאמה.
- FAQPage אפשרי לייצוג תוכן, אך לא כהבטחת rich result; אין להמליץ על FAQ חדש למטרת SERP feature.
- אין HowTo schema חדש; השימוש הקיים דורש backlog לבדיקה משום שהפורמט מיושן לצורכי Google.
- מספר כלים/מחשבונים ב־Organization/WebSite schema חייב להיות ניתן להוכחה ומוגדר.

## בדיקת מבנה אחרי כל גל

- [ ] אין orphan owner.
- [ ] כל synonym ממופה לבעלים יחיד.
- [ ] אין redirect chain.
- [ ] sitemap ו־canonical תואמים.
- [ ] CTA מופיע רק בקהל הנכון.
- [ ] דף שמוגדר tool אכן מספק פונקציה פעילה.
- [ ] אין import ציבורי של denylist.
- [ ] קישורי המקור והקורס עובדים במובייל ובדסקטופ.
- [ ] מפת המסע נמדדת עם `source_path` ו־`course_id`.
