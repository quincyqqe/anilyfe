'use client';

import { useMedia } from '../player';
import type { VideoFragment } from './fragment-markers';
import { Button } from './button';
import { useEffect, useMemo, useState } from 'react';

interface SkipFragmentControlsProps {
  fragments: VideoFragment[];
}

function formatFragmentType(type: VideoFragment['type']): string {
  return type === 'opening' ? 'опенинг' : 'эндинг';
}

export function SkipFragmentControls({ fragments }: SkipFragmentControlsProps) {
  const media = useMedia();
  const [currentTime, setCurrentTime] = useState(0);

  const activeFragment = useMemo(
    () => fragments.find((fragment) => currentTime >= fragment.start && currentTime < fragment.stop),
    [currentTime, fragments],
  );

  useEffect(() => {
    if (!media) return;

    const element = media as unknown as HTMLMediaElement;
    const updateTime = () => setCurrentTime(element.currentTime);

    element.addEventListener('timeupdate', updateTime);
    element.addEventListener('loadedmetadata', updateTime);
    return () => {
      element.removeEventListener('timeupdate', updateTime);
      element.removeEventListener('loadedmetadata', updateTime);
    };
  }, [media]);

  if (!media || !activeFragment) return null;

  const element = media as unknown as HTMLMediaElement;
  const skipTo = Math.min(activeFragment.stop, Number.isFinite(element.duration) ? element.duration : activeFragment.stop);

  return (
    <div className="media-skip-controls" aria-live="polite">
      <Button
        type="button"
        className="media-button media-skip-button"
        aria-label={`Пропустить ${formatFragmentType(activeFragment.type)}`}
        onClick={() => {
          element.currentTime = skipTo;
        }}
      >
        Пропустить {formatFragmentType(activeFragment.type)}
      </Button>
    </div>
  );
}
