import { buildMetadata } from '@/lib/utils/metadata';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = buildMetadata({
  title: 'Вход',
  description:
    'Войдите в AniLyfe, чтобы синхронизировать библиотеку, прогресс просмотра и избранное.',
  path: '/login',
  robots: {
    index: false,
    follow: false,
  },
});

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
