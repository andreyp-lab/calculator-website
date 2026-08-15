#!/usr/bin/env node
/**
 * הגשת כל כתובות האתר ל-IndexNow (Bing, Yandex ועוד).
 * האינדקס של Bing מזין גם את ציטוטי Microsoft Copilot.
 *
 * שימוש:
 *   node scripts/indexnow.mjs            # מגיש את כל ה-sitemap
 *   node scripts/indexnow.mjs /salary/12000 /compare/rent-vs-buy   # כתובות ספציפיות
 *
 * המפתח מאוחסן ב-public/c458bb7988574c6b3f90e56d164dcb98.txt (חובה שיישאר נגיש).
 */

const SITE = 'https://cheshbonai.co.il';
const KEY = 'c458bb7988574c6b3f90e56d164dcb98';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

async function getUrlsFromSitemap() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

async function main() {
  const args = process.argv.slice(2);
  const urlList = args.length
    ? args.map((p) => (p.startsWith('http') ? p : `${SITE}${p}`))
    : await getUrlsFromSitemap();

  if (!urlList.length) throw new Error('no URLs to submit');
  console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'cheshbonai.co.il',
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  // 200 = OK, 202 = Accepted (key validation pending)
  console.log(`IndexNow response: ${res.status} ${res.statusText}`);
  if (res.status >= 400) {
    console.error(await res.text());
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
