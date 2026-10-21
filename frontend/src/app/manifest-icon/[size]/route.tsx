import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

const VALID_SIZES = [192, 512] as const;

export function generateStaticParams() {
  return VALID_SIZES.map((size) => ({ size: String(size) }));
}

// Generates the 192px and 512px "MM" monogram icons the PWA manifest needs for home-screen installs.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const dimension = (VALID_SIZES as readonly number[]).includes(Number(size)) ? Number(size) : 192;

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
          fontSize: dimension * 0.4,
          fontWeight: 700,
        }}
      >
        MM
      </div>
    ),
    { width: dimension, height: dimension }
  );
}
