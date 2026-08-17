'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

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
  const seekRafRef = useRef<number | null>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const hoverRafRef = useRef<number | null>(null);
  const pendingHoverRef = useRef<number | null>(null);

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

  const scheduleSeek = useCallback(
    (time: number) => {
      pendingSeekRef.current = time;
      if (seekRafRef.current !== null) return;

      seekRafRef.current = requestAnimationFrame(() => {
        seekRafRef.current = null;
        const pendingTime = pendingSeekRef.current;
        pendingSeekRef.current = null;
        if (pendingTime !== null) onSeek(pendingTime);
      });
    },
    [onSeek],
  );

  const scheduleHover = useCallback((fraction: number) => {
    pendingHoverRef.current = fraction;
    if (hoverRafRef.current !== null) return;

    hoverRafRef.current = requestAnimationFrame(() => {
      hoverRafRef.current = null;
      const pendingFraction = pendingHoverRef.current;
      pendingHoverRef.current = null;
      if (pendingFraction !== null) setHoverFraction(pendingFraction);
    });
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const fraction = getFractionFromX(e.clientX);

      scheduleHover(fraction);

      if (isDragging) {
        scheduleSeek(fraction * duration);
      }
    },
    [duration, getFractionFromX, isDragging, scheduleHover, scheduleSeek],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (!isDragging) setHoverFraction(null);
  }, [isDragging]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (duration <= 0) return;

      let nextTime: number | null = null;
      if (event.key === 'ArrowLeft') nextTime = currentTime - 5;
      if (event.key === 'ArrowRight') nextTime = currentTime + 5;
      if (event.key === 'Home') nextTime = 0;
      if (event.key === 'End') nextTime = duration;
      if (nextTime === null) return;

      event.preventDefault();
      onSeek(Math.max(0, Math.min(duration, nextTime)));
    },
    [currentTime, duration, onSeek],
  );

  useEffect(() => {
    return () => {
      if (seekRafRef.current !== null) cancelAnimationFrame(seekRafRef.current);
      if (hoverRafRef.current !== null) cancelAnimationFrame(hoverRafRef.current);
    };
  }, []);

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
        role="slider"
        tabIndex={0}
        aria-label="Video progress"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
        className="relative h-[4px] rounded-full bg-white/10 transition-[height] duration-200 ease-out group-hover/progress:h-[7px]"
        style={isDragging ? { height: '7px' } : undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
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
