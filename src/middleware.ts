import { NextRequest, NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Rate limiter — in-memory, per-IP, sliding window
// Note: resets per cold-start on serverless; good enough for edge abuse prevention.
// For multi-instance production, swap for Upstash Redis.
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX    = 30;       // max requests per window
const RATE_LIMIT_WINDOW = 60_000;  // 1 minute in ms

const store = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function rateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now >= entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

// ---------------------------------------------------------------------------
// Blocked user-agent substrings (scrapers / scanners)
// ---------------------------------------------------------------------------
const BLOCKED_UA_PATTERNS = [
  'sqlmap', 'nikto', 'nmap', 'masscan', 'zgrab', 'dirbuster',
  'nuclei', 'acunetix', 'nessus', 'openvas', 'burpsuite', 'havij',
  'python-requests/2.1', 'go-http-client/1.1',
];

function isBlockedBot(ua: string): boolean {
  const lower = ua.toLowerCase();
  return BLOCKED_UA_PATTERNS.some((pattern) => lower.includes(pattern));
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Block scanner / attack tool user-agents globally
  const ua = req.headers.get('user-agent') ?? '';
  if (ua && isBlockedBot(ua)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Rate limit the OG image API (most abuse-prone endpoint)
  if (pathname.startsWith('/api/')) {
    const ip = getIp(req);
    const { allowed, remaining, resetAt } = rateLimit(ip);

    if (!allowed) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Content-Type': 'text/plain',
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
        },
      });
    }

    const res = NextResponse.next();
    res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
    res.headers.set('X-RateLimit-Remaining', String(remaining));
    res.headers.set('X-RateLimit-Reset', String(Math.ceil(resetAt / 1000)));
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on API routes and all pages except Next.js internals / static files
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|diagrams/).*)',
  ],
};
