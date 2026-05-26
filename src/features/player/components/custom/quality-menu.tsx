'use client';

import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import type { QualityLevel } from '../../lib/use-player';

interface QualityMenuProps {
  qualities: QualityLevel[];
  activeUrl: string | null;
  onSelect: (url: string) => void;
}

export function QualityMenu({ qualities, activeUrl, onSelect }: QualityMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (qualities.length <= 1) return null;

  const activeLabel = qualities.find((quality) => quality.url === activeUrl)?.label ?? 'Auto';

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 items-center gap-1 rounded-xl px-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/70 transition duration-200 hover:bg-white/10 hover:text-white focus:outline-none active:scale-95"
        aria-label="Quality"
      >
        {activeLabel}
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 min-w-[126px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_16px_40px_rgba(0,0,0,0.45)]">
          {qualities.map((quality) => {
            const isActive = quality.url === activeUrl;

            return (
              <button
                type="button"
                key={quality.url}
                onClick={() => {
                  onSelect(quality.url);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-primary'
                    : 'text-white/70 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span className="flex h-4 w-4 items-center justify-center">
                  {isActive && <Check size={14} />}
                </span>
                <span>{quality.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
