'use client';

import { useEffect, useState } from 'react';

interface PlayerLoadingProps {
  visible: boolean;
}


const SHOW_DELAY_MS = 300;

export function PlayerLoading({ visible }: PlayerLoadingProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      const id = setTimeout(() => setShow(true), SHOW_DELAY_MS);
      return () => clearTimeout(id);
    } else {
      setShow(false);
    }
  }, [visible]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200"
      style={{ opacity: show ? 1 : 0 }}
    >
      <div className="relative h-11 w-11 rounded-full border border-white/10 bg-zinc-950/40 shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <div className="absolute inset-2 rounded-full border-2 border-white/8" />
        <div
          className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-white/70"
          style={{ animationDuration: '0.75s' }}
        />
      </div>
    </div>
  );
}
