'use client';

import { Play, ListVideo } from 'lucide-react';
import Image from 'next/image';
import clsx from 'clsx';
import { AnimeEpisode } from '@/shared/types/anime';

const MEDIA_BASE = 'https://aniliberty.top';

function resolveThumb(episode: AnimeEpisode): string | undefined {
  const src = episode.preview?.optimized?.src;
  return src ? `${MEDIA_BASE}${src}` : undefined;
}

interface Props {
  episodes: AnimeEpisode[];
  currentIdx: number;
  onSelect: (idx: number) => void;
}

export function EpisodeList({ episodes, currentIdx, onSelect }: Props) {
  return (
    <aside className="flex shrink-0 flex-col gap-3 lg:w-72 xl:w-80">
      <div className="flex items-center gap-2 px-1">
        <ListVideo size={14} className="text-zinc-500" />
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
          Список серий
        </span>
        <span className="ml-auto tabular-nums text-[10px] font-bold tracking-[0.14em] uppercase text-zinc-600">
          {episodes.length} эп.
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/6 bg-white/2 backdrop-blur-sm">
        <div className="scrollbar-hide flex max-h-[622px] flex-col divide-y divide-white/4 overflow-y-auto">
          {episodes.map((ep, idx) => (
            <EpisodeItem
              key={ep.id ?? idx}
              episode={ep}
              idx={idx}
              active={idx === currentIdx}
              onSelect={() => onSelect(idx)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

interface EpisodeItemProps {
  episode: AnimeEpisode;
  idx: number;
  active: boolean;
  onSelect: () => void;
}

function EpisodeItem({ episode, idx, active, onSelect }: EpisodeItemProps) {
  const thumb = resolveThumb(episode);

  return (
    <button
      data-episode={episode.ordinal ?? idx + 1}
      data-active={active ? 'true' : 'false'}
      onClick={onSelect}
      className={clsx(
        'group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
        active
          ? 'bg-primary/10 text-zinc-100'
          : 'text-zinc-400 hover:bg-white/3 hover:text-zinc-300',
      )}
    >
      <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-lg border border-white/8 bg-zinc-900">
        {thumb ? (
          <Image
            src={thumb}
            alt={`Эпизод ${idx + 1}`}
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

        {active ? (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/30">
            <Play size={10} className="fill-primary text-primary" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
            <Play
              size={10}
              className="text-white opacity-0 transition-opacity group-hover:opacity-100"
            />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-xs font-semibold leading-tight">
          Эпизод {episode.ordinal ?? idx + 1}
        </span>
        {episode.name ? (
          <span className="truncate text-[11px] leading-tight text-zinc-500">{episode.name}</span>
        ) : (
          <span className="text-[11px] leading-tight text-zinc-600">
            {episode.duration ? `${Math.floor(episode.duration / 60)} мин` : '—'}
          </span>
        )}
      </div>

      {active && <div className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
    </button>
  );
}
