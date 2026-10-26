'use client';

import { ProgressProvider } from '@bprogress/next/app';

import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProgressProvider
      height="2px"
      color="rgb(161 161 170)"
      options={{
        showSpinner: false,
        easing: 'ease',
        trickle: true,
      }}
      shallowRouting
    >
      <TooltipProvider delay={0}>{children}</TooltipProvider>

      <Toaster />
    </ProgressProvider>
  );
}
