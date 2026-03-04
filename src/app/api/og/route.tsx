import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// ---------------------------------------------------------------------------
// Input validation constants
// ---------------------------------------------------------------------------
const MAX_TITLE_LEN    = 80;
const MAX_SUBTITLE_LEN = 160;
const ALLOWED_TYPES    = new Set(['problem', 'pattern', 'concept', 'default']);

/** Strip HTML tags and control characters, then truncate. */
function sanitize(raw: string | null, maxLen: number, fallback: string): string {
  if (!raw) return fallback;
  return raw
    .replace(/<[^>]*>/g, '')          // strip HTML
    .replace(/[^\x20-\x7E\u00A0-\uFFFF]/g, '') // strip control chars
    .trim()
    .slice(0, maxLen);
}

const BADGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  problem:  { bg: '#1e3a5f', text: '#60a5fa', border: '#2563eb' },
  pattern:  { bg: '#2d1b4e', text: '#c084fc', border: '#9333ea' },
  concept:  { bg: '#1a3a2e', text: '#34d399', border: '#10b981' },
  default:  { bg: '#1e293b', text: '#94a3b8', border: '#334155' },
};

const TYPE_LABELS: Record<string, string> = {
  problem: 'LLD Problem',
  pattern: 'Design Pattern',
  concept: 'OOP Concept',
  default: 'Low Level Design',
};

export async function GET(req: NextRequest) {
  // Only allow GET (belt-and-suspenders; Next.js route handlers already enforce this)
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { searchParams } = req.nextUrl;

  // Validate & sanitize all inputs — never trust query params
  const title    = sanitize(searchParams.get('title'),    MAX_TITLE_LEN,    'LLD Mastery');
  const subtitle = sanitize(searchParams.get('subtitle'), MAX_SUBTITLE_LEN, 'Master Low Level Design');
  const rawType  = searchParams.get('type') ?? 'default';
  const type     = ALLOWED_TYPES.has(rawType) ? rawType : 'default';

  const badge  = BADGE_COLORS[type] ?? BADGE_COLORS.default;
  const label  = TYPE_LABELS[type]  ?? TYPE_LABELS.default;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#09090b',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Top-left glow */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            left: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Bottom-right glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '56px 72px',
          }}
        >
          {/* Top: Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: '#fff',
              }}
            >
              {'</>'}
            </div>
            <span style={{ fontSize: '28px', fontWeight: '700', color: '#f4f4f5' }}>
              LLD<span style={{ color: '#60a5fa' }}>Mastery</span>
            </span>
          </div>

          {/* Center: Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Type badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: 'fit-content',
              }}
            >
              <div
                style={{
                  padding: '6px 18px',
                  borderRadius: '999px',
                  background: badge.bg,
                  border: `1.5px solid ${badge.border}`,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: badge.text,
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </div>
            </div>

            {/* Main title */}
            <div
              style={{
                fontSize: title.length > 30 ? '52px' : '64px',
                fontWeight: '800',
                color: '#f4f4f5',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: '24px',
                color: '#71717a',
                fontWeight: '400',
                maxWidth: '700px',
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          </div>

          {/* Bottom: URL + langs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '20px', color: '#52525b', fontWeight: '500' }}>
              lldmastery.dev
            </span>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Python', 'Java', 'C++', 'TypeScript'].map((lang) => (
                <div
                  key={lang}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '15px',
                    color: '#a1a1aa',
                    fontWeight: '500',
                  }}
                >
                  {lang}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
