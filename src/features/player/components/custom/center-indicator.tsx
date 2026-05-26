'use client';

import { FastForward, Pause, Play, Rewind } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type IndicatorKind = 'play' | 'pause' | 'forward' | 'backward';

const ICON_MAP = {
  play: Play,
  pause: Pause,
  forward: FastForward,
  backward: Rewind,
} as const;

interface CenterIndicatorProps {
  playing: boolean;
  seekTrigger?: { direction: 'forward' | 'backward'; ts: number } | null;
}

interface IndicatorState {
  kind: IndicatorKind;
  key: number;
}

export function CenterIndicator({ playing, seekTrigger }: CenterIndicatorProps) {
  const [indicator, setIndicator] = useState<IndicatorState | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setIndicator({ kind: playing ? 'play' : 'pause', key: Date.now() });
  }, [playing]);

  useEffect(() => {
    if (!seekTrigger) return;
    setIndicator({
      kind: seekTrigger.direction === 'forward' ? 'forward' : 'backward',
      key: seekTrigger.ts,
    });
  }, [seekTrigger]);

  useEffect(() => {
    if (!indicator) return;
    const id = setTimeout(() => setIndicator(null), 520);
    return () => clearTimeout(id);
  }, [indicator]);

  if (!indicator) return null;

  const Icon = ICON_MAP[indicator.kind];
  const isFilled = indicator.kind === 'play' || indicator.kind === 'pause';

  return (
    <div
      key={indicator.key}
      className="pointer-events-none absolute inset-0 z-30 flex animate-[anilyfeCenterPop_0.52s_ease-out_forwards] items-center justify-center"
      aria-hidden
    >
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-white/15 bg-zinc-950/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_40px_rgba(0,0,0,0.5)]">
        <Icon
          size={26}
          className={isFilled ? 'fill-white text-white' : 'text-white'}
          style={indicator.kind === 'play' ? { marginLeft: 2 } : undefined}
        />
      </div>
    </div>
  );
}
