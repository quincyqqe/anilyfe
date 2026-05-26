'use client';

import { useCallback, useRef, useState } from 'react';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({ volume, muted, onVolumeChange, onToggleMute }: VolumeControlProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveVolume = muted ? 0 : volume;
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const getVolumeFromX = useCallback(
    (clientX: number): number => {
      const slider = sliderRef.current;
      if (!slider) return volume;
      const rect = slider.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    },
    [volume],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
      setIsDragging(true);
      onVolumeChange(getVolumeFromX(event.clientX));
    },
    [getVolumeFromX, onVolumeChange],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!isDragging) return;
      onVolumeChange(getVolumeFromX(event.clientX));
    },
    [isDragging, getVolumeFromX, onVolumeChange],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      className="hidden items-center gap-1.5 sm:flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDragging(false);
      }}
    >
      <button
        type="button"
        onClick={onToggleMute}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-white/80 transition duration-200 hover:bg-white/10 hover:text-white focus:outline-none active:scale-95"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        <VolumeIcon size={18} />
      </button>

      <div
        className="overflow-hidden transition-[width,opacity] duration-200 ease-out"
        style={{
          width: isHovered || isDragging ? '80px' : '0px',
          opacity: isHovered || isDragging ? 1 : 0,
        }}
      >
        <div
          ref={sliderRef}
          className="relative h-1 w-[80px] cursor-pointer rounded-full bg-white/15"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/80"
            style={{ width: `${effectiveVolume * 100}%` }}
          />
          <div
            className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm"
            style={{ left: `${effectiveVolume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
