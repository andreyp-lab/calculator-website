# אימות סימולטור החזר מס לשכירים — 2.10.2026

## היקף החישוב

הסימולטור מחשב אומדן להפרש מס הכנסה שנתי במקרים פשוטים של שכירים בלבד:

1. מחבר הכנסה חייבת ומס הכנסה שנוכה מכל טופסי 106 והאישורים השנתיים שהמשתמש הזין.
2. מפחית ניכויים שנתיים רק אם המשתמש הזין סכום שכבר חושב או אומת.
3. מחשב מס שנתי על הכנסה מיגיעה אישית לפי מדרגות השנה שנבחרה.
4. מוסיף מס יסף של 3% מעל הסף השנתי של אותה שנה.
5. מפחית שווי נקודות זיכוי וזיכויי מס נוספים שהוזנו כסכום בשקלים.
6. משווה את חבות המס למס שנוכה בפועל. תוצאה שלילית מוצגת כיתרת מס אפשרית לתשלום ולא נמחקת.

החישוב אינו כולל ביטוח לאומי, ריבית והצמדה, הכנסה מעסק, הון, שכירות או חו״ל, פריסת פיצויים, אירוע פרישה, תושבות חלקית או חובת דיווח מורכבת של בני זוג.

## קבועים שנתיים

| שנה | גבולות שנתיים למדרגות 10%, 14%, 20%, 31%, 35% | מעליהם 47% | נקודת זיכוי שנתית | סף מס יסף 3% | מועד הגשה לפי כלל שש השנים |
|---|---|---:|---:|---:|---:|
| 2020 | 75,960; 108,960; 174,960; 243,120; 505,920 | כן | 2,628 | 651,600 | 31.12.2026 |
| 2021 | 75,480; 108,360; 173,880; 241,680; 502,920 | כן | 2,616 | 647,640 | 31.12.2027 |
| 2022 | 77,400; 110,880; 178,080; 247,440; 514,920 | כן | 2,676 | 663,240 | 31.12.2028 |
| 2023 | 81,480; 116,760; 187,440; 260,520; 542,160 | כן | 2,820 | 698,280 | 31.12.2029 |
| 2024 | 84,120; 120,720; 193,800; 269,280; 560,280 | כן | 2,904 | 721,560 | 31.12.2030 |
| 2025 | כמו 2024 עקב הקפאת הסכומים | כן | 2,904 | 721,560 | 31.12.2031 |

## מקורות ראשוניים

- [רשות המסים — לוחות עזר לחישוב מס ממשכורת לכל שנה](https://www.gov.il/he/pages/pa110123-1)
- [לוח עזר שנתי 2020](https://www.gov.il/BlobFolder/generalpage/income-tax-annual-deductions-booklet/ar/itc_auxiliary-board-for-calculation-Income-tax-2020.pdf)
- [לוח עזר שנתי 2021](https://www.gov.il/BlobFolder/generalpage/income-tax-annual-deductions-booklet/he/generalInformation_income-tax-yearly-deductions-booklet_yearly-deductions-booklet-2021.pdf)
- [לוח עזר חודשי 2022](https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2022.pdf)
- [לוח עזר שנתי 2023](https://www.gov.il/BlobFolder/generalpage/income-tax-annual-deductions-booklet/he/generalInformation_income-tax-yearly-deductions-booklet_yearly-deductions-booklet-2023.pdf)
- [לוח עזר שנתי 2024](https://www.gov.il/BlobFolder/generalpage/income-tax-annual-deductions-booklet/he/generalInformation_income-tax-yearly-deductions-booklet_yearly-deductions-booklet-2024.pdf)
- [לוח עזר חודשי 2025](https://www.gov.il/BlobFolder/generalpage/income-tax-monthly-deductions-booklet/he/generalInformation_income-tax-monthly-deductions-booklet_monthly-deductions-booklet-2025.pdf)
- [רשות המסים — בקשה להחזר מס וטופס 135](https://www.gov.il/he/service/itc135)
- [רשות המסים — טופס 106](https://www.gov.il/he/service/itc-106)
- [רשות המסים — סימולטור נקודות זיכוי](https://www.gov.il/he/service/tax-credit)
- [רשות המסים — הדמיית מס על שכר](https://www.gov.il/he/service/income-tax-calculator)

## בקרות מניעת הטעיה

- אין תוצאה לפני אישור שכל טופסי 106 ואישורי ההכנסה הוזנו.
- אין תוצאה לפני אישור שהמקרה אינו כולל הכנסות או אירועי מס שהמנוע אינו תומך בהם.
- נקודות זיכוי אינן נגזרות ממצב משפחתי; המשתמש מזין מספר שכבר בדק.
- תרומות והפקדות אינן מחושבות אוטומטית. שדות מתקדמים מקבלים רק סכום ניכוי או זיכוי שכבר חושב.
- זיכויים שלא נוצלו אינם הופכים להחזר מזומן; ההחזר לעולם אינו גבוה מהמס שנוכה.
- מס שנוכה בחסר מוצג כיתרת מס אפשרית לתשלום.
- אירוע האנליטיקה אינו כולל הכנסה, מס שנוכה, נקודות זיכוי או כל סכום אישי.
