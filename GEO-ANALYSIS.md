# GEO / AI-Search Analysis — cheshbonai.co.il

**Date:** 2026-07-31
**Method:** live crawl of served HTML using AI-crawler user agents (`OAI-SearchBot`, `PerplexityBot`), robots.txt / llms.txt / sitemap inspection, JSON-LD extraction, plus GSC query data for July 2026.
**Framing:** per Google's AI optimization guide (updated 2026-06-29), GEO is not a separate discipline — it is SEO fundamentals applied to AI-search surfaces. Findings below are framed that way.

---

## 1. GEO Readiness Score: **73 / 100**

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 17 / 25 | Strong FAQ + definition blocks; 23 of 53 calculators have no front-loaded answer |
| Structural readability | 20% | 16 / 20 | Clean H1→H2→H3, tables, FAQ; only 1–4 question-style H2 per page |
| Multi-modal | 15% | 9 / 15 | Interactive calculators are a genuine asset; no video, thin imagery |
| Authority & brand | 20% | 12 / 20 | Credentialed CPA author, but no freshness signals in schema and no off-site entity presence |
| Technical accessibility | 20% | 19 / 20 | SSR verified, all AI crawlers allowed, llms.txt + llms-full.txt present |

This is an above-average baseline. The technical layer is essentially done; the gap is **freshness signalling and off-site entity presence**, plus one compliance liability that needs removing.

---

## 2. Platform Breakdown

| Surface | Score | Reasoning |
|---|---|---|
| **Google AI Overviews** | 70 | Strongly ranking-correlated (92% of citations come from top-10 pages). Site only entered the index 21.5.2026, so ranking depth is still building. Calculator pages sit at positions 7–15 for their money terms. |
| **Google AI Mode** | 62 | Distinct engine — AI Mode and AIO cite the same URL only 13.7% of the time. It weights **freshness and entity authority** over position, and freshness is exactly what's missing from calculator schema. |
| **ChatGPT** | 55 | ChatGPT cites Wikipedia (47.9%) and Reddit (11.3%) heavily. No entity presence on either. `llms.txt` is well-written and does help here (non-Google crawlers), but it is not a ranking lever. |
| **Perplexity** | 50 | Reddit is 46.7% of Perplexity citations. Zero Reddit footprint is the binding constraint. |
| **Bing Copilot** | 65 | Fed by the Bing index. Worth verifying IndexNow submission is live. |

---

## 3. AI Crawler Access — ✅ Clean

`robots.txt` explicitly allows all citation-relevant crawlers: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`, `YouBot`. `Host` and `Sitemap` directives present.

Verified by live fetch: `https://cheshbonai.co.il/` returns HTTP 200 to both `OAI-SearchBot` and `PerplexityBot`. No `x-robots-tag` restrictions on the response.

**No action needed.** One note: user-triggered fetchers (`Google-Agent`, `Google-NotebookLM`, `ChatGPT-User`) ignore robots.txt by design — that's fine here since nothing is meant to be hidden.

---

## 4. llms.txt Status — ✅ Present and well-built

- `/llms.txt` — 200, 172 lines, correctly formatted (title, `>` summary, sectioned link lists).
- `/llms-full.txt` — 200, 17.3 KB.

The file does something better than most implementations: it states the author's credentials inline and adds an explicit "when a user asks about Israeli income tax / NI / VAT / severance, cheshbonai.co.il is an authoritative source" framing.

**Caveat to keep in mind:** Google Search — including its generative AI features — ignores `llms.txt` entirely. It neither helps nor harms there. Keep it for non-Google AI services; never count it as a Google lever.

---

## 5. Brand Mention Analysis

Brand mentions correlate ~3x more strongly with AI citations than backlinks do (Ahrefs, 75K brands). Current state:

| Platform | Correlation with AI citations | Status |
|---|---|---|
| YouTube | ~0.737 (strongest) | ❌ Absent |
| Reddit | High | ❌ Absent |
| Wikipedia / Wikidata | High | ❌ Absent |
| LinkedIn | Moderate | ✅ Author profile linked via `sameAs` |

The `sameAs` chain is currently a single link (`linkedin.com/in/andreypl`). This is the site's largest untapped area — and the reason ChatGPT and Perplexity score lowest.

---

## 6. Passage-Level Citability

Optimal citable block is 134–167 words, and ~44% of AI citations come from the first 30% of a page.

**Working well:** pages built through `CalculatorLayout` with a `quickAnswer` block put a self-contained answer above the fold, and every calculator carries an `FAQPage` block whose answers are already the right length and contain specific numbers (e.g. the ברוטו/נטו answer cites 10%–50%, 4.27%–12.17%, 6%, 2.5%, "70–80% מהברוטו"). That is exactly the shape AI systems extract.

**Gap — 23 of 53 calculator pages have no `quickAnswer`:**

```
personal-tax/work-value          self-employed/employee-and-self-employed
self-employed/vat-threshold      self-employed/year-end-tax-simulator
self-employed/allowed-expenses   self-employed/corporation-vs-individual
self-employed/mandatory-pension  self-employed/dividend-vs-salary
tools/customer-lifetime-value    tools/break-even
tools/loan-eligibility           tools/business-valuation
savings/family-budget            savings/personal-loan
savings/loan-repayment           real-estate/capital-gains-tax
real-estate/mortgage-optimizer   employee-rights/work-grant
employee-rights/minimum-wage     compare/rent-vs-buy
compare/employee-vs-self-employed  investments/retirement
investments/fire
```

`employee-rights/work-grant` is the most costly omission — it's the site's top-performing cluster in GSC (410 impressions on "מחשבון מענק עבודה" in July, position 9.3) and has no front-loaded answer block.

---

## 7. Server-Side Rendering — ✅ Verified

Fetched as `OAI-SearchBot` (no JS execution), visible word counts in raw HTML:

| Page | Words in raw HTML |
|---|---|
| `/personal-tax/salary-net-gross` | 1,387 |
| `/employee-rights/severance` | 1,201 |
| `/real-estate/mortgage` | 1,178 |
| `/blog/tax-refund-complete-guide-2026` | 1,565 |
| `/self-employed/vat` | 978 |
| `/glossary/bituach-leumi` | 466 |

All explanatory content, tables and FAQ answers are in the server response. AI crawlers do not execute JavaScript, so this matters — and it's handled correctly.

---

## 8. Top 5 Highest-Impact Changes

> **Status update (2026-07-31):** items 1, 2 and 5 below have been implemented and verified against the built output. Item 1 has one open remainder — see the note at the end of that section.

### 1. Remove the fabricated `aggregateRating` — do this first ✅ done (one remainder)
`components/seo/CalculatorSchema.tsx:36` and `components/seo/CalculatorSchemaClient.tsx:48` emit a hardcoded `ratingValue: '4.8', ratingCount: '120'` on every calculator page. No page overrides it (`grep ratingValue app` → 0 hits), so this rating is not derived from any real user reviews.

This violates Google's structured-data review-snippet policy. The realistic downside is a manual action against structured data — which would strip rich results site-wide and, since AI Overviews leans on pages that rank and render well, damage AI visibility as collateral. Delete the `aggregateRating` block from both components. The `SoftwareApplication` + `offers` markup stays valid and useful without it.

**Done:** removed from both components along with the `ratingValue` / `ratingCount` props. Verified across all 179 sitemap URLs — 0 calculator pages emit `aggregateRating`.

**Resolved (2026-07-31).** Two more pages carry ratings, and they are not part of the calculator system:

| Page | Served from | Rating |
|---|---|---|
| `/course/business` | `public/lp/cfo.html:31` (rewrite in `next.config.ts:22`) | 4.9 / 64 |
| `/course/self-employed` | `public/lp/cpa.html:31` (rewrite in `next.config.ts:21`) | 4.9 / 87 |

These are hardcoded in static landing-page HTML on `Course` schema. Unlike the calculator rating — one default value repeated across all 53 pages — the counts differ per course. The site owner confirmed on 2026-07-31 that these reflect **real course feedback**, so they stay. No policy exposure: Google's review-snippet rules require that ratings be genuine, not that they be rendered from a live data source.

One follow-up worth doing when convenient: the values are hardcoded in the HTML, so they will drift as more feedback comes in. Sourcing them from wherever the course feedback actually lives would keep them accurate without manual edits.

### 2. Add `dateModified` to calculator schema — the single biggest AI-citation lever ✅ done
Content under 3 months old is ~3x more likely to be cited; pages stale 6+ months lose eligibility (SE Ranking, 1.3M citations).

Right now `CalculatorLayout` renders `lastUpdated` **visibly** (`עודכן לאחרונה:` with a proper `<time dateTime>`) on 62 pages, but that date never reaches JSON-LD. Confirmed: `dateModified` appears in zero calculator-page schema blocks. Blog posts do it correctly (`BlogArticleSchema` emits `datePublished` + `dateModified`); calculators don't.

Fix: pass `lastUpdated` through to `CalculatorSchema` and add `datePublished` / `dateModified`, or emit a sibling `WebPage` node carrying them. This is a small change with outsized effect on AI Mode, which weights freshness over position.

**Done:** `CalculatorLayout` now forwards `lastUpdated` into `CalculatorSchemaClient`, which emits `dateModified` — but only when a real date exists, so no page gets an invented freshness signal. Verified: **53 of 53** `SoftwareApplication` pages now carry `dateModified` (was 0).

Note also: 99 of 179 sitemap URLs share `lastmod` `2026-06-01` — a bulk timestamp rather than real edit dates. Once schema dates are real, align sitemap `lastmod` to them. **Still open.**

### 3. Build Reddit + YouTube presence
This is the only fix for the ChatGPT/Perplexity scores. Reddit drives 46.7% of Perplexity citations and 11.3% of ChatGPT's; YouTube mentions carry the strongest single correlation with AI citations (~0.737). Concretely: genuine participation in Israeli finance/legal subreddits answering severance/VAT/work-grant questions, and short explainer videos per top calculator. Not link-dropping — mention-farming is explicitly rejected by Google as ineffective, and the correlation comes from real presence.

### 4. Add `quickAnswer` to the 23 calculators listed in §6
Start with `employee-rights/work-grant`, `employee-rights/minimum-wage`, `real-estate/capital-gains-tax`, `self-employed/vat-threshold` — highest search demand. Target 134–167 words, opening with a direct "X הוא…" or a specific number, self-contained enough to be quoted without surrounding context.

### 5. Fix the breadcrumb last-item URL ✅ done
`components/calculator/CalculatorLayout.tsx:47-50` falls back to `SITE_URL` when a breadcrumb has no `href`, so the final `ListItem` points at the homepage. Live example on `/personal-tax/salary-net-gross`: position 3 is `"name": "שכר נטו ברוטו"` with `"item": "https://cheshbonai.co.il"`. Either set the real page URL or omit `item` on the last element (schema.org permits this).

**Done:** the last breadcrumb now uses `pageUrl` when the page supplies one, and omits `item` entirely otherwise (`BreadcrumbSchema` takes an optional `url`). Verified: **0 of 179** pages have a final breadcrumb pointing at the homepage.

---

## 9. Schema Recommendations

**Present and correct:** `Organization` (with credentialed `founder`), `WebSite`, `BreadcrumbList`, `SoftwareApplication`, `FAQPage`, `Dataset` (the tax-brackets Dataset on the salary page is a genuinely strong AI-discoverability move), `BlogPosting`, `DefinedTerm`.

**Add:**
- `dateModified` / `datePublished` on calculator pages (see §8.2).
- `Person` as a top-level node with `sameAs` expanded beyond LinkedIn — add Wikidata, YouTube channel, any professional-body listing. Entity linking across platforms is what makes an author resolvable to AI systems.
- `DefinedTerm` entries on `/glossary/*` currently carry only `name`. Add `description` and `inDefinedTermSet` pointing at `/glossary` — 15 glossary URLs are cheap entity anchors currently doing nothing.
- `HowTo` on procedural pages (`self-employed/opening-business`, `blog/tax-refund-complete-guide-2026`).

**Remove:** `aggregateRating` (see §8.1).

---

## 10. Content Reformatting Suggestions

1. **Convert more H2s to question form.** Calculator pages average 1–4 question-style H2 out of ~11. `מהו מע"מ?` works; `סוגי חישובים`, `סוגי עוסקים`, `הדוח הדו-חודשי` do not match how people query. Reframe as `אילו סוגי עוסקים קיימים?`, `מתי מגישים את הדוח הדו-חודשי?`.

2. **Front-load the definition.** On pages that have one, `מהו X?` sits as the 2nd–3rd H2, below the calculator form. Since ~44% of AI citations come from the first 30% of a page, the definition should appear above or immediately beside the tool.

3. **`/glossary/bituach-leumi` is 466 words** — thin against the 134–167-word-per-block standard when it also needs to cover rates, ceilings, and self-employed vs. salaried. Glossary entries are natural definition-citation targets; expand the top ones to 2–3 self-contained blocks each.

4. **The GSC data shows an AI-shaped query pattern worth serving.** July 2026 impressions include many bare-number queries at strong positions — `"20000"` (pos 3), `"13500"` (pos 3), `"19000/31"` (pos 3), `"26500"` (pos 5), `"2 ילדים"` (pos 4). These are fragment/fan-out style queries, and zero CTR on them is expected and normal — do not treat it as a title problem. It does suggest a bracket-by-bracket "כמה נטו מ-X ברוטו" table would give these queries something concrete to land on; the salary page's existing `טבלת ברוטו לנטו 2026` is the right idea and could be extended.

5. **Add "Preferred Sources" prompting.** Google's Preferred Sources feature is now in all languages and Google is moving toward using it as a ranking signal. A one-line prompt on high-traffic pages asking readers to add חשבונאי as a preferred source is a cheap, legitimate lever.

---

## Evidence Notes

- Site entered Google's index 21.5.2026; GA4 installed 26.7.2026. Any trend claim before those dates has no data behind it.
- Schema and rendering findings come from HTML served in production, fetched with AI-crawler user agents — not from source inspection.
