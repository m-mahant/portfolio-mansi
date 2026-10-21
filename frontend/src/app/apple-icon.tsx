import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

// Generates the home-screen icon for iOS/Safari as an "MM" monogram matching the brand palette.
export default function AppleIcon() {
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
          color: '#f8fafc',
          fontSize: 84,
          fontWeight: 700,
        }}
      >
        MM
      </div>
    ),
    { ...size }
  );
}
