'use client';

import { useEffect, useRef } from 'react';
import { useMedia } from '../player';
import { usePlayerPreferences } from '../player-preferences';
import type { VideoFragment } from './fragment-markers';

export function FragmentSkipper({ fragments }: { fragments: VideoFragment[] }) {
  const media = useMedia();
  const { skipOpening, skipEnding } = usePlayerPreferences();
  const skipped = useRef(new Set<string>());

  useEffect(() => {
    skipped.current.clear();
  }, [media, fragments]);

  useEffect(() => {
    if (!media) return;
    const element = media as unknown as HTMLMediaElement;
    const handleTimeUpdate = () => {
      const current = element.currentTime;
      if (!Number.isFinite(current)) return;
      for (const fragment of fragments) {
        const enabled =
          fragment.type === 'opening'
            ? skipOpening
            : fragment.type === 'ending'
              ? skipEnding
              : false;
        const key = `${fragment.type}-${fragment.start}-${fragment.stop}`;
        if (
          !enabled ||
          skipped.current.has(key) ||
          current < fragment.start ||
          current >= fragment.stop
        )
          continue;
        skipped.current.add(key);
        element.currentTime = fragment.stop;
        break;
      }
    };
    element.addEventListener('timeupdate', handleTimeUpdate);
    return () => element.removeEventListener('timeupdate', handleTimeUpdate);
  }, [media, fragments, skipOpening, skipEnding]);

  return null;
}