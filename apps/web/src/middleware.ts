import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth wall PR1 — MUST FIX.
 * Prod rideme.ink: 404 `x-clerk-auth-reason: protect-rewrite` (auth().protect()).
 * Este PR: 307 a /sign-in?redirect_url=…  NUNCA auth.protect().
 * Unauth `/app` | `/driver` | `/demo` → sign-in. Booking interno = PR2.
 */
const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const clerkEnabled = /^pk_(test|live)_/.test(pk) && !/placeholder|REPLACE|xxx|^pk_test_demo$/i.test(pk);

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

/** Unauth: /app, /driver (salvo onboarding), /demo → 307 /sign-in. */
export function isAuthWallPath(pathname: string) {
  if (pathname === '/app' || pathname.startsWith('/app/')) return true;
  if (pathname === '/demo' || pathname.startsWith('/demo/')) return true;
  if (pathname === '/driver' || pathname.startsWith('/driver/')) {
    if (pathname === '/driver/onboarding' || pathname.startsWith('/driver/onboarding/')) return false;
    return true;
  }
  return false;
}

function redirectToSignIn(req: NextRequest) {
  const url = new URL('/sign-in', req.url);
  const next = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  if (next && next !== '/' && next !== '/sign-in' && next !== '/sign-up') {
    url.searchParams.set('redirect_url', next);
  }
  return NextResponse.redirect(url, 307);
}

const clerkHandler = clerkMiddleware(
  (auth, req) => {
    // NUNCA auth().protect() — eso es CLERK_PROTECT_REWRITE → 404.
    const { userId } = auth();
    if (userId) return NextResponse.next();
    if (isAuthWallPath(req.nextUrl.pathname) || !isPublicRoute(req)) {
      return redirectToSignIn(req);
    }
    return NextResponse.next();
  },
  {
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
  },
);

export default function middleware(req: NextRequest, ev: any) {
  if (!clerkEnabled) {
    if (isAuthWallPath(req.nextUrl.pathname) || !isPublicRoute(req)) {
      return redirectToSignIn(req);
    }
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
