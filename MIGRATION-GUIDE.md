# 🚀 מדריך מעבר Vercel - cheshbonai.co.il

מסמך זה מכיל את כל ההגדרות וההוראות למעבר האתר לחשבון Vercel חדש.

---

## 📋 פרטי הפרויקט הנוכחי

| | |
|---|---|
| **Domain** | `cheshbonai.co.il` |
| **GitHub Repo** | `andreyp-lab/calculator-website` |
| **Framework** | Next.js 15 (App Router + Turbopack) |
| **Package Manager** | npm |
| **Node Version** | 20+ |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` (ברירת מחדל של Next.js) |
| **Install Command** | `npm install` |
| **Dev Command** | `npm run dev` |

### חשבון Vercel נוכחי
- **Team**: `apllb1-3492s-projects`
- **Team ID**: `team_vIwQbwwTimRKg6VguhG0Ue4f`
- **Project ID**: `prj_6CPaUHMRj1DXerOMlxUzq6Pf6VId`
- **Project Name**: `cheshbonai`

---

## 🎯 שלבי המעבר (לפי הסדר)

### שלב 1: יצירת פרויקט בחשבון Vercel החדש

#### אופציה A: דרך GitHub Integration (מומלץ)
1. Login ל-Vercel החדש: https://vercel.com
2. **Add New** → **Project**
3. **Import Git Repository** → בחר `calculator-website`
4. אם GitHub לא מחובר: **Adjust GitHub App Permissions** → אשר את הריפו
5. **Configure Project**:
   - Framework Preset: **Next.js** (אוטומטי)
   - Root Directory: `./`  (ברירת מחדל)
   - Build Command: `npm run build` (ברירת מחדל)
   - Output: `.next` (ברירת מחדל)
   - Install: `npm install` (ברירת מחדל)
6. **Deploy**

#### אופציה B: דרך CLI
```bash
cd /Users/ilankaplatonov/calculator-website

# מחק קישור ישן
rm -rf .vercel

# Login לחשבון החדש
vercel logout
vercel login

# קשר לפרויקט חדש
vercel link

# פרוס לפרודקשן
vercel --prod
```

---

### שלב 2: העברת הדומיין `cheshbonai.co.il`

#### בחשבון הישן (חשוב!):
1. כנס ל-https://vercel.com/apllb1-3492s-projects/cheshbonai
2. **Settings** → **Domains**
3. ליד `cheshbonai.co.il` → **⋮** → **Remove**
4. אשר הסרה

⚠️ **חלון זמן ריק**: יהיו ~5 דקות שהאתר לא יהיה זמין דרך הדומיין (יעבוד דרך `*.vercel.app`)

#### בחשבון החדש:
1. כנס לפרויקט החדש שיצרת
2. **Settings** → **Domains**
3. **Add Domain** → `cheshbonai.co.il`
4. Vercel יזהה אם DNS כבר מצביע נכון
5. אם DNS כבר היה מוגדר (זה המצב שלך) - **תוך 1-5 דקות** האתר יעלה בדומיין החדש
6. הוסף גם `www.cheshbonai.co.il` (אופציונלי - redirect לdomain ראשי)

#### DNS (אם כן צריך לעדכן)
ה-DNS אצל רושם הדומיין צריך להצביע ל-Vercel:

**אופציה 1 (נמצא בשימוש כעת)**: A Record
```
Type:  A
Name:  @ (or empty)
Value: 76.76.21.21
TTL:   3600
```

**אופציה 2**: CNAME (לא לדומיין שורש)
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
```

⚠️ ה-DNS שלך **כבר מוגדר נכון** - אם תעביר באותו אופן, אין צורך לשנות.

---

### שלב 3: Environment Variables

**ה-cheshbonai.co.il כרגע משתמש ב-0 environment variables** ✅ (פשוט!)

אם בעתיד תוסיף ENV vars (כמו DATABASE_URL, API_KEYS):
1. **Settings** → **Environment Variables**
2. Production / Preview / Development
3. Add בנפרד לכל סביבה

---

### שלב 4: הגדרות שחשובות לוודא בחשבון החדש

#### Settings → General
- **Framework Preset**: Next.js
- **Node.js Version**: 20.x (או 22.x)
- **Production Branch**: `main`

#### Settings → Functions
- Region: ברירת מחדל (Washington, D.C. - iad1) או בחר אזור קרוב (לישראל - Frankfurt fra1 או London lhr1)
- Memory: 1024 MB (ברירת מחדל)

#### Settings → Build & Development Settings
- Build Command: `npm run build`
- Output: ברירת מחדל
- Install: `npm install`

#### Settings → Git
- **Production Branch**: `main`
- **Auto-deploy**: מופעל ✅
- **Preview Deploys**: מופעל לכל branch
- **Comments on PRs**: מומלץ ✅

#### Settings → Analytics
- **Web Analytics**: הפעל (חינם בתוכנית Hobby)
- **Speed Insights**: הפעל (חינם)

---

### שלב 5: SSL Certificate

Vercel מנפיק אוטומטית **Let's Encrypt SSL** ברגע שהדומיין מוגדר:
- ⏱️ זמן: 1-5 דקות
- ✅ אוטומטי - שום פעולה ידנית
- 🔄 חידוש אוטומטי לפני פקיעה

---

## 🔑 קודי אימות וקבצי קונפיגורציה

### Google Search Console
**הקוד שלך**: `Ec8f1CxhD0ZFZbsl7RWpCNIxYDWOtV5D7RpasmxX1uA`

מיקום בקוד: `lib/config/search-console.ts`

⚠️ **חשוב**: אחרי המעבר, אם הדומיין נשאר זהה (`cheshbonai.co.il`) - **האימות נשמר**. אם תשנה דומיין - תצטרך לאמת מחדש ב-GSC.

### Bing Webmaster
טרם הוגדר - הקוד ריק ב-`lib/config/search-console.ts`.

### Vercel Analytics
מותקן כ-`@vercel/analytics` ב-`package.json`. יופעל אוטומטית בפרויקט החדש ברגע שיהיו visitors.

---

## 📊 מצב התוכן הנוכחי

| | כמות |
|---|---|
| **מחשבונים פיננסיים** | 30 |
| **פוסטי בלוג** | 44 |
| **Pillar Guides** | 3 |
| **Glossary terms** | 82 |
| **News pages** | 5 |
| **Legal pages** | 3 |
| **Unit tests** | 1,593 |
| **Total static pages** | 132 |

---

## 🛡️ פרטי בעל האתר (ב-Privacy/Terms/Accessibility)

מאוחסן ב-`lib/config/site-info.ts`:
- **שם**: אנדרי פלטונוב
- **כתובת**: נס ציונה
- **אימייל**: andrey.platonov28@gmail.com

---

## 📁 קבצי הגדרות חשובים בפרויקט

| קובץ | מה יש בו |
|------|----------|
| `package.json` | dependencies + scripts |
| `next.config.ts` | Next.js config |
| `tsconfig.json` | TypeScript |
| `tailwind.config.ts` | Tailwind CSS |
| `vitest.config.ts` | Testing |
| `lib/config/site-info.ts` | פרטי בעלים |
| `lib/config/search-console.ts` | GSC/Bing codes |
| `lib/config/navigation.ts` | תפריטים ראשיים |
| `content/blog/registry.ts` | רישום 44 פוסטים |
| `lib/data/macroeconomic-data.ts` | נתוני מקרו (פריים, אינפלציה) |
| `app/sitemap.ts` | sitemap.xml דינמי |
| `app/robots.ts` | robots.txt (כולל כללי AI bots) |
| `app/manifest.ts` | PWA manifest |
| `public/llms.txt` | מבנה אתר לבוטי AI |

---

## ✅ Checklist - מעבר מוצלח

לאחר המעבר, ודא:

- [ ] האתר נטען ב-`https://cheshbonai.co.il`
- [ ] SSL פעיל (🔒 בדפדפן)
- [ ] עמוד הבית מציג נתונים נכונים
- [ ] עמוד `/news/prime-rate` עובד (בודק ISR)
- [ ] עמוד `/real-estate/mortgage-optimizer` עובד (בודק client components)
- [ ] תפריט נגישות (♿) מופיע ופעיל
- [ ] Footer מציג את כל הקישורים המשפטיים
- [ ] `https://cheshbonai.co.il/robots.txt` מחזיר תוכן
- [ ] `https://cheshbonai.co.il/sitemap.xml` מחזיר 132 entries
- [ ] `https://cheshbonai.co.il/llms.txt` מחזיר תוכן
- [ ] `https://cheshbonai.co.il/manifest.webmanifest` מחזיר JSON
- [ ] Google Search Console verification עדיין פעיל
- [ ] Auto-deploy מ-GitHub עובד (תעשה commit קטן לבדיקה)

---

## 🚨 דברים שיכולים להשתבש (Troubleshooting)

### בעיה: "Domain in use by another project"
**פתרון**: לא הסרת את הדומיין מהחשבון הישן. חזור לחשבון הישן → Settings → Domains → Remove.

### בעיה: Build נכשל בחשבון החדש
**פתרון**: בדוק שהגדרת `Node.js Version: 20.x`. ייתכן שהחשבון החדש משתמש ב-Node 18 ישן.

### בעיה: SSL לא מתחדש
**פתרון**: זה אוטומטי, אם לא קורה תוך 10 דקות → Settings → Domains → Refresh.

### בעיה: 404 בכל הדפים
**פתרון**: ככל הנראה הfunction lambda נכשל. בדוק Logs בעמוד הראשי של ה-deploy.

### בעיה: Analytics לא רואה traffic
**פתרון**: צריך **כמה שעות** עד שהראשונים יתחילו להופיע. אם אחרי 24 שעות עדיין אין - בדוק ב-Settings → Analytics שמופעל.

---

## 📞 תמיכה

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **GitHub Repo**: https://github.com/andreyp-lab/calculator-website
- **Vercel Support**: support@vercel.com (תוכנית Pro) / Discord (תוכנית Hobby)

---

## 🎯 פעולות שכדאי לעשות אחרי המעבר

1. **Vercel Analytics** - הפעל ב-Settings (חינם)
2. **Speed Insights** - הפעל (חינם)
3. **Deployment Protection** - שקול להגביל preview deployments (אם רוצה פרטיות)
4. **Custom 404** - כבר קיים ב-`app/not-found.tsx`
5. **Domain redirects** - הוסף `www.cheshbonai.co.il` → `cheshbonai.co.il` (אופציונלי)
6. **GitHub Webhook** - וודא שהוא פעיל (אוטומטי לרוב)

---

**Document version**: 1.0
**Last updated**: 2026-05-21
**Author**: Created with Claude (Opus)
