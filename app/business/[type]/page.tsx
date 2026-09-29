import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BUSINESS_TYPES, getBusinessType } from '@/lib/data/business-setup/business-types';
import { Breadcrumbs } from '@/components/calculator/Breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { AuthorBox } from '@/components/calculator/AuthorBox';

interface PageProps {
  params: Promise<{ type: string }>;
}

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
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/business/' + business.slug },
    openGraph: { title, description, url: '/business/' + business.slug, type: 'article', locale: 'he_IL', images: ['/opengraph-image'] },
  };
}

export default async function BusinessGuidePage({ params }: PageProps) {
  const business = getBusinessType((await params).type);
  if (!business) notFound();
  const questions = QUESTIONS[business.slug];

  return (
    <main className="min-h-screen bg-cream" dir="rtl">
      <BreadcrumbSchema items={[
        { name: 'דף הבית', url: '/' },
        { name: 'מדריכי הקמת עסק', url: '/business' },
        { name: business.name, url: '/business/' + business.slug },
      ]} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Breadcrumbs items={[
          { label: 'דף הבית', href: '/' },
          { label: 'הקמת עסק', href: '/business' },
          { label: business.name },
        ]} />

        <header className="my-8 border-b border-ink/15 pb-6">
          <p className="mb-3 font-mono text-xs text-gold">✦ מדריך תכנון · {business.category}</p>
          <h1 className="mb-4 text-3xl font-bold text-ink md:text-4xl">תכנון הקמת {business.name}</h1>
          <p className="text-lg leading-relaxed text-ink/75">
            עלות ההקמה תלויה במקום, בהיקף הפעילות, בציוד ובספקים שתבחרו.
            השאלות כאן יעזרו להכין רשימת בדיקה לפני בקשת הצעות מחיר ובניית תקציב.
          </p>
        </header>

        <section className="mb-10 border-r-4 border-gold bg-cream-2 p-6">
          <h2 className="mb-4 text-xl font-bold text-ink">מה לבדוק במיוחד בעסק הזה?</h2>
          <ul className="list-disc space-y-3 pr-5 leading-relaxed text-ink/80">
            {questions.map((question) => <li key={question}>{question}</li>)}
          </ul>
        </section>

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

        <aside className="my-12 border border-gold-light/30 bg-ink p-6 text-cream sm:p-8">
          <h2 className="mb-3 font-serif text-2xl">לומדים לנהל את כספי העסק</h2>
          <p className="mb-5 max-w-2xl leading-relaxed text-cream/75">
            קורס מנהל הכספים של העסק שלך עוסק בתזרים מזומנים, תקציב, הון חוזר והתנהלות מול בנקים ואשראי.
            הסילבוס ותנאי הרכישה מפורטים בדף הקורס.
          </p>
          <Link href="/course/business" className="inline-block bg-gold px-7 py-3 font-bold text-paper hover:bg-gold-2">
            לפרטי הקורס ←
          </Link>
        </aside>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-ink">להמשך בדיקה</h2>
          <ul className="list-disc space-y-2 pr-5 text-gold">
            <li><Link href="/self-employed/opening-business" className="underline">מדריך פתיחת עסק</Link></li>
            <li><Link href="/self-employed/business-finance" className="underline">מדריך ניהול כספים לעסק קטן</Link></li>
            <li><Link href="/tools/loan-eligibility" className="underline">מידע על מסלולי מימון</Link></li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-ink">מדריכים לסוגי עסקים נוספים</h2>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_TYPES.filter((item) => item.slug !== business.slug).map((item) => (
              <Link key={item.slug} href={'/business/' + item.slug} className="border border-ink/15 bg-paper px-3 py-2 text-sm text-ink hover:border-gold">
                {item.name}
              </Link>
            ))}
          </div>
          <Link href="/business" className="mt-5 inline-block text-gold underline">לכל מדריכי הקמת העסק</Link>
        </section>

        <AuthorBox />
      </div>
    </main>
  );
}
