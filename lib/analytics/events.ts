type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

/**
 * שולח אירוע מדידה. הפרמטרים מוגבלים בכוונה למחרוזות קטגוריאליות (שלב, שנת מס,
 * סוג תוצאה) — לעולם לא סכומים או נתוני טופס 106.
 */
export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window === 'undefined') return;
  const analytics = window as AnalyticsWindow;
  analytics.dataLayer = analytics.dataLayer || [];
  analytics.gtag = analytics.gtag || function gtag(...args: unknown[]) {
    analytics.dataLayer?.push(args);
  };
  analytics.gtag('event', eventName, params);
}
