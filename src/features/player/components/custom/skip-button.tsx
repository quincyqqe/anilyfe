'use client';

import type { AnimeEpisode } from '@/shared/types/anime';
import { ChevronsRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const AUTO_HIDE_DELAY_MS = 10_000;

interface Segment {
  start: number;
  stop: number;
  label: string;
}

function buildSegments(episode: AnimeEpisode): Segment[] {
  const segments: Segment[] = [];
  if (episode.opening?.start != null && episode.opening?.stop != null) {
    segments.push({
      start: episode.opening.start,
      stop: episode.opening.stop,
      label: 'Пропустить опенинг',
    });
  }
  if (episode.ending?.start != null && episode.ending?.stop != null) {
    segments.push({
      start: episode.ending.start,
      stop: episode.ending.stop,
      label: 'Пропустить эндинг',
    });
  }
  return segments;
}

interface SkipButtonProps {
  episode: AnimeEpisode;
  currentTime: number;
  hudVisible: boolean;
  onSkip: (time: number) => void;
}

export function SkipButton({ episode, currentTime, hudVisible, onSkip }: SkipButtonProps) {
  const segments = useMemo(() => buildSegments(episode), [episode]);
  const [visible, setVisible] = useState(false);
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const dismissedRef = useRef<Segment | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const matched = segments.find((s) => currentTime >= s.start && currentTime < s.stop) ?? null;

    if (matched !== activeSegment) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setActiveSegment(matched);

      if (!matched) {
        setVisible(false);
        dismissedRef.current = null;
        return;
      }

      if (dismissedRef.current === matched) return;

      setVisible(true);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        dismissedRef.current = matched;
      }, AUTO_HIDE_DELAY_MS);
    }
  }, [currentTime, segments, activeSegment]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = () => {
    if (!activeSegment) return;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    onSkip(activeSegment.stop);
    setVisible(false);
    dismissedRef.current = activeSegment;
  };

  const show = visible && !!activeSegment && hudVisible;

  return (
    <div
      className="absolute bottom-20 sm:bottom-[76px] right-4 z-40 transition-all duration-300 ease-out"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.97)',
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/65 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-150 hover:border-white/30 hover:bg-white/12 active:scale-95 focus:outline-none"
      >
        <ChevronsRight size={16} className="text-white/70" />
        {activeSegment?.label}
      </button>
    </div>
  );
}
