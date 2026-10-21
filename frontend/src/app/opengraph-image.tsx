import { ImageResponse } from 'next/og';
import { BRAND_NAME } from '@/lib/brand';

export const alt = `${BRAND_NAME} — Software Developer & Digital Artist`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Generates the default social-share preview card shown when a link to the site is pasted elsewhere.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            padding: '10px 28px',
            borderRadius: 999,
            background: '#ec489922',
            border: '2px solid #ec4899',
            color: '#f472b6',
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 36,
          }}
        >
          Software Developer &amp; Digital Artist
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 108,
            fontWeight: 700,
            color: '#f8fafc',
            letterSpacing: -2,
          }}
        >
          {BRAND_NAME}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 28,
            width: 160,
            height: 6,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
