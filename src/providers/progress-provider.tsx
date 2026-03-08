'use client';
import { ProgressProvider } from '@bprogress/next/app';

export function AppProgressProvider({ children }: { children: React.ReactNode }) {
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
      {children}
    </ProgressProvider>
  );
}
