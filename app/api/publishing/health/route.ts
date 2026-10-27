import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/** Read-only health for the site's own schedule. Exposes no drafts or credentials. */
export function GET() {
  return NextResponse.json({ ok: true, mode: 'repository_schedule', timezone: 'Asia/Bangkok' },
    { headers: { 'Cache-Control': 'no-store' } });
}
