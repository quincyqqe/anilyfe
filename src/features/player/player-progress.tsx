'use client';

import { useEffect, type ReactNode } from 'react';

import { useMedia } from './player';

export interface PlayerProgressProps {
  initialTime: number;
  onProgress?: (currentTime: number, duration: number) => void;
}

export function PlayerProgress({ initialTime, onProgress }: PlayerProgressProps): ReactNode {
  const media = useMedia();

  useEffect(() => {
    if (!media) return;

    const element = media as unknown as HTMLMediaElement;

    const handleLoadedMetadata = () => {
      if (initialTime > 0 && Number.isFinite(element.duration) && initialTime < element.duration) {
        element.currentTime = initialTime;
      }
    };

    const handleTimeUpdate = () => {
      if (!onProgress) return;

      const currentTime = element.currentTime;
      const duration = element.duration;

      if (!Number.isFinite(currentTime) || !Number.isFinite(duration)) {
        return;
      }

      onProgress(currentTime, duration);
    };

    element.addEventListener('loadedmetadata', handleLoadedMetadata);
    element.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      element.removeEventListener('loadedmetadata', handleLoadedMetadata);
      element.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [media, initialTime, onProgress]);

  return null;
}
