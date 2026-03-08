import { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';

import { Providers } from '@/providers';
import { generateMetadata } from '@/lib/utils/metadata';

import './globals.css';

import { Background } from '@/components/effects/background';

const nunito = Nunito({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-nunito',
});

export const metadata: Metadata = {
  ...generateMetadata(),
  keywords: [
    'аниме онлайн',
    'смотреть аниме',
    'аниме на русском',
    'аниме с озвучкой',
    'мультфильмы онлайн',
    'аниме для взрослых',
    'anime',
    'аниме романтика',
    'аниме комедия',
    'аниме школа',
    'энциклопедия аниме',
    'анитуб',
    'anitube',
    'жанры аниме',
    'аниме украинский',
    'аниме жанры',
    'anime ru',
    'анитюб',
    'лучшее аниме',
    'аниме портал',
    'культура аниме',
  ],
  metadataBase: new URL('https://anilyfe.vercel.app'),
};
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: 'black',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`dark ${nunito.className}`} suppressHydrationWarning>
      <body className="relative bg-zinc-950 min-h-screen">
        <Background />
        <div className="relative z-10">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
