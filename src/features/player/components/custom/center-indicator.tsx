'use client';

import { useEffect, useState } from 'react';
import { Play, Pause, FastForward, Rewind } from 'lucide-react';

type IndicatorKind = 'play' | 'pause' | 'forward' | 'backward';

interface CenterIndicatorProps {
  playing: boolean;
  /** Bump this number to re-trigger the seek indicator animation */
  seekTrigger?: { direction: 'forward' | 'backward'; ts: number } | null;
}

export function CenterIndicator({ playing, seekTrigger }: CenterIndicatorProps) {
  const [indicator, setIndicator] = useState<{ kind: IndicatorKind; key: number } | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Track play/pause changes (skip the very first render)
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      return;
    }
    setIndicator({ kind: playing ? 'play' : 'pause', key: Date.now() });
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track seek triggers
  useEffect(() => {
    if (!seekTrigger) return;
    setIndicator({ kind: seekTrigger.direction, key: seekTrigger.ts });
  }, [seekTrigger]);

  // Auto-clear after animation
  useEffect(() => {
    if (!indicator) return;
    const timer = setTimeout(() => setIndicator(null), 500);
    return () => clearTimeout(timer);
  }, [indicator]);

  if (!indicator) return null;

  const Icon = {
    play: Play,
    pause: Pause,
    forward: FastForward,
    backward: Rewind,
  }[indicator.kind];

  return (
    <div
      key={indicator.key}
      className="pointer-events-none absolute inset-0 z-30 flex animate-[anilyfeCenterPop_0.5s_ease-out_forwards] items-center justify-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-zinc-950/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_44px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <Icon
          size={28}
          className={indicator.kind === 'play' ? 'text-white fill-white ml-1' : 'text-white fill-white'}
        />
      </div>
    </div>
  );
}
