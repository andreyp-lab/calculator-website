# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> **Read `AGENTS.md` first** (imported above): this is Next.js 16 + Turbopack with breaking changes from older Next. Consult `node_modules/next/dist/docs/` before writing App Router code.

## Commands

```bash
npm run dev            # dev server (Turbopack)
npm run build          # production build — ALSO the most reliable full typecheck + route/metadata validation; run before every commit
npm run start          # serve the production build (needed to test next.config rewrites, e.g. /course/self-employed)
npm run lint           # eslint (Next 16 removed `next lint` — call eslint via this script, not `next lint`)
npx tsc --noEmit       # typecheck only
npm test               # vitest run — full unit suite (1600+ tests in tests/unit/)
npm run test:watch     # vitest watch
npx vitest run tests/unit/<name>.test.ts   # single test file
npx vitest run -t "<test name substring>"  # single test by name
```

Standard verification gate before committing: `npx tsc --noEmit && npm test && npm run build`.

## What this is

Hebrew, RTL financial-calculator site (cheshbonai.co.il) — its purpose is to pull organic search traffic and funnel it to the FinSchool courses. It is a **YMYL** site: every displayed number carries legal/financial weight.

## Architecture (the big picture)

**Calculators are a strict three-layer stack — respect the boundaries:**
1. **`lib/constants/tax-2026.ts`** is the single source of truth for every tax bracket, rate, threshold, and credit point; **`lib/data/macroeconomic-data.ts`** holds macro data (prime rate, CPI, average wage). **Never hardcode or invent a financial number in a component or content** — import it from these files. 22+ calc engines already consume `tax-2026.ts`.
2. **`lib/calculators/*.ts`** — pure, React-free calculation engines (~46 files). Each has a matching **`tests/unit/*.test.ts`**. Reuse an engine; do not reimplement tax logic inside a widget (e.g. the salary-deductions widget calls `calculateSalaryNetGross`).
3. **`components/calculators/*.tsx`** — the `'use client'` interactive widgets that call the engines and render results (cards, recharts graphs).

**Calculator page composition:** `app/<category>/<slug>/page.tsx` is a server component (metadata + JSON-LD) that renders **`components/calculator/CalculatorLayout.tsx`**, passing named slots: `quickAnswer` (an answer-box paragraph, `.answer-box`, for featured snippets / AI citation), `calculator` (the widget), `content`, `faq` (the `FAQ` component auto-injects FAQPage schema), `sources`, `embed`. The layout also renders `RelatedCalculators`, `CourseCTA` (only on `/self-employed/*`), and `AuthorBox`.

**Content sources of truth (edit these, not scattered files):**
- Blog: `content/blog/registry.ts` (post metadata, `updatedDate` optional) + `app/blog/(post)/<slug>/page.mdx` (body). `BlogArticleSchema` injects one `BlogPosting` per post.
- Glossary: `lib/data/glossary.ts` (per-term pages at `/glossary/[slug]`).
- Navigation: `lib/config/navigation.ts`.

**SEO infrastructure is centralized — extend it, don't duplicate:** `app/sitemap.ts`, `app/robots.ts`, `public/llms.txt` + `public/llms-full.txt`, and `components/seo/*` (Breadcrumb/Calculator/FAQ/HowTo/Course/Person schemas).

**Two rules that will silently break SEO if ignored:**
- **Canonical:** the root `app/layout.tsx` deliberately does **not** set `alternates.canonical` (setting it there cascades to every page, making Google see "homepage" everywhere and deindex sub-pages). **Every page must declare its own canonical.**
- **Client pages can't export `metadata`.** A `'use client'` page needs its metadata (incl. canonical) in a sibling `layout.tsx` (see `app/tools/*/layout.tsx`, `app/contact/`).

**Course sales pages** are integrated 1:1 as standalone static HTML in `public/lp/*.html`, served at clean URLs via **`next.config.ts` rewrites** (`/course/self-employed` → `/lp/cpa.html`, `/course/business` → `/lp/cfo.html`). Inside them, only checkout links go external (to `*.profitmargin.co.il`); all nav/footer links point back inside the site.

**Design system** lives in `app/globals.css` `@theme` (Tailwind v4 — there is **no `tailwind.config`**): palette `cream / paper / ink / ink-deep / ink-mid / gold / gold-light`, sharp corners (radius 0), serif headings (Frank Ruhl Libre), mono eyebrows (JetBrains Mono, uppercase tracked), ✦ gold separators. Fonts are wired via `next/font` in `layout.tsx`. Preserve semantic colors in results/graphs: **red = cost/tax, green = positive/savings, amber = warning**. `gold` is `#7A5718` (WCAG AA on cream) — don't lighten it.

**Live data:** USD/ILS is fetched from the Bank of Israel API with ISR (6h) in `components/layout/Ticker.tsx`; tax/legal constants are **manually maintained and must never be auto-fetched** (YMYL law doesn't live-update safely).

---

# עקרונות מוצר - FinCalc

## העיקרון העליון: איכות מעל הכל

> **"אני מאמין בלעשות דברים בצורה מאוד טובה, כך שמשתמש יחזור בעתיד להשתמש במוצר שלי."**
> — בעל המוצר, 14.5.2026

**אסור** לבנות מחשבונים בסיסיים / שטחיים. כל מחשבון חייב להיות:

### ✅ מקיף
- כל הפרמטרים שמשתמש מקצועי היה רוצה לראות
- לא רק "התשובה" - גם הפירוט שמסביר מאיפה היא הגיעה
- מספר תרחישים (לא רק אופציה אחת)

### ✅ ריאליסטי
- מחירים אמיתיים, אחוזים מעודכנים, מציאות ישראלית
- עלויות נסתרות שמשתמש מתחיל לא חושב עליהן
- **Opportunity cost** (עלות הזדמנות) - מה היה קורה אם הכסף היה מושקע במקום אחר

### ✅ חינוכי
- מסביר ל-משתמש למה התוצאה כזו
- מאמרים קשורים ב-FAQ
- טיפים אופטימיזציה

### ✅ ויזואלי
- כרטיסי תוצאה ברורים
- גרפים שמראים את החלוקה
- השוואה מעודנת בין אופציות

---

## דוגמה: מחשבון "ליסינג vs קנייה" (15.5.2026)

### מה היה (בסיסי):
- רק 2 אופציות: ליסינג / קנייה עם הלוואה
- דלק כסכום חודשי כללי
- בלי opportunity cost
- בלי צמיגים / טיפולים מפורטים

### מה חסר:
1. **אופציה שלישית**: מימון עצמי (מזומן) + חישוב **עלות הזדמנות**
2. **דלק מפורט**: סוג דלק, צריכה, ק"מ
3. **תחזוקה מפורטת**: טיפולים, צמיגים, ביטוח חובה+מקיף, רישוי, טסט
4. **התפתחות שנתית**: עלות מצטברת + ערך השקעה אלטרנטיבית

### מה צריך לבנות:
- 3-way comparison (מזומן / הלוואה / ליסינג)
- חישוב TCO (Total Cost of Ownership) מלא
- גרפים: pie chart של רכיבי עלות + line chart לאורך השנים
- המלצה חכמה לפי תרחיש ההשקעות

---

## צ'ק-ליסט לכל מחשבון חדש

לפני שמסיימים מחשבון, לוודא:

- [ ] **לא חסר פרמטר** משמעותי שמשתמש מקצועי היה מכניס?
- [ ] **Opportunity cost** מחושב נכון (אם רלוונטי)?
- [ ] **השוואה למספר אופציות** (לא רק חישוב יחיד)?
- [ ] **גרפים ויזואליים** (pie / bar / line)?
- [ ] **המלצה / טיפים** חכמים בהתאם לתוצאה?
- [ ] **8-10 שאלות נפוצות** עם תשובות מפורטות?
- [ ] **בדיקות יחידה** למקרי קצה?
- [ ] **שילוב בבלוג** - מאמר שמקשר חזרה?

---

## אנטי-תבניות שאסור לעשות

❌ "כמה ההלוואה החודשית?" — בלי לחשב סך עלות, ריבית כוללת, ALL-IN cost.
❌ "כמה עולה אופציה X?" — בלי להשוות לאופציות Y, Z.
❌ "ערך עתידי?" — בלי לקחת בחשבון אינפלציה, מס רווחי הון.
❌ ערכים גנריים — צריך מקור (רשות המסים / ב.ל. / מחירוני שוק).
