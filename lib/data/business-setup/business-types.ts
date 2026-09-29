/** Public business guide identifiers. Price assumptions were removed because no sourced market data was available. */
export interface BusinessType {
  slug: string;
  name: string;
  category: string;
}

export const BUSINESS_TYPES: BusinessType[] = [
  {
    "slug": "pilates-studio",
    "name": "סטודיו פילאטיס",
    "category": "כושר וספורט"
  },
  {
    "slug": "photography-studio",
    "name": "סטודיו צילום",
    "category": "שירותים יצירתיים"
  },
  {
    "slug": "cafe",
    "name": "בית קפה",
    "category": "מזון ומשקאות"
  },
  {
    "slug": "restaurant",
    "name": "מסעדה",
    "category": "מזון ומשקאות"
  },
  {
    "slug": "bakery",
    "name": "מאפייה / קונדיטוריה",
    "category": "מזון ומשקאות"
  },
  {
    "slug": "barbershop",
    "name": "מספרה / ברברשופ",
    "category": "יופי וטיפוח"
  },
  {
    "slug": "beauty-salon",
    "name": "מכון יופי / קוסמטיקה",
    "category": "יופי וטיפוח"
  },
  {
    "slug": "clinic",
    "name": "קליניקה לרפואה משלימה / אסתטיקה",
    "category": "בריאות ואסתטיקה"
  },
  {
    "slug": "gym",
    "name": "חדר כושר",
    "category": "ספורט ופנאי"
  },
  {
    "slug": "daycare",
    "name": "מעון יום / גן ילדים פרטי",
    "category": "חינוך וגיל רך"
  },
  {
    "slug": "pub",
    "name": "בר / פאב",
    "category": "מסעדנות ופנאי"
  },
  {
    "slug": "retail-store",
    "name": "חנות קמעונאית",
    "category": "קמעונאות"
  },
  {
    "slug": "office",
    "name": "משרד (יועץ/עו\"ד/רו\"ח)",
    "category": "שירותים מקצועיים"
  },
  {
    "slug": "food-truck",
    "name": "פודטראק / דוכן אוכל נייד",
    "category": "מזון ומסעדנות"
  },
  {
    "slug": "yoga-studio",
    "name": "סטודיו יוגה",
    "category": "כושר ובריאות"
  },
  {
    "slug": "dental-clinic",
    "name": "מרפאת שיניים",
    "category": "רפואה ובריאות"
  },
  {
    "slug": "online-store",
    "name": "חנות אונליין / איקומרס",
    "category": "מסחר ואונליין"
  },
  {
    "slug": "pizzeria",
    "name": "פיצרייה",
    "category": "מזון ומשקאות"
  },
  {
    "slug": "garage",
    "name": "מוסך",
    "category": "רכב"
  },
  {
    "slug": "minimarket",
    "name": "מכולת / מינימרקט",
    "category": "קמעונאות"
  }
];

export function getBusinessType(slug: string): BusinessType | undefined {
  return BUSINESS_TYPES.find((business) => business.slug === slug);
}
