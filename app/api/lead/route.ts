import { NextResponse } from 'next/server';

// פרויקט Supabase ייעודי ללידים (cheshbonai-leads).
// המפתח הוא publishable/anon — מיועד לחשיפה פומבית. הטבלה מוגנת ב-RLS:
// תפקיד anon יכול רק INSERT, לא לקרוא/לעדכן/למחוק — כך שמיילים שנאספו
// אינם נגישים דרך המפתח הציבורי.
const SUPABASE_URL = 'https://zkjgyradkikdxpwxzbvg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_PcRS381eZRRTmMPiie8Dfg_RHit_T-q';

// מיפוי מדריכי-מתנה → דף ההורדה/צפייה
const MAGNETS: Record<string, string> = {
  'opening-business-checklist': '/resources/opening-business-checklist',
  'recognized-expenses-list': '/resources/recognized-expenses-list',
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'בקשה לא תקינה' }, { status: 400 });
  }

  const email = String(body?.email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'נא להזין כתובת אימייל תקינה' }, { status: 400 });
  }

  const magnet = body?.magnet ? String(body.magnet) : null;

  const row = {
    email,
    name: body?.name ? String(body.name).trim() : null,
    magnet,
    source_page: body?.page ? String(body.page) : null,
    utm_source: body?.utm_source ? String(body.utm_source) : null,
    utm_medium: body?.utm_medium ? String(body.utm_medium) : null,
    utm_campaign: body?.utm_campaign ? String(body.utm_campaign) : null,
  };

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'אירעה שגיאה בשמירה, נסה שוב' }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'אירעה שגיאה בשמירה, נסה שוב' }, { status: 502 });
  }

  const downloadUrl = (magnet && MAGNETS[magnet]) || '/';
  return NextResponse.json({ ok: true, downloadUrl });
}
