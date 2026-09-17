import './globals.css';
import { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import { esMX } from '@clerk/localizations';
import { Providers } from './providers';
import { clerkAppearance } from '@/lib/clerk-ui';

export const metadata = {
  title: 'RideMe – Tú propones el precio',
  description:
    'Viajes en toda la República Mexicana. Propón tu tarifa. Los choferes compiten por ti. Sin cobros extra.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0C',
};

const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';
const clerkEnabled = /^pk_(test|live)_/.test(pk) && !/placeholder|REPLACE|xxx|^pk_test_demo$/i.test(pk);

export default function RootLayout({ children }: { children: ReactNode }) {
  const tree = (
    <html lang="es" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
  (function(){
    try {
      var t = localStorage.getItem('rideme-theme') || 'dark';
      document.documentElement.classList.remove('dark','light');
      document.documentElement.classList.add(t);
    } catch(e) {}
  })();
`,
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="RideMe" />
        <meta name="theme-color" content="#0A0A0C" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/brand/icon-192.png" />
        <link rel="apple-touch-icon" href="/brand/apple-touch-icon.png" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
  return clerkEnabled ? (
    <ClerkProvider localization={esMX} appearance={clerkAppearance}>
      {tree}
    </ClerkProvider>
  ) : (
    tree
  );
}
