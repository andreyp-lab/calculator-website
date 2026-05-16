import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'חשבונאי - מחשבונים פיננסיים בעברית';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e40af 0%, #4f46e5 50%, #7c3aed 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: 80,
          direction: 'rtl',
        }}
      >
        <div style={{ fontSize: 96, marginBottom: 20 }}>🧮</div>
        <div
          style={{
            fontSize: 82,
            fontWeight: 800,
            marginBottom: 20,
            letterSpacing: '-0.02em',
          }}
        >
          חשבונאי
        </div>
        <div
          style={{
            fontSize: 36,
            opacity: 0.9,
            textAlign: 'center',
            marginBottom: 40,
            maxWidth: 1000,
            lineHeight: 1.3,
          }}
        >
          30 מחשבונים פיננסיים בעברית
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.85,
            display: 'flex',
            gap: 24,
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 1000,
          }}
        >
          <span>💰 מס הכנסה</span>
          <span>🏠 משכנתא</span>
          <span>📈 השקעות</span>
          <span>💼 עצמאיים</span>
          <span>🚗 רכב</span>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 22,
            opacity: 0.7,
          }}
        >
          cheshbonai.co.il · עדכני 2026
        </div>
      </div>
    ),
    { ...size },
  );
}
