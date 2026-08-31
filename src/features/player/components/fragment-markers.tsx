'use client';

import type { ReactNode } from 'react';
import { usePlayer } from '@videojs/react';

export interface VideoFragment {
  start: number;
  stop: number;
  type?: 'opening' | 'ending';
}

function useDuration(): number {
  return usePlayer((state) => (state as { duration?: number }).duration ?? 0);
}

interface FragmentMarkersProps {
  fragments?: VideoFragment[];
}

export function FragmentMarkers({ fragments = [] }: FragmentMarkersProps): ReactNode {
  const duration = useDuration();

  if (!duration || duration <= 0 || fragments.length === 0) {
    return null;
  }

  console.log(fragments);

  return (
    <div className="media-fragment-markers" aria-hidden="true">
      {fragments.map((fragment, index) => {
        const start = Math.max(0, Math.min(fragment.start, duration));
        const stop = Math.max(start, Math.min(fragment.stop, duration));

        if (stop <= start) {
          return null;
        }

        const left = (start / duration) * 100;
        const width = ((stop - start) / duration) * 100;

        return (
          <div
            key={`${fragment.type ?? 'fragment'}-${start}-${stop}-${index}`}
            className={`media-fragment-marker media-fragment-marker--${fragment.type ?? 'default'}`}
            style={{
              left: `${left}%`,
              width: `${width}%`,
            }}
          />
        );
      })}
    </div>
  );
}
