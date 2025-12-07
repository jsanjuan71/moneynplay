import { routing } from '@/i18n/routing';
import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(es|en)/:path*']
};
