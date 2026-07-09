'use client';

import { memo, useCallback, useRef, useState } from 'react';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
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
    (clientX: number) => {
      const bar = barRef.current;

      if (!bar || duration <= 0) return 0;

      const rect = bar.getBoundingClientRect();

      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    },
    [duration],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();

      e.currentTarget.setPointerCapture(e.pointerId);

      const fraction = getFractionFromX(e.clientX);

      setIsDragging(true);
      setHoverFraction(fraction);
      onSeek(fraction * duration);
    },
    [duration, getFractionFromX, onSeek],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const fraction = getFractionFromX(e.clientX);

      setHoverFraction(fraction);

      if (isDragging) {
        onSeek(fraction * duration);
      }
    },
    [duration, getFractionFromX, isDragging, onSeek],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!isDragging) {
      setHoverFraction(null);
    }

    setIsDragging(false);
  }, [isDragging]);

  const tooltipLeft =
    hoverFraction != null
      ? `clamp(32px, calc(${hoverFraction * 100}% + 12px), calc(100% - 32px))`
      : '0';

  return (
    <div className="group/progress relative w-full cursor-pointer select-none px-3 pt-2 pb-1">
      {hoverFraction != null && (
        <div
          className="pointer-events-none absolute bottom-[calc(100%+4px)] z-10 -translate-x-1/2 select-none whitespace-nowrap rounded-md border border-white/10 bg-zinc-950/80 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white"
          style={{ left: tooltipLeft }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      <div
        ref={barRef}
        className="relative h-[4px] rounded-full bg-white/10 transition-[height] duration-200 ease-out group-hover/progress:h-[7px]"
        style={isDragging ? { height: '7px' } : undefined}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/15 transition-[width] duration-200"
          style={{ width: `${bufferedFraction * 100}%` }}
        />

        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white"
          style={{ width: `${fraction * 100}%` }}
        />

        {hoverFraction != null && !isDragging && (
          <div
            className="pointer-events-none absolute top-1/2 h-2.5 w-0.5 -translate-y-1/2 rounded-full bg-white/35"
            style={{ left: `${hoverFraction * 100}%` }}
          />
        )}

        <div
          className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity duration-200 ease-out group-hover/progress:opacity-100"
          style={{
            left: `${fraction * 100}%`,
            opacity: isDragging ? 1 : undefined,
          }}
        />
      </div>
    </div>
  );
});
