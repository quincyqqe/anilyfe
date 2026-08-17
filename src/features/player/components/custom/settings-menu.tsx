'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Gauge } from 'lucide-react';

const RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

interface SettingsMenuProps {
  playbackRate: number;
  onSetRate: (rate: number) => void;
}

export function SettingsMenu({ playbackRate, onSetRate }: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition duration-200 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 active:scale-95"
        aria-label="Playback speed"
      >
        <Gauge size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full right-0 mb-2 min-w-[148px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_16px_40px_rgba(0,0,0,0.45)]"
        >
          <div className="border-b border-white/5 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
            Скорость
          </div>
          {RATES.map((rate) => {
            const isActive = Math.abs(playbackRate - rate) < 0.01;

            return (
              <button
                type="button"
                role="menuitem"
                key={rate}
                onClick={() => {
                  onSetRate(rate);
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
                <span>{rate === 1 ? 'Обычная' : `${rate}x`}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
