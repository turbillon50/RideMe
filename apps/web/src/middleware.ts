import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const clerkEnabled = /^pk_(test|live)_/.test(pk) && !/placeholder|REPLACE|xxx|^pk_test_demo\$/i.test(pk);

const isPublicRoute = createRouteMatcher([
  '/', '/login(.*)', '/sign-in(.*)', '/sign-up(.*)', '/invite(.*)',
  '/driver/onboarding', '/onboarding', '/user-onboarding',
  '/api/webhooks(.*)', '/api/health', '/api/branding(.*)', '/api/support(.*)',
  '/api/invitations/validate',
  '/api/drivers/(.*)', '/api/driver/(.*)',
  '/api/rides/(.*)', '/api/pricing(.*)',
  '/api/push/(.*)', '/api/upload',
  '/api/stripe/(.*)', '/api/mp/(.*)',
  '/api/user/(.*)',
]);

function redirectToSignIn(req: NextRequest) {
  const url = new URL('/sign-in', req.url);
  const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  if (next && next !== '/' && next !== '/sign-in') {
    url.searchParams.set('redirect_url', next);
  }
  return NextResponse.redirect(url);
}

const clerkHandler = clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return;
  if (!auth().userId) return redirectToSignIn(req);
});

export default function middleware(req: NextRequest, ev: any) {
  if (!clerkEnabled) {
    if (!isPublicRoute(req)) return redirectToSignIn(req);
    return NextResponse.next();
  }
  return (clerkHandler as any)(req, ev);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
