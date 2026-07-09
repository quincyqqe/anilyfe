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
        data-episode={ordinal}
        onClick={handleClick}
        className={cn(
          'group relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200',
          active
            ? 'bg-primary/10 text-zinc-100'
            : 'text-zinc-400 hover:bg-white/4 hover:text-zinc-200',
        )}
      >
        <div className="relative h-11 w-[76px] shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950/60 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
          {thumb ? (
            <Image
              src={thumb}
              alt={`Эпизод ${ordinal}`}
              fill
              sizes="80px"
              className="object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Play size={11} className="text-zinc-600" />
            </div>
          )}

          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center transition-colors duration-300',
              active ? 'bg-primary/10' : 'bg-black/0 group-hover:bg-black/35',
            )}
          >
            <Play
              size={11}
              className={cn(
                'transition-colors duration-300',
                active
                  ? 'fill-white text-white scale-100'
                  : 'text-white opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100',
              )}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <span className={cn(
            'text-xs font-semibold leading-none tracking-[0.01em]',
            active ? 'text-primary' : 'text-zinc-200'
          )}>
            Эпизод {ordinal}
          </span>

          {episode.name ? (
            <span className="truncate text-[12px] leading-none text-zinc-400/90 group-hover:text-zinc-300 transition-colors">
              {episode.name}
            </span>
          ) : (
            <span className="truncate text-[12px] leading-none text-zinc-500/80">
              Без названия
            </span>
          )}
        </div>

        {active && (
          <span className="ml-auto flex h-2 w-2 shrink-0 rounded-full bg-primary" />
        )}
      </button>
    );
  }),
);
