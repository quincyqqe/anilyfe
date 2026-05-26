'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { AnimeEpisode } from '@/shared/types/anime';

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

export function SkipButton({
  episode,
  currentTime,
  hudVisible,
  onSkip,
}: SkipButtonProps) {
  const segments = useMemo(() => buildSegments(episode), [episode]);

  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [visible, setVisible] = useState(false);

  const dismissedRef = useRef<Segment | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const matched =
      segments.find(
        (s) => currentTime >= s.start && currentTime < s.stop,
      ) ?? null;

    if (matched === activeSegment) return;

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

    if (matched === dismissedRef.current) {
      return;
    }

    setVisible(true);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      dismissedRef.current = matched;
    }, AUTO_HIDE_DELAY_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentTime, segments, activeSegment]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!visible || !activeSegment || !hudVisible) return null;

  const handleClick = () => {
    onSkip(activeSegment.stop);
    setVisible(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        absolute bottom-24 right-4 z-40

        rounded-2xl
        border border-white/15

        bg-black/60

        px-5 py-2.5

        text-sm font-semibold text-white

        shadow-[0_16px_34px_rgba(0,0,0,0.38)]

        transition-all duration-200
        will-change-transform will-change-opacity

        hover:bg-white/10
        hover:border-white/25

        active:scale-95

        focus:outline-none
      "
    >
      {activeSegment.label}
    </button>
  );
}
