import { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';

import { Providers } from '@/providers/providers';
import { buildMetadata, SITE_URL } from '@/lib/utils/metadata';

import './globals.css';

import { Background } from '@/components/effects/background';

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  ...buildMetadata(),
  metadataBase: new URL(SITE_URL),
  applicationName: 'AniLyfe',

  verification: {
    google: 'GJR6boNc1yhVxvrihq4o9MIUA-k3s7kiEkAlsm7XovI',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`dark ${nunito.className}`}>
      <body>
        <Background />
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
