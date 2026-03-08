'use client';

import { AppProgressProvider } from './progress-provider';
import { AppToastProvider } from './toast-provider';
import { UIProvider } from './ui-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProgressProvider>
      <UIProvider>
        {children}
        <AppToastProvider />
      </UIProvider>
    </AppProgressProvider>
  );
}
