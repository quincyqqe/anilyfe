import React from 'react';
import { Background } from '@/components/effects/background';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <Background lines />

      <div className="z-10 w-full flex justify-center">{children}</div>
    </section>
  );
}
