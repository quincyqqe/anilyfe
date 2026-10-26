'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Scale } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function LegalTabs() {
  const pathname = usePathname();
  const isPrivacy = pathname.includes('/privacy');
  const isTerms = pathname.includes('/terms');

  return (
    <div className="flex w-full items-center justify-center">
      <nav
        aria-label="Навигация по документам"
        className="inline-flex items-center gap-1.5 rounded-2xl border border-white/10 bg-zinc-950/70 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl"
      >
        <Link
          href="/privacy"
          className={cn(
            'group relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm',
            isPrivacy
              ? 'bg-white text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:bg-white/5 hover:text-white',
          )}
        >
          <ShieldCheck
            className={cn(
              'h-4 w-4 transition',
              isPrivacy ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-white',
            )}
          />
          <span>Конфиденциальность</span>
        </Link>

        <Link
          href="/terms"
          className={cn(
            'group relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition sm:text-sm',
            isTerms
              ? 'bg-white text-zinc-950 shadow-md'
              : 'text-zinc-400 hover:bg-white/5 hover:text-white',
          )}
        >
          <Scale
            className={cn(
              'h-4 w-4 transition',
              isTerms ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-white',
            )}
          />
          <span>Условия использования</span>
        </Link>
      </nav>
    </div>
  );
}
