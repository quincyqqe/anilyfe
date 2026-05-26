'use client';

import { memo, useCallback, useRef, useState } from 'react';

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

export const ProgressBar = memo(function ProgressBar({
  currentTime,
  duration,
  buffered,
  onSeek,
}: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverFraction, setHoverFraction] = useState<number | null>(null);

  const fraction = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const bufferedFraction = duration > 0 ? Math.min(buffered / duration, 1) : 0;
  const hoverTime = hoverFraction != null ? hoverFraction * duration : 0;

  const getFractionFromX = useCallback(
    (clientX: number): number => {
      const bar = barRef.current;
      if (!bar || duration <= 0) return 0;
      const rect = bar.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    },
    [duration],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      const f = getFractionFromX(e.clientX);
      setHoverFraction(f);
      onSeek(f * duration);
    },
    [getFractionFromX, onSeek, duration],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const f = getFractionFromX(e.clientX);
      setHoverFraction(f);
      if (isDragging) onSeek(f * duration);
    },
    [isDragging, getFractionFromX, onSeek, duration],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!isDragging) setHoverFraction(null);
    setIsDragging(false);
  }, [isDragging]);

  
  const tooltipLeft =
    hoverFraction != null
      ? `clamp(28px, calc(${hoverFraction * 100}% + 12px), calc(100% - 28px))`
      : '0';

  return (
    <div className="group/progress relative w-full cursor-pointer select-none px-3 pb-1 pt-2">
      {/* Hover time tooltip */}
      {hoverFraction != null && (
        <div
          className="pointer-events-none absolute bottom-[calc(100%-4px)] z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-950/85 px-2 py-1 text-[11px] font-semibold tabular-nums text-white shadow-lg backdrop-blur-sm"
          style={{ left: tooltipLeft }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      <div
        ref={barRef}
        className="relative h-1 rounded-full bg-white/15 transition-[height] duration-150 group-hover/progress:h-[5px]"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {/* Buffered */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/20 transition-[width] duration-200"
          style={{ width: `${bufferedFraction * 100}%` }}
        />

        {/* Played */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-primary shadow-[0_0_6px_rgba(var(--primary-rgb,200,50,100),0.4)]"
          style={{ width: `${fraction * 100}%` }}
        />

        {/* Hover ghost position */}
        {hoverFraction != null && (
          <div
            className="pointer-events-none absolute top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full bg-white/30"
            style={{ left: `${hoverFraction * 100}%` }}
          />
        )}

        {/* Thumb — always present, visible on hover/drag */}
        <div
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-opacity duration-150 group-hover/progress:opacity-100"
          style={{
            left: `${fraction * 100}%`,
            opacity: isDragging ? 1 : undefined,
          }}
        />
      </div>
    </div>
  );
});
