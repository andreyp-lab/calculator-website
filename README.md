# חשבונאי — מחשבונים, מדריכים וקורסים פיננסיים

אתר עברי ב־RTL לשכירים, עצמאים ובעלי עסקים, עם כלים ומדריכים פיננסיים וקטלוג קורסים של FinSchool. אתר הייצור: [cheshbonai.co.il](https://cheshbonai.co.il).

**[האיפיון המלא ומצב הביצוע, נכון ל־1.10.2026](docs/CHESHBONAI-SYSTEM-SPEC-2026-10-01.md)** — מפת האתר, ארכיטקטורה, מסלולי רכישה, SEO, מדידה, אימות נתונים, בדיקות, פריסה ועבודה פתוחה. המקורות המפורטים לכל סבב אימות נמצאים ב־[`docs/`](docs/).

## עבודה מקומית

```bash
npm install
npm run dev
npm run test
npm run lint
npm run build
```

הקוד מבוסס על Next.js App Router, React ו־TypeScript. דפי המכירה `/course/self-employed` ו־`/course/business` הם קובצי HTML ב־`public/lp/` הנגישים בכתובות אלה דרך rewrite ב־`next.config.ts`. הקישורים לרכישה מובילים ל־Schooler; ייצור נפרס מ־`main` ב־GitHub דרך Vercel.
