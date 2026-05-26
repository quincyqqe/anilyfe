'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl = memo(function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const safeVolume = Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0;
  const effectiveVolume = muted ? 0 : safeVolume;

  const VolumeIcon =
    effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  const clamp = (v: number) => Math.min(1, Math.max(0, v));

  const getVolumeFromClientX = useCallback((clientX: number) => {
    const el = sliderRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    return clamp((clientX - rect.left) / rect.width);
  }, []);

  const emitVolume = useCallback(
    (value: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        onVolumeChange(Number(value.toFixed(3)));
      });
    },
    [onVolumeChange],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      emitVolume(getVolumeFromClientX(e.clientX));
    },
    [emitVolume, getVolumeFromClientX],
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: PointerEvent) => emitVolume(getVolumeFromClientX(e.clientX));
    const onUp = () => setIsDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging, emitVolume, getVolumeFromClientX]);

  const sliderOpen = isHovered || isDragging;

  return (
    <div
      className="hidden sm:flex items-center gap-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? 'Включить звук' : 'Выключить звук'}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-white/70 transition-all duration-150 hover:bg-white/10 hover:text-white active:scale-95"
      >
        <VolumeIcon size={17} />
      </button>

      <div
        className="overflow-hidden transition-all duration-200 ease-out"
        style={{ width: sliderOpen ? 80 : 0, opacity: sliderOpen ? 1 : 0 }}
      >
        <div
          ref={sliderRef}
          className="relative h-1 w-[80px] cursor-pointer rounded-full bg-white/15"
          onPointerDown={handlePointerDown}
        >
          <div
            className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-white/80 transition-[width] duration-75"
            style={{ width: `${effectiveVolume * 100}%` }}
          />
          <div
            className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
            style={{ left: `${effectiveVolume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
});
