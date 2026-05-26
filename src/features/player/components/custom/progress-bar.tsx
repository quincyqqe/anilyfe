'use client';

import { useCallback, useRef, useState } from 'react';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: number;
  onSeek: (time: number) => void;
}

export function ProgressBar({ currentTime, duration, buffered, onSeek }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState(0);

  const fraction = duration > 0 ? currentTime / duration : 0;
  const bufferedFraction = duration > 0 ? buffered / duration : 0;

  const getTimeFromX = useCallback(
    (clientX: number): number => {
      const bar = barRef.current;
      if (!bar || duration <= 0) return 0;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return ratio * duration;
    },
    [duration],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
      setIsDragging(true);
      onSeek(getTimeFromX(event.clientX));
    },
    [getTimeFromX, onSeek],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      setHoverX(x);
      setHoverTime(getTimeFromX(event.clientX));

      if (isDragging) {
        onSeek(getTimeFromX(event.clientX));
      }
    },
    [isDragging, getTimeFromX, onSeek],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHoverX(null);
    setIsDragging(false);
  }, []);

  return (
    <div className="group/progress relative w-full cursor-pointer px-3 py-1.5 select-none">
      {hoverX !== null && (
        <div
          className="pointer-events-none absolute -top-8 z-10 -translate-x-1/2 rounded-lg border border-white/10 bg-zinc-950/80 px-2 py-1 text-[11px] font-medium tabular-nums text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] "
          style={{ left: `calc(${hoverX}px + 0.75rem)` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      <div
        ref={barRef}
        className="relative h-1.5 rounded-full bg-white/10 transition-[height] duration-150 group-hover/progress:h-2"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/15"
          style={{ width: `${bufferedFraction * 100}%` }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
          style={{ width: `${fraction * 100}%` }}
        />
        <div
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 bg-primary opacity-0 shadow-[0_6px_14px_rgba(0,0,0,0.35)] transition-opacity duration-150 group-hover/progress:opacity-100"
          style={{ left: `${fraction * 100}%` }}
        />

        {hoverX !== null && (
          <div
            className="pointer-events-none absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/40"
            style={{ left: `${hoverX}px` }}
          />
        )}
      </div>
    </div>
  );
}
