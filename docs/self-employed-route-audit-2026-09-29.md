# בדיקת דפי העצמאים — 29.9.2026

הבדיקה כיסתה את כל 18 הנתיבים תחת `app/self-employed`, את הטענות הכספיות הבולטות ואת מנועי החישוב שהיו קשורים אליהם. "נבדק" פירושו שהטענה המספרית או תיאור השירות הושוו למקור ראשוני; הוא אינו אישור לחישוב מס אישי. שירותי הרשויות, מועדים ותחולת הדין עשויים להשתנות.

| נתיב | טענה או פונקציה שנבדקה | מקור ראשוני | תוצאה ומגבלה |
| --- | --- | --- | --- |
| `/self-employed` | תקרת עוסק פטור 122,833 ₪, מע״מ 18%, קישורים למדריכים | [רשות המסים — פתיחת עוסק פטור](https://www.gov.il/he/service/request-open-exempt-dealer-via-internet), [שיעור מע״מ](https://www.gov.il/he/pages/vat-history) | המספרים תואמים ל־2026. קישור מטעה ל״מחשבון תוכנית עסקית״ הוחלף במדריך עלויות. |
| `/self-employed/allowed-expenses` | הבחנה בין ניכוי הוצאה למס הכנסה וקיזוז תשומות | [דע זכויותיך וחובותיך](https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf) | הדף מבקש תיעוד וסיווג לפי נסיבות; אינו מציג אחוז ניכוי אחיד. |
| `/self-employed/business-finance` | מע״מ 18%, תקרת 122,833 ₪, מקדמות ותכנון תזרים | [שיעור מע״מ](https://www.gov.il/he/pages/vat-history), [רישום עוסק פטור](https://www.gov.il/he/service/request-open-exempt-dealer-via-internet) | טענות המס המספריות תואמות. תחזית 13 שבועות היא שיטת עבודה מוצעת, לא נתון רשמי או התחייבות לתוצאה. |
| `/self-employed/business-setup-cost` | אגרות ורכיבי תקציב פתיחה | [רישום עוסק פטור](https://www.gov.il/he/service/request-open-exempt-dealer-via-internet), [אגרה שנתית לחברה](https://www.gov.il/he/service/company_partnership_annual_payment) | הוסרו טווחי מחירים לא מתועדים. תמחור ספקים מחייב הצעות מחיר עדכניות. |
| `/self-employed/corporation-vs-individual` | השוואת מס חברה, משיכה ועלויות החזקה | [דע זכויותיך וחובותיך](https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf) | מדריך שיקולים בלבד; אין נקודת איזון אחידה או אומדן נטו אישי. |
| `/self-employed/dividend-vs-salary` | שכר לעומת דיבידנד | [דע זכויותיך וחובותיך](https://www.gov.il/BlobFolder/generalpage/income-tax-guide-knowyourright/he/Guides_IncomeTax_da-2025.pdf) | אין המלצה מספרית אחידה; נדרש חישוב לפי מבנה החברה והכנסות בעל המניות. |
| `/self-employed/employee-and-self-employed` | הכנסה משכירות ועצמאות יחד | [הביטוח הלאומי — מעמד עצמאי](https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/default.aspx) | הדף מפנה לבדיקת מעמד ובסיס חיוב אישי; אינו מכפיל שיעור אחיד בכל ההכנסה. |
| `/self-employed/employer-cost` | רכיבי עלות העסקה | [הביטוח הלאומי — שיעורי שכירים](https://www.btl.gov.il/Insurance/Rates/Pages/%D7%9C%D7%A2%D7%95%D7%91%D7%93%D7%99%D7%9D%20%D7%A9%D7%9B%D7%99%D7%A8%D7%99%D7%9D.aspx) | אומדן העלות הישן הוסר כי הכפיל ימי חופשה/מחלה על שכר שכבר משולם. הסכום תלוי בהסכם ובנתוני העובד. |
| `/self-employed/hourly-rate` | יעד הכנסות חלקי שעות חיוב | חישוב אריתמטי: 24,000 ÷ 120 = 200 | הכלי מציג יעד חשבוני בלבד. אינו מחשב מס אישי או מחיר שוק. |
| `/self-employed/invoices` | סף מספר הקצאה 10,000/5,000 ₪; מסמכים דיגיטליים ושמירת ספרים | [רשות המסים — חשבוניות ישראל](https://www.gov.il/he/pages/minisite-israel-invoice-200324), [מדריך לעוסק החדש](https://www.gov.il/he/pages/vat-to-the-new-dealer?chapterIndex=14), [מרשם תוכנות לניהול ספרים](https://www.gov.il/he/service/itc-software-registry-for-computerized-accounting-systems) | הספים תואמים. הוסרו ניסוחים שהבטיחו ניכוי תשומות או חוקיות לכל PDF; חובת מספר תלויה בתנאי המודל. |
| `/self-employed/mandatory-pension` | חובת הפקדה 4.45% ו־12.55% | [משרד האוצר — פנסיה חובה לעצמאים](https://www.gov.il/he/pages/independent-must-pension) | השיעורים תואמים למדריך. הגיל, בסיס ההכנסה והפקדות כשכיר מחייבים בדיקה אישית. |
| `/self-employed/net` | רכיבי הכנסה פנויה | [מחשבון רשמי של הביטוח הלאומי](https://www.btl.gov.il/Simulators/BituahCalc/Pages/Insurance_NotSachir.aspx), [דוח שנתי ליחיד](https://www.gov.il/he/departments/topics/annual-reports-1301) | אין אומדן נטו אישי ללא זיכויים, הכנסות נוספות ומעמד בביטוח הלאומי. |
| `/self-employed/opening-business` | 122,833 ₪, 18%, מדרגות מס 2026, מסלולי רישום | [פתיחת עוסק פטור](https://www.gov.il/he/service/request-open-exempt-dealer-via-internet), [פתיחת עוסק מורשה](https://www.gov.il/he/service/vat-821), [טופס 5329](https://www.gov.il/he/service/itc5329), [שינוי מדרגות 2026](https://www.gov.il/BlobFolder/dynamiccollectorresultitem/employers-info-300326-1/he/IncomeTax_IncomeTaxEmployersInfo_employers-info-300326-1.pdf) | תוקן רישום המס: שירות העוסק הפטור פותח גם תיק מס הכנסה. הוסרו זמני טיפול לא מבוססים. מס אישי תלוי בזיכויים ובהכנסות נוספות. |
| `/self-employed/social-security` | 7.7%/18% ותקרת בסיס החיוב | [הביטוח הלאומי — שיעורי עצמאי](https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/rates.aspx), [אופן חישוב](https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/hishov.dmey.bituach.aspx) | השיעורים תואמים ל־2026 עבור המעמד המתואר; אינם מאפשרים חישוב אישי ישיר מתוך רווח חודשי. |
| `/self-employed/tax-advances` | תשלום ותיקון מקדמות מס ודמי ביטוח | [מקדמות מס הכנסה](https://www.gov.il/he/service/itc-payment-online-incometax), [תיקון מקדמות בביטוח הלאומי](https://www.btl.gov.il/Insurance/National%20Insurance/type_list/Self_Employed/Pages/tikun.aspx) | המדריך מפריד בין הרשויות; אין סימולציה אחידה של חיוב אישי. |
| `/self-employed/vat-threshold` | תקרת 122,833 ₪ בשנת 2026 | [רשות המסים — פתיחת עוסק פטור](https://www.gov.il/he/service/request-open-exempt-dealer-via-internet) | תואם מקור רשמי; יש לבדוק גם סוג עיסוק ויתר תנאי הרישום. |
| `/self-employed/vat` | 18% הוספה/חילוץ | [רשות המסים — שיעור מע״מ](https://www.gov.il/he/pages/vat-history) | האריתמטיקה נבדקה אוטומטית. הכלי אינו קובע אם עסקה מסוימת חייבת במע״מ רגיל. |
| `/self-employed/year-end-tax-simulator` | מסמכים לבדיקת חבות בסוף שנה | [רשות המסים — דוחות שנתיים](https://www.gov.il/he/departments/topics/annual-reports-1301) | מדריך איסוף נתונים, ללא חישוב חבות אישי ללא שומה ומצב מס מלא. |

## מנועים ישנים ובדיקות

בדיקת imports בכל מאגר הקוד הראתה ש־13 המנועים הישנים `allowed-expenses`, `bituach-leumi-self-employed`, `corporation-vs-individual`, `dividend-vs-salary`, `employer-cost`, `hourly-rate`, `self-employed-net`, `self-employed-pension`, `tax-advances`, `vat`, `vat-threshold`, `year-end-tax-simulator` ו־`combined-income` לא נטענו בנתיב ציבורי. הם הוסרו יחד עם 13 רכיבי התצוגה הישנים ועם בדיקות שהניחו את דיוקם. הבדיקות המשותפות עבור עסקים ותנועה נערכו רק בבלוקים שתלויים במנועים שהוסרו.

נשארו פעילים `vat-basic` עבור חיבור וחילוץ מע״מ בשיעור הרגיל, `VatBasicCalculator`, בדיקות מע״מ בסיסיות, וכן `vat-extract` ו־`pension` המשמשים נתיבים ציבוריים אחרים.

## מגבלות

- לא נבדקה התאמה אישית של מס, ביטוח לאומי, פנסיה או עלות העסקה, כי הדפים אינם אוספים את כל הנתונים הנדרשים.
- שירותים מקוונים של הרשויות יכולים לשנות טקסט, מועדים וכתובות. יש לבצע בדיקת קישורים חיצוניים חוזרת לפני פרסום ועדכון תכוף של ספי 2026.
- טיפים לניהול תזרים ותמחור הם שיטות עבודה; אין להם תוקף רגולטורי או נתון תשואה מובטח.
