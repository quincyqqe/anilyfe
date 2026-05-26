'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeVolume = Number.isFinite(volume) ? volume : 0;
  const effectiveVolume = muted ? 0 : safeVolume;

  const VolumeIcon =
    muted || safeVolume === 0
      ? VolumeX
      : safeVolume < 0.5
        ? Volume1
        : Volume2;

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

  const startDrag = useCallback(
    (clientX: number) => {
      setIsDragging(true);
      emitVolume(getVolumeFromClientX(clientX));
    },
    [emitVolume, getVolumeFromClientX],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      startDrag(e.clientX);
    },
    [startDrag],
  );

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: PointerEvent) => {
      emitVolume(getVolumeFromClientX(e.clientX));
    };

    const onUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDragging, emitVolume, getVolumeFromClientX]);

  if (!mounted) {
    return (
      <div className="hidden sm:flex items-center gap-2">
        <button className="h-9 w-9 rounded-xl bg-white/10" />
        <div className="h-1 w-[80px] rounded-full bg-white/10" />
      </div>
    );
  }

  return (
    <div
      className="hidden sm:flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      <button
        type="button"
        onClick={onToggleMute}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-white/80 transition hover:bg-white/10 hover:text-white active:scale-95"
      >
        <VolumeIcon size={18} />
      </button>

      <div
        className="transition-all duration-200 ease-out overflow-hidden"
        style={{
          width: isHovered || isDragging ? 80 : 0,
          opacity: isHovered || isDragging ? 1 : 0,
        }}
      >
        <div
          ref={sliderRef}
          className="relative h-1 w-[80px] rounded-full bg-white/15 cursor-pointer"
          onPointerDown={onPointerDown}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/80"
            style={{
              width: `${Math.round(effectiveVolume * 100)}%`,
            }}
          />

          <div
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow"
            style={{
              left: `${effectiveVolume * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
