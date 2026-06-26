'use client';

import { cn } from '@/lib/utils/cn';
import type { AnimeEpisode } from '@/shared/types/anime';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { forwardRef, memo, useCallback } from 'react';
import { resolveThumb } from '../../lib/resolve-thumb';

interface EpisodeItemProps {
  episode: AnimeEpisode;
  index: number;
  active: boolean;
  onSelect: (idx: number) => void;
}

export const EpisodeItem = memo(
  forwardRef<HTMLButtonElement, EpisodeItemProps>(function EpisodeItem(
    { episode, index, active, onSelect },
    ref,
  ) {
    const thumb = resolveThumb(episode);
    const ordinal = episode.ordinal ?? index + 1;

    const handleClick = useCallback(() => onSelect(index), [onSelect, index]);

    return (
      <button
        ref={ref}
        type="button"
        aria-current={active}
        data-active={active}
        onClick={handleClick}
        className={cn(
          'group relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200',
          active
            ? 'bg-primary/10 text-zinc-100'
            : 'text-zinc-400 hover:bg-white/4 hover:text-zinc-200',
        )}
      >
        <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-zinc-900">
          {thumb ? (
            <Image
              src={thumb}
              alt={`Эпизод ${ordinal}`}
              fill
              sizes="64px"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Play size={12} className="text-zinc-700" />
            </div>
          )}

          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center transition',
              active ? 'bg-primary/30' : 'bg-black/0 group-hover:bg-black/40',
            )}
          >
            <Play
              size={10}
              className={cn(
                'transition',
                active
                  ? 'fill-primary text-primary'
                  : 'text-white opacity-0 group-hover:opacity-100',
              )}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-xs font-semibold leading-tight">Эпизод {ordinal}</span>
          {episode.name ? (
            <span className="truncate text-[11px] leading-tight text-zinc-500">{episode.name}</span>
          ) : (
            <span className="text-[11px] leading-tight text-zinc-600">
              {episode.duration ? `${Math.floor(episode.duration / 60)} мин` : '—'}
            </span>
          )}
        </div>

        {active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
      </button>
    );
  }),
);
