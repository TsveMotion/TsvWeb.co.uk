import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Redirect to the static file
  return NextResponse.redirect(new URL('/wordpress-plugin/tsvweb-monitor.zip', request.url));
}
