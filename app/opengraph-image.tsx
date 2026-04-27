import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
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
          background: '#060709',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00ff85"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#eef0f6',
            }}
          >
            hook<span style={{ color: '#00ff85' }}>lens</span>
          </span>
        </div>
        <p
          style={{
            fontSize: 28,
            color: 'rgba(238,240,246,0.6)',
            marginTop: 8,
          }}
        >
          AI-Powered Webhook Debugging
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}