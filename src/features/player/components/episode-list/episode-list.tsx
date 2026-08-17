'use client';

import type { AnimeEpisode } from '@/shared/types/anime';
import { ListVideo } from 'lucide-react';
import { memo, useEffect, useRef } from 'react';
import { EpisodeItem } from './episode-item';

interface EpisodeListProps {
  episodes: AnimeEpisode[];
  currentIdx: number;
  onSelect: (idx: number) => void;
}

export const EpisodeList = memo(function EpisodeList({
  episodes,
  currentIdx,
  onSelect,
}: EpisodeListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const container = scrollRef.current;
    const item = activeRef.current;
    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const scrollTop =
      container.scrollTop +
      (itemRect.top - containerRect.top) -
      container.clientHeight / 2 +
      itemRect.height / 2;

    container.scrollTo({ top: scrollTop, behavior: 'smooth' });
  }, [currentIdx]);

  return (
    <aside className="flex shrink-0 flex-col gap-3 lg:w-72 xl:w-80">
      <header className="flex items-center gap-2 px-1">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary/80">
          <ListVideo size={14} />
        </span>
        <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-zinc-300">
          Список серий
        </span>
        <span className="ml-auto tabular-nums text-[10px] font-bold tracking-[0.12em] uppercase text-zinc-500">
          {episodes.length} эп.
        </span>
      </header>

      <div className="overflow-hidden rounded-[18px] border border-white/[0.07] bg-white/[0.025] shadow-[0_16px_42px_rgba(0,0,0,0.24)]">
        <div
          ref={scrollRef}
          className="scrollbar-hide flex max-h-[360px] flex-col divide-y divide-white/[0.06] overflow-y-auto lg:max-h-[614px]"
        >
          {episodes.map((episode, idx) => (
            <EpisodeItem
              key={episode.id ?? idx}
              ref={idx === currentIdx ? (activeRef as React.RefObject<HTMLButtonElement>) : null}
              episode={episode}
              index={idx}
              active={idx === currentIdx}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </aside>
  );
});
