'use client';

import { AnimeEpisode } from '@/shared/types/anime';
import clsx from 'clsx';
import { ListVideo, Play } from 'lucide-react';
import Image from 'next/image';

function getEpisodeThumb(episode: AnimeEpisode) {
  const src = episode.preview?.optimized?.src;
  return src ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${src}` : undefined;
}

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  currentIdx: number;
  onSelect: (idx: number) => void;
}

export function EpisodeList({ episodes, currentIdx, onSelect }: EpisodeListProps) {
  return (
    <aside className="flex shrink-0 flex-col gap-3 lg:w-72 xl:w-80">
      <header className="flex items-center gap-2 px-1">
        <ListVideo size={14} className="text-zinc-500" />

        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
          Список серий
        </span>

        <span className="ml-auto tabular-nums text-[10px] font-bold tracking-[0.14em] uppercase text-zinc-600">
          {episodes.length} эп.
        </span>
      </header>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="scrollbar-hide flex max-h-[625px] flex-col divide-y divide-white/5 overflow-y-auto">
          {episodes.map((episode, idx) => (
            <EpisodeItem
              key={episode.id ?? idx}
              episode={episode}
              index={idx}
              active={idx === currentIdx}
              onClick={() => onSelect(idx)}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

interface EpisodeItemProps {
  episode: AnimeEpisode;
  index: number;
  active: boolean;
  onClick: () => void;
}

function EpisodeItem({ episode, index, active, onClick }: EpisodeItemProps) {
  const thumb = getEpisodeThumb(episode);
  const ordinal = episode.ordinal ?? index + 1;

  return (
    <button
      aria-current={active}
      data-active={active}
      data-episode={ordinal}
      onClick={onClick}
      className={clsx(
        'group relative flex w-full items-center gap-3 px-3 py-2.5 text-left transition-all duration-200',
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
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Play size={12} className="text-zinc-700" />
          </div>
        )}

        <div
          className={clsx(
            'absolute inset-0 flex items-center justify-center transition',
            active ? 'bg-primary/30' : 'bg-black/0 group-hover:bg-black/40',
          )}
        >
          <Play
            size={10}
            className={clsx(
              'transition',
              active ? 'fill-primary text-primary' : 'text-white opacity-0 group-hover:opacity-100',
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

      {active && (
        <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_6px] shadow-primary/60" />
      )}
    </button>
  );
}
