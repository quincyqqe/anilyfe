import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AccentLines } from '@/components/effects/accent-lines';
import { ParticleCanvas } from '@/components/effects/particle-canvas';
import { Background } from '@/components/effects/background';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="fixed inset-0">
      <Background lines />
      <header className="absolute left-0 right-0 top-0 flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
        <Link
          href="/"
          className="text-xs tracking-[0.14em] uppercase text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          AniLyfe
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-50 text-sm font-medium hover:bg-zinc-800/80 transition-colors"
        >
          <span>Back to Site</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </header>
      <div className="h-full w-full grid place-items-center px-4">{children}</div>
    </section>
  );
}
