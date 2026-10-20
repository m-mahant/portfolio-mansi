import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

// Generates the browser-tab favicon as an "MM" monogram matching the brand palette.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          borderRadius: 7,
          color: '#f8fafc',
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        MM
      </div>
    ),
    { ...size }
  );
}
