import type { Metadata } from 'next';
import { withPageSocialMetadata } from '@/lib/config/site-info';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BUSINESS_GUIDE_SECTION_IDS, BUSINESS_TYPES, getBusinessType, type BusinessGuideSectionId } from '@/lib/data/business-setup/business-types';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { AuthorBox } from '@/components/calculator/AuthorBox';
import { CourseCTA } from '@/components/marketing/CourseCTA';
import { FAQSchema } from '@/components/seo/FAQSchema';

interface PageProps {
  params: Promise<{ type: string }>;
}

export const dynamicParams = false;

const SECTION_TITLES: Record<BusinessGuideSectionId, string> = {
  businessModel: 'מודל פעילות והצעת ערך',
  infrastructure: 'ציוד, תשתית ומקום',
  compliance: 'בדיקות רישוי וביטוח',
  operations: 'כוח אדם ותפעול',
  runningCosts: 'הוצאות שוטפות',
  viability: 'מדדי כדאיות ונקודת איזון',
  risks: 'סיכונים ותוכנית גיבוי',
};

const QUESTIONS: Record<string, string[]> = {
  'pilates-studio': [
    'איזה סוגי שיעורים תציעו, ואיזה ציוד דרוש לכל שיעור?',
    'כמה משתתפים אפשר לשרת בכל שיעור לפי תכנון החלל והצוות?',
    'אילו הצעות מחיר דרושות לציוד, לתחזוקה ולביטוח?',
  ],
  'photography-studio': [
    'איזה סוג צילום יתקיים בסטודיו, ואיזה חלל ותאורה הוא דורש?',
    'מה צריך לתקצב לציוד צילום, עריכה, גיבוי ואחסון קבצים?',
    'איך יתומחרו ימי צילום וזמן העריכה שלאחריהם?',
  ],
  cafe: [
    'איזה תפריט תציעו, ואיזה ציוד הכנה ואחסון הוא דורש?',
    'איך תבדקו את התאמת הנכס לפעילות ולהיתרים הנדרשים?',
    'אילו הצעות מחיר צריך לקבל עבור חומרי גלם, צוות ופינוי פסולת?',
  ],
  restaurant: [
    'איזה סוג שירות תציעו: ישיבה, איסוף, משלוחים או שילוב שלהם?',
    'מה דורש התפריט מבחינת מטבח, אחסון, צוות וספקים?',
    'אילו בדיקות נדרשות בנכס לפני חתימה על חוזה?',
  ],
  bakery: [
    'אילו מוצרים ייוצרו במקום, ומה דרוש לייצור ולאחסון שלהם?',
    'איך יתוכננו שעות עבודה, מלאי וחומרי גלם מתכלים?',
    'אילו הצעות מחיר דרושות לציוד אפייה, קירור והתאמת הנכס?',
  ],
  barbershop: [
    'כמה עמדות עבודה מתוכננות ואיזה ציוד דרוש לכל עמדה?',
    'איך ייקבעו תורים, משך טיפול ומחיר השירות?',
    'אילו עלויות יש לברר עבור חומרים, ניקיון והתאמת החלל?',
  ],
  'beauty-salon': [
    'אילו טיפולים יינתנו ואיזה ציוד וחומרים דרושים לכל טיפול?',
    'אילו הכשרות, אישורים וביטוחים צריך לבדוק לפי סוג הטיפול?',
    'איך יתוכננו מלאי חומרים, תורים וחדרי טיפול?',
  ],
  clinic: [
    'אילו שירותים יינתנו ובאילו חללים נפרדים יידרש להשתמש?',
    'אילו דרישות מקצועיות, פרטיות וביטוח יש לבדוק לפני פתיחה?',
    'איך יתוכננו תורים, ציוד, חומרים ומעקב אחר הוצאות?',
  ],
  gym: [
    'איזה סוג אימונים יוצע ואיזה ציוד נדרש לכל אזור?',
    'איך יתוכננו תחזוקת ציוד, בטיחות והכשרת צוות?',
    'אילו הצעות מחיר דרושות להתאמת החלל ולשירותים שוטפים?',
  ],
  daycare: [
    'לאילו קבוצות גיל מיועד המעון ואיך יתוכנן החלל עבורן?',
    'אילו דרישות רישוי, בטיחות וכוח אדם חלות על הפעילות המתוכננת?',
    'איך יתוכננו ציוד, מזון, ניקיון וימי פעילות?',
  ],
  pub: [
    'איזה תפריט משקאות ומזון תציעו, ואילו ספקים דרושים?',
    'אילו תנאי רישוי ושעות פעילות יש לברר לגבי הנכס?',
    'איך יתוכננו צוות, אבטחה, מלאי ופחת מוצרים?',
  ],
  'retail-store': [
    'איזה מגוון מוצרים תציעו ואיך תיקבע כמות מלאי הפתיחה?',
    'איך ישפיעו מיקום החנות ותנאי השכירות על התוכנית?',
    'אילו הצעות מחיר דרושות למדפים, קופה, שילוט וספקים?',
  ],
  office: [
    'אילו שירותים יינתנו מהמשרד והאם נדרשות פגישות לקוחות במקום?',
    'איזו תשתית תקשורת, אבטחת מידע ואחסון מסמכים דרושה?',
    'איך תבדקו את עלויות החלל והציוד מול אפשרות עבודה מרחוק?',
  ],
  'food-truck': [
    'איזה תפריט מתאים לציוד ולשטח העבודה ברכב המתוכנן?',
    'אילו היתרים ומקומות פעילות יש לבדוק בכל רשות רלוונטית?',
    'איך יתוכננו קירור, אספקה, דלק ותחזוקת הרכב?',
  ],
  'yoga-studio': [
    'איזה סוגי שיעורים תציעו וכמה מקום דרוש לכל משתתף?',
    'איך ייקבע לוח השיעורים בהתאם לזמינות המדריכים?',
    'אילו הצעות מחיר דרושות לחלל, ציוד, ניקיון וביטוח?',
  ],
  'dental-clinic': [
    'אילו טיפולים יינתנו ואיזה ציוד דרוש לכל חדר טיפול?',
    'אילו דרישות מקצועיות, סטריליזציה ורישוי יש לבדוק?',
    'איך יתוכננו צוות, חומרים, תחזוקת ציוד ותורים?',
  ],
  'online-store': [
    'אילו מוצרים יימכרו ואיך ינוהלו מלאי, אריזה ומשלוחים?',
    'אילו מערכות דרושות לתשלום, שירות לקוחות והחזרות?',
    'איך יתומחרו המוצר, השיווק ועלות אספקתו ללקוח?',
  ],
  pizzeria: [
    'איזה תפריט יוגש במקום ואיזה ציוד הכנה וקירור דרוש?',
    'איזה חלק מהפעילות צפוי להיות ישיבה, איסוף או משלוחים?',
    'אילו הצעות מחיר דרושות לחומרי גלם, אריזות וצוות?',
  ],
  garage: [
    'אילו סוגי טיפול יוצעו ואיזה ציוד נדרש לכל אחד מהם?',
    'אילו דרישות מקצועיות, רישוי ופינוי חומרים יש לבדוק?',
    'איך יתוכננו מלאי חלפים, תורי עבודה ותחזוקת הציוד?',
  ],
  minimarket: [
    'אילו קבוצות מוצרים יימכרו וכיצד ינוהל מלאי מתכלה?',
    'מה דרוש לקירור, אחסון, מדפים וקופה?',
    'איך ייבדקו תנאי הספקים, שעות הפתיחה והצוות?',
  ],
};

export function generateStaticParams() {
  return BUSINESS_TYPES.map((business) => ({ type: business.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = getBusinessType((await params).type);
  if (!business) return { title: 'עמוד לא נמצא' };
  const title = 'תכנון הקמת ' + business.name + ' — שאלות לפני פתיחה';
  const description = 'מדריך תכנון להקמת ' + business.name + ': שאלות על פעילות, מקום, ציוד, ספקים והוצאות שיש לברר מול בעלי מקצוע והצעות מחיר.';
  return withPageSocialMetadata({
    title: { absolute: title },
    description,
    alternates: { canonical: '/business/' + business.slug },
    openGraph: { title, description, url: '/business/' + business.slug, type: 'article', locale: 'he_IL', images: ['/opengraph-image'] },
  });
}

export default async function BusinessGuidePage({ params }: PageProps) {
  const business = getBusinessType((await params).type);
  if (!business) notFound();
  const questions = QUESTIONS[business.slug] ?? [];
  const relatedBusinesses = BUSINESS_TYPES
    .filter((item) => item.slug !== business.slug && item.category === business.category)
    .slice(0, 6);
  const pagePath = `/business/${business.slug}`;
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `תכנון הקמת ${business.name}`,
    description: business.quickAnswer,
    inLanguage: 'he-IL',
    datePublished: '2026-09-29',
    dateModified: '2026-10-24',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://cheshbonai.co.il${pagePath}` },
    author: { '@type': 'Person', name: 'אנדרי פלטונוב', jobTitle: 'רואה חשבון' },
    publisher: { '@type': 'Organization', name: 'חשבונאי', url: 'https://cheshbonai.co.il' },
  };

  return (
    <main className="min-h-screen bg-cream" dir="rtl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <BreadcrumbSchema items={[
        { name: 'דף הבית', url: '/' },
        { name: 'מדריכי הקמת עסק', url: '/business' },
        { name: business.name, url: '/business/' + business.slug },
      ]} />
      <FAQSchema items={[...business.faq]} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[
          { label: 'דף הבית', href: '/' },
          { label: 'הקמת עסק', href: '/business' },
          { label: business.name },
        ]} />

        <header className="my-8 border-b border-ink/15 pb-6">
          <p className="mb-3 font-mono text-xs text-gold">✦ מדריך תכנון · {business.category}</p>
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">תכנון הקמת {business.name}</h1>
          <p className="text-lg leading-relaxed text-ink/75">{business.quickAnswer}</p>
        </header>

        <section className="mb-10 border-r-4 border-gold bg-cream-2 p-6" aria-labelledby="quick-answer-title">
          <h2 id="quick-answer-title" className="mb-3 text-xl font-bold text-ink">תשובה מהירה</h2>
          <p className="leading-relaxed text-ink/80">{business.quickAnswer}</p>
        </section>

        <div className="mb-10 grid gap-5">
          {BUSINESS_GUIDE_SECTION_IDS.map((sectionId, index) => (
            <section key={sectionId} className="border border-ink/15 bg-paper p-5 md:p-6" aria-labelledby={`${sectionId}-title`}>
              <p className="mb-2 font-mono text-xs text-gold">0{index + 1}</p>
              <h2 id={`${sectionId}-title`} className="mb-3 text-xl font-bold text-ink">{SECTION_TITLES[sectionId]}</h2>
              <p className="leading-relaxed text-ink/80">{business.sections[sectionId]}</p>
            </section>
          ))}
        </div>

        {questions.length > 0 && (
          <section className="mb-10 border-r-4 border-gold bg-cream-2 p-6">
            <h2 className="mb-4 text-xl font-bold text-ink">שאלות פתיחה ייחודיות לעסק</h2>
            <ul className="list-disc space-y-3 pr-5 leading-relaxed text-ink/80">
              {questions.map((question) => <li key={question}>{question}</li>)}
            </ul>
          </section>
        )}

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-ink">רשימת בדיקה לתקציב הראשוני</h2>
          <p className="mb-4 leading-relaxed text-ink/75">
            רשמו לכל סעיף את ההצעה שקיבלתם, מועד התשלום והאם זו הוצאה חד־פעמית או שוטפת.
            בדקו את תנאי הנכס ואת הדרישות החלות על סוג הפעילות מול הרשות ובעלי המקצוע המתאימים.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              'מקום: שכירות, התאמות, ארנונה ותנאי החוזה',
              'ציוד, ריהוט, מערכות ומלאי פתיחה',
              'רישוי, ביטוח ושירותים מקצועיים לפי הצורך',
              'שכר עובדים, ספקים והוצאות שוטפות',
              'שיווק, גבייה ומימון תקופת ההקמה',
              'רזרבה לתקלות ולחודשים הראשונים',
            ].map((item) => <li key={item} className="border border-ink/15 bg-paper p-4 text-ink/80">{item}</li>)}
          </ul>
        </section>

        <CourseCTA
          path={`/business/${business.slug}`}
          courseId="cfo"
          placement="business"
        />

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-ink">כלים ומדריכים רלוונטיים</h2>
          <ul className="list-disc space-y-2 pr-5 text-gold">
            {business.relatedLinks.map((link) => <li key={link.href}><Link href={link.href} className="underline">{link.label}</Link></li>)}
          </ul>
        </section>

        <section className="mb-10" aria-labelledby="faq-title">
          <h2 id="faq-title" className="mb-4 text-xl font-bold text-ink">שאלות נפוצות על הקמת {business.name}</h2>
          <div className="space-y-3">
            {business.faq.map((item) => (
              <details key={item.question} className="border border-ink/15 bg-paper p-5">
                <summary className="cursor-pointer font-bold text-ink">{item.question}</summary>
                <p className="mt-3 leading-relaxed text-ink/75">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-ink">מדריכים לסוגי עסקים נוספים</h2>
          <div className="flex flex-wrap gap-2">
            {relatedBusinesses.map((item) => (
              <Link key={item.slug} href={'/business/' + item.slug} className="border border-ink/15 bg-paper px-3 py-2 text-sm text-ink hover:border-gold">
                {item.name}
              </Link>
            ))}
          </div>
          {relatedBusinesses.length === 0 && <p className="text-ink/70">בעמוד המרכזי תוכלו להשוות למודלים עסקיים נוספים.</p>}
          <Link href="/business" className="mt-5 inline-block text-gold underline">לכל מדריכי הקמת העסק</Link>
        </section>

        <aside className="mb-10 border-r-4 border-gold bg-cream-2 p-5 text-sm leading-relaxed text-ink/75">
          <strong className="text-ink">הבהרה:</strong> המידע הוא כלי תכנון כללי בלבד ואינו ייעוץ מס, ייעוץ משפטי, ייעוץ רישוי או המלצה עסקית. דרישות רישוי, ביטוח ומיסוי משתנות לפי הפעילות, הנכס והרשות המקומית; לפני התחייבות או פתיחת תיק יש לבדוק את המקרה עם הרשות ובעל המקצוע המתאים.
        </aside>

        <AuthorBox />
      </div>
    </main>
  );
}
