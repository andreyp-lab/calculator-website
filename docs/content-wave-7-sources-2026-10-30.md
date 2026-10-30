# Content wave 7 — source and scope ledger

Research/access date: 2026-10-30. This records source verification, not professional review or approval to publish.

## Owned files

- `app/real-estate/first-home-budget/page.tsx`
- `app/salaried/salary-negotiation-total-compensation/page.tsx`
- This ledger only. Parent owns hub links, sitemap, shared components and publication.

Read `AGENTS.md`, `docs/content-source-policy.md`, the growth plan, and the installed Next.js guide `node_modules/next/dist/docs/01-app/01-getting-started/14-metadata-and-og-images.md`.

## Intent and duplication boundaries

### First-home budget

Target: `/real-estate/first-home-budget` (plan item 115).

Unique deliverable: a buyer's dated cash plan from available funds through purchase payments, moving costs and the post-move household budget. Existing `/real-estate/mortgage/guide/financing-percentage` owns LTV limits; `/real-estate/mortgage/guide/pre-approval` owns approval interpretation; `/guides/mortgage-complete-guide-2026` owns the mortgage overview; `/compare/rent-vs-buy` owns tenure choice; `/real-estate/sale-costs` covers the seller's transaction. Inspected their contents. This page does not reproduce mortgage limits, tax brackets, rates or market-price estimates.

### Salary comparison and negotiation

Target: `/salaried/salary-negotiation-total-compensation` (plan item 34).

Overlap flagged during research: `/salaried/salary-components` already includes package comparison and explanations of fixed pay, variable pay, benefits and pension salary. The parent explicitly authorized this page after that finding. The bounded new intent is comparing offers on the same period, tracking unresolved terms, distinguishing a clarification from a negotiation request, testing a qualitative scenario and recording a revised offer. It links to the existing component guide instead of repeating its component definitions or tax treatment. `/personal-tax/work-value` compares work income with an alternative and does not supply this negotiation workflow. Residual query overlap remains for the parent SEO audit; no SERP/GSC separation is claimed.

## Verified primary sources and permitted facts

### H1 — Bank of Israel, Financial Stability Report, second half of 2021

URL: https://boi.org.il/media/3iabfmpd/fsr202102h.pdf#page=40

Access: opened and extracted through the web reader; PDF page index 39 / printed page 40. A subsequent direct curl download parsed with pypdf also confirmed the 50-page document and printed page 40. Relevant passage appears under the discussion of borrowing to fund ancillary home-purchase expenses.

Short exact excerpt: “תשלום לעו״ד, מס רכישה, עלות התיווך” (quotation marks normalized typographically).

Supported facts used: the report lists legal services, purchase tax, brokerage, private mortgage advice, renovation, moving and furniture as examples of purchase-related expenses. These are possible budget categories, not universal liabilities. The article explicitly identifies this as a historical report used only for expense categories. No historical lending practice, current tax rule or price is inferred from it.

### H2 — Bank of Israel, mortgage transparency reform

URL: https://www.boi.org.il/information/bank-paymnts/financial-education/competition-in-mortgages/

Access: full page opened and relevant FAQ passages read.

Short exact excerpt: “ההחזר החודשי הראשון וההחזר החודשי הגבוה ביותר הצפוי”.

Supported facts used:

- The approval includes the first monthly payment, highest forecast monthly payment and forecast total payments (FAQ: “מה כולל אישור עקרוני?”).
- The bank's commitment to approval terms is subject to verification of applicant-supplied information; the source also discusses the prime-rate qualification (FAQ: “מהו תוקף האישור העקרוני?”). The page does not state any fixed validity period or unconditional approval.
- Appraisal is used for the loan-to-value approval (FAQ: “מהי הערכת שמאי ומתי היא נדרשת?”).

Budget timing, reserving money and the qualitative timing example are editorial planning methods, not quoted regulatory requirements or calculations.

### S1 — Ministry of Labor, example notice of employment conditions

URL: https://www.gov.il/BlobFolder/generalpage/work-rights-working-conditions-notification/he/workers-rights_admission-to-work_work-rights-working-conditions-notification_Hodaa-Pirot.pdf

Access: the web reader returned HTTP 403, but a direct HTTPS curl download succeeded and produced a valid one-page PDF. Parsed its complete page in memory with the bundled `pypdf.PdfReader`; no source file or unrelated repository file was written. Hebrew extraction has bidirectional ordering artifacts; the following short field labels are normalized to reading order.

Exact short excerpts: “תשלומים קבועים”; “תשלומים שאינם קבועים”; “מועד התשלום”; “הודעה זו אינה הסכם עבודה”.

Supported facts used:

- Section 5 contains the salary payment basis.
- Section 6 separates fixed/non-fixed payments and payment dates; its footnote asks to specify a non-fixed or conditional payment date.
- Section 7 records ordinary daily/weekly working hours.
- Section 9 records social-benefit payments, the receiving body/plan, employee/employer contributions and payment start date. No contribution percentages are supplied by the article.
- The closing paragraph says the notice is not an employment agreement and does not derogate from rights under applicable sources.

The source establishes the form's fields only. It does not establish a candidate's particular bonus, benefit, entitlement, negotiating power or tax treatment. The offer matrix, priority checklist, scenario and sample negotiation wording are editorial methods, explicitly framed as suggestions or illustrations. No numerical offer examples or salary benchmarks are used.

## Sources checked but excluded

The following supplied URLs each redirected to `https://underconstruction.gov.il/` through the web reader on the access date, so no content claims rely on them:

- https://haotzarsheli.mof.gov.il/LifeState/Pages/Apartment-Price.aspx
- https://haotzarsheli.mof.gov.il/LifeState/Pages/Buying-Apartment.aspx
- https://haotzarsheli.mof.gov.il/Subject/Pages/Taking-Mortgage.aspx

## Implementation constraints

- Both pages use `CalculatorLayout` without a `calculator` prop. Its existing conditional therefore omits `CalculatorSchemaClient` / `SoftwareApplication`.
- Each page supplies Article JSON-LD, canonical/OG/Twitter metadata, a dated header, source-specific citations, internal links and FAQPage data generated from the same FAQ array rendered visibly.
- Open Graph and Twitter explicitly set `images: ['/opengraph-image']` on both pages, as requested by the parent to avoid image inheritance gaps.
- Existing site author identity is reused; no `reviewedBy`, professional-review certification or new professional biography is asserted.
- No API calls, lead forms, calculator engines or course promotions were added. The existing course-routing rules do not match either route.
- No hub, sitemap, CSS, shared component, existing page, commit or deployment changes belong to this work.

## Verification

- `tsc --noEmit --incremental false`: passed across the current checkout (no incremental cache written).
- ESLint on the two new page files: passed.
- In-memory React server rendering of both page components and the actual `CalculatorLayout` (Next Link/Image/navigation adapters supplied for this isolated check): each emits exactly one H1 plus Article, FAQPage and BreadcrumbList; no SoftwareApplication. All visible FAQ questions/answers match their JSON-LD data and all table-of-contents anchors resolve.
- Hebrew word counts for quick answer + article content + visible FAQ, excluding shared layout and metadata: first-home budget **603**, salary comparison **654**.
- Every directly authored internal route resolves to an existing local page. The shared author-image asset also exists; an initial route-only checker falsely flagged its preload URL before public assets were accounted for.
- Neither route renders a course link under current routing. No new client hooks, runtime requests or client components were introduced.
- Full Next build/browser verification is left to the parent's integration run to avoid competing over shared `.next` output. These isolated rendering checks do not claim to verify generated HTML metadata or visual layout in a browser.
- Other concurrent changes were observed and left untouched. Parent owns inbound links, sitemap and final SEO/publication checks.
