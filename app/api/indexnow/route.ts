/**
 * IndexNow API endpoint
 * ---------------------
 * מגיש URLs ל-IndexNow (Bing, Yandex, Seznam) כדי לזרז אינדוקס.
 * Google לא תומך ישירות אבל סורק את ה-pings ככלי איכות עקיף.
 *
 * שימוש:
 *   POST /api/indexnow                 → מגיש את כל הסיתאמפ
 *   POST /api/indexnow {"urls":["..."]} → מגיש URLs ספציפיים
 *   GET  /api/indexnow                 → בדיקת קונפיגורציה
 *
 * אבטחה: דורש header `x-indexnow-token` = `INDEXNOW_KEY` (אם מוגדר).
 */
import { NextRequest, NextResponse } from 'next/server';
import sitemap from '@/app/sitemap';

const INDEXNOW_KEY = 'c458bb7988574c6b3f90e56d164dcb98';
const HOST = 'cheshbonai.co.il';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

// IndexNow endpoints (כל אחד יקבל את אותה רשימה)
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
];

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    host: HOST,
    keyLocation: KEY_LOCATION,
    sitemapEntries: sitemap().length,
    endpoints: ENDPOINTS,
    usage: {
      submitAll: 'POST /api/indexnow (empty body)',
      submitSpecific: 'POST /api/indexnow with {"urls":["https://..."]}',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // אבטחה: אם הוגדר token, חייבים אותו ב-header
    const authToken = process.env.INDEXNOW_AUTH_TOKEN;
    if (authToken) {
      const provided = request.headers.get('x-indexnow-token');
      if (provided !== authToken) {
        return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
      }
    }

    // קבל URLs מה-body או מ-sitemap
    let urls: string[] = [];
    try {
      const body = await request.json();
      if (Array.isArray(body?.urls)) urls = body.urls;
    } catch {
      // empty body OK - נשתמש בסיתאמפ
    }

    if (urls.length === 0) {
      urls = sitemap().map((e) => e.url);
    }

    // ולידציה - רק URLs של הדומיין שלנו
    urls = urls.filter((u) => u.includes(HOST));
    if (urls.length === 0) {
      return NextResponse.json({ error: 'no valid urls' }, { status: 400 });
    }

    // IndexNow מגביל ל-10,000 URLs לבקשה. נחלק לקבוצות של 1000
    const chunks: string[][] = [];
    for (let i = 0; i < urls.length; i += 1000) {
      chunks.push(urls.slice(i, i + 1000));
    }

    const results: Array<{ endpoint: string; chunks: number; ok: boolean; status?: number; error?: string }> = [];

    for (const endpoint of ENDPOINTS) {
      let okCount = 0;
      let lastStatus: number | undefined;
      let lastError: string | undefined;

      for (const chunk of chunks) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              host: HOST,
              key: INDEXNOW_KEY,
              keyLocation: KEY_LOCATION,
              urlList: chunk,
            }),
          });
          lastStatus = res.status;
          // 200 OK, 202 Accepted - שניהם תקינים
          if (res.status === 200 || res.status === 202) {
            okCount++;
          } else {
            lastError = await res.text().catch(() => 'unknown');
          }
        } catch (err) {
          lastError = err instanceof Error ? err.message : 'fetch failed';
        }
      }

      results.push({
        endpoint,
        chunks: chunks.length,
        ok: okCount === chunks.length,
        status: lastStatus,
        ...(lastError && { error: lastError.slice(0, 200) }),
      });
    }

    return NextResponse.json({
      submitted: urls.length,
      chunks: chunks.length,
      results,
      sampleUrls: urls.slice(0, 5),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'unknown' },
      { status: 500 }
    );
  }
}
