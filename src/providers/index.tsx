'use client';

import { Toaster } from '@/components/ui/toast';

import { AppProgressProvider } from './progress-provider';
import { AppToastProvider } from './toast-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProgressProvider>
      {children}
      <AppToastProvider />
      <Toaster />
    </AppProgressProvider>
  );
}
