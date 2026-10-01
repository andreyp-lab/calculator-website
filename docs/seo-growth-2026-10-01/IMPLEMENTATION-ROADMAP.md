# מפת יישום SEO וצמיחה

## עקרון הפעלה

התוכנית עובדת במחזורים קטנים שניתן למדוד. סדר העבודה הוא: **אמינות מדידה → בעלות כוונה → קישוריות → המרה → הרחבה**. אין לדלג לייצור תוכן נוסף כאשר עדיין לא ניתן לדעת מה הוביל לקורס או לרכישה.

## שלב 0 — יום 0 עד 7: להקפיא הנחות ולייצר baseline

### משימות

1. לייצא ידנית פעם אחת מ־GSC נתוני 28/90 יום לפי query, page, country, device ו־search appearance. אין צורך במנוי או בחיבור בתשלום כדי להתחיל.
2. ליצור ב־GA4 exploration ל־organic landing page → `course_cta_click` → course page → `begin_checkout`.
3. לבדוק שהאירוע לפני יציאה ל־Schooler אינו אובד; אם כן, לתקן במימוש באמצעות מנגנון אמין ולא להניח שהוא עובד.
4. לבקש מ־Schooler ייצוא רכישות/מקור או מנגנון שיוך. עד אז לא להשתמש במונח conversion purchase.
5. לצלם baseline טכני: sitemap count, 200/canonical, robots, indexed/noindex sample, CWV field data אם זמין.
6. לתעד commit, תאריך פריסה וכל URL שישתנה.

### שער יציאה למדידה

- אפשר לענות כמה sessions אורגניים נכנסו לכל owner URL וכמה עברו לכל קורס.
- יש תאריך baseline מוסכם, timezone אחיד וסינון תעבורת צוות.
- כל metric מוגדר במסמך, לא רק בדשבורד.

חוסר baseline חוסם טענת uplift והסקת סיבתיות, אך **אינו חוסם** פרסום של תיקון דיוק, קישוריות בטוחה או תוכן שימושי בסיכון נמוך. במקרה כזה מסמנים את הפריסה כ־bundled/unmeasured ומתחילים מדידה קדימה.

## שלב 1 — ימים 8–30: Cohort B — עצמאי חדש

### היקף

- `/compare/osek-patur-vs-murshe` חדש.
- שיפור `/self-employed/opening-business`.
- שיפור `/self-employed/vat-threshold`.
- קישורים קונטקסטואליים מ־`/self-employed`, מע״מ, חשבוניות, הוצאות ומאמרים רלוונטיים.
- CTA CPA רק בדפים בעלי התאמת קהל.

### תלות וסדר

1. לאשר מפת owner/synonym.
2. לאמת טענות במקורות רשמיים.
3. לפרסם עמוד ההשוואה.
4. לעדכן את שני הדפים הקיימים כדי להסיר חפיפה.
5. לעדכן sitemap/קישורים/related graph.
6. לבדוק canonical, structured data, מובייל ואירועים.

### שער איכות

- אין שני titles/H1 שמבטיחים את אותה החלטה.
- “תקרה” היא מחזור ולא רווח; מקצועות חובה וסייגים נוכחים.
- CTA מוביל ל־`/course/self-employed`, לא ישירות ל־Schooler.
- אין מנוע ישן, אומדן מס אישי או המלצת כדאיות חד־משמעית.

### קריאה כיוונית מוקדמת ביום 35–42

זו קריאה מוקדמת בלבד לבעיות indexation, canonical, אירועים וקניבליזציה. דוח 28 הימים המלא נקבע **לכל URL לפי תאריך הפריסה שלו: deployment + 7 ימי התייצבות + 28 ימי מדידה** (כלומר לכל המוקדם יום 43 ל־URL שנפרס ביום 8, ומאוחר יותר ל־URL שנפרס בהמשך). בעמוד ההשוואה החדש בודקים indexation, impressions, שאילתות לא־מותג וכיסוי כוונה; אין השוואת CTR מול baseline שאינו קיים. שינויי content/title/CTA נפרסו יחד, ולכן הקריאה תיאורית ולא סיבתית. sample קטן מסומן “לא מכריע” ומאריך את חלון התצפית.

## שלב 2 — ימים 31–60: Cohort C — ניהול עסק

### היקף

- `/self-employed/business-finance` כ־pillar.
- `/tools/budget`, `/tools/cash-flow`, `/tools/cashflow-solo`, `/tools/break-even`.
- מאמרי תקציב ותזרים כתומכים, לא owner מתחרים.
- קישור מדורג ל־`/course/business`.

### תיקוני אמינות מקבילים

- לבדוק את `/tools` מול יומן האימות: אין לשווק benchmark ענפי שנותק או “60+ כלים” בלי ספירה והגדרה.
- לבדוק Organization/WebSite schema מול מציאות: “30 calculators” אינו מדד בטוח כאשר רבים מהנתיבים הם מדריכים.
- בכל כלי להציג inputs, outputs, assumptions, tax year, exclusions ו־last verified.

### שער איכות

- אין שימוש ב־`industry-benchmarks.ts`, `IndustryBenchmarks.tsx` או `suggestDefaults` כמקור אמת.
- forecasts/risk labels אינם מוצגים כתחזית מקצועית ללא אימות.
- CPA/CFO נקבע לפי intent, לא רק לפי prefix.
- שימוש בכלי אינו נפגע בגלל באנר או תוכן כבד.

## שלב 3 — ימים 61–90: Cohort D — אופטימיזציה לפי ראיות

1. לבחור עד 10 דפים עם impressions אמיתיים ו־CTR/position שמאפשרים ניסוי.
2. לשנות title/description בלבד במחזור ראשון; לא לשנות באותו יום H1, תוכן ו־CTA.
3. לרענן דפי עצמאים שוטפים: social security, advances, net, pension.
4. לשפר hub `/self-employed` לפי שלבי משתמש.
5. להחליט אילו רעיונות backlog מוצדקים בנתוני query.
6. להכין רענון 2027, אך לא לפרסם מספרי 2027 לפני מקור רשמי.

## פרוטוקול 28 יום

### חלונות

- Baseline: 28 ימים מלאים לפני פריסה.
- Cooldown: 7 ימים לאחר פריסה.
- Evaluation: 28 ימים מלאים.
- Comparison: same weekday mix; annotating holidays, campaigns, outages and major SERP changes.

### יחידת ניתוח

| שכבה | מדד | הערה |
| --- | --- | --- |
| גילוי | impressions, unique queries, indexed state | GSC בלבד |
| בחירה | clicks, CTR, position distribution | position אינו יעד יחיד |
| שימוש | engaged sessions, scroll/tool action | GA4, הגדרה קבועה |
| ניווט | owner/tool/course internal click | event עם source path |
| מסחרי | course view, begin_checkout | proxy עד רכישה |
| הכנסה | paid order, value, course | Schooler/שיוך מאומת בלבד |

### כללי החלטה

- **Keep:** שיפור במדד הראשי בלי נזק מהותי למדד משני, או תיקון דיוק/ציות שחייב להישאר.
- **Iterate:** אות חיובי אך sample קטן, query mismatch או CTA friction.
- **Inconclusive:** 28 יום או המדגם אינם מספיקים; מאריכים בלי להגדיר הצלחה או כישלון.
- **Revert/adjust:** ירידה מהותית עקבית, קניבליזציה או חיכוך UI. אין להחזיר טענה לא מדויקת בגלל ירידת engagement; משפרים את הניסוח המדויק.
- אין “win” או “fail” על פחות מ־100 impressions לדף/אשכול או פחות מ־20 sessions רלוונטיים; מאריכים חלון.

## מדדים והגדרות

| מדד | נוסחה |
| --- | --- |
| Organic course reach | משתמשים אורגניים שנכנסו לדף קורס אחרי owner/tool ÷ משתמשים אורגניים מעורבים ב־owner/tool |
| CTA rate | `course_cta_click` ייחודי ÷ engaged sessions רלוונטיים |
| Checkout start rate | `begin_checkout` ייחודי ÷ course page users |
| Owner assist rate | sessions עם supporting page → owner URL ÷ sessions בדפי support |
| Query ownership | שיעור impressions באשכול המגיעים ל־owner המיועד |
| Cannibalization flag | אותה query משמעותית מופיעה בשני owners לאורך שני חלונות |

## אחריות ומשאבים

| תפקיד | אחריות מינימלית |
| --- | --- |
| SEO/editor | intent map, brief, links, cohort log |
| רו״ח/בודק מקצועי | אישור טענות מס, סייגים ותאריך בדיקה |
| פיתוח | metadata, routes, events, canonical, redirects, UI |
| אנליטיקה | baseline, QA אירועים, דוח 28 יום |
| בעל מוצר | התאמת CTA, Schooler, החלטת keep/iterate/revert |

התוכנית אינה מניחה API של AI, מערכת לידים, דיוור, outreach, קניית קישורים או צוות נוסף. אם משאב כזה יאושר בעתיד, הוא נכנס כ־workstream נפרד עם מדידה והרשאות.

## הערת rollout נוכחי

גל הקוד הנוכחי משנה במקביל תוכן/titles בעמודי עצמאים ומרחיב מיפוי ומיקומי CTA בנתיבי בלוג/כלים/עסקים/עצמאים. לכן נתיבים “שלא נערכו בתוכן” אינם בהכרח control נקי. מתעדים את הגל כיחידת release אחת; ניסויי causal isolation מתחילים רק בגלים הבאים.

## בדיקות לפני merge ופריסה

- lint, tests, typecheck/build לפי נוהל המאגר.
- 200 + canonical עצמי לכל URL שנפגע.
- redirect יחיד וללא chain בכתובות legacy.
- sitemap כולל owner חדש ולא כולל מקור HTML תחת `/lp/`.
- mobile/desktop RTL, טבלאות ו־CTA.
- JSON-LD תקין; אין HowTo חדש ואין הבטחת FAQ rich result.
- קישורים רשמיים חיים.
- אירוע כולל `course_id`, `placement`, `source_path`; אין PII.
- בדיקת browser לנתיב המלא עד Schooler בלי לבצע רכישה.

## סיכונים ובקרות

| סיכון | בקרה |
| --- | --- |
| baseline חסר | אין טענת uplift; export ידני אחד מספיק, ותוכן שימושי/תיקון דיוק יכול להישלח עם מדידה קדימה |
| עונתיות סוף שנה | cohort ביקורת והערת לוח שנה |
| שינוי דין/תקרה | source of truth + verified date + hold בסתירה |
| קניבליזציה | owner map, redirect/synonym policy, query split review |
| CTA יתר | התאמת קהל ומדד שימוש בכלי כ־guardrail |
| החזרת מנוע ישן | denylist מפורש וביקורת import |
| מדידת checkout חלקית | בדיקת event delivery + Schooler export |
| טענות stale בכלים/schema | audit טענות לפני קידום |

## כיוון 6 חודשים

- baseline יציב ושישה מחזורי 28 יום לפחות.
- owner map מתוחזק לפי query ולא לפי ניחוש.
- attribution עד purchase אם Schooler מאפשר.
- רענון דפי 2027 מתועד ומקורות מאוחדים.
- החלטה אם להשקיע בדפים חדשים לפי assisted revenue ולא clicks בלבד.

## כיוון 12 חודשים

- הרחבת clusters שהוכיחו both discovery and course progression.
- ספריית tools מוגדרת: כלי מאומת, תרחיש, מדריך או retired — ללא אזור אפור.
- מחקר מקורי רק עם dataset, שיטה וביקורת.
- הערכת channels נוספים בנפרד; אין להחביא outreach או lead capture בתוך SEO.
