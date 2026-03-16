'use client';

import { useState, useCallback } from 'react';
import { Anime, AnimeEpisode } from '@/shared/types/anime';
import { getBestUrl } from './lib/quality';
import { PlayerView } from './components/player-view';
import { EpisodeList } from './components/episode-list';
import { updateAnimeProgress } from '@/lib/db/actions/anime-list';


function resolveThumb(episode: AnimeEpisode): string | undefined {
  const src = episode.preview?.optimized?.src;
  return src ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${src}` : undefined;
}

interface Props {
  anime: Anime;
  dbEntry: any | null;
}

export function AnimePlayer({ anime, dbEntry }: Props) {
  const episodes = anime.episodes ?? [];

  const initialIdx = dbEntry?.current_episode ? Math.max(0, dbEntry.current_episode - 1) : 0;

  const [currentIdx, setCurrentIdx] = useState(initialIdx);

  const handleEpisodeSelect = useCallback(
    (idx: number) => {
      setCurrentIdx(idx);

      if (!dbEntry || !anime.alias) {
        console.warn('[handleEpisodeSelect] aborted — missing dbEntry or anime.alias');
        return;
      }

      updateAnimeProgress(anime.alias, idx + 1, 0, 0);
    },
    [dbEntry, anime.alias],
  );

  const handleProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (!dbEntry || !anime.alias) {
        return;
      }

      updateAnimeProgress(
        anime.alias,
        currentIdx + 1,
        Math.round(currentTime),
        Math.round(duration),
      );
    },
    [dbEntry, anime.alias, currentIdx],
  );

  if (!episodes.length) return null;

  const episode = episodes[currentIdx] as AnimeEpisode | undefined;
  const poster = episode ? resolveThumb(episode) : undefined;
  const url = episode ? getBestUrl(episode) : null;

  return (
    <section className="container mx-auto px-4 relative z-10 py-12 flex flex-col gap-5">
      <SectionLabel>Смотреть онлайн</SectionLabel>

      {episode && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-200">
            Эпизод {episode.ordinal ?? currentIdx + 1}
          </span>
          {episode.name && (
            <>
              <span className="text-zinc-600">·</span>
              <span className="truncate text-sm text-zinc-400">{episode.name}</span>
            </>
          )}
        </div>
      )}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {url && episode && (
            <PlayerView
              episode={episode}
              poster={poster}
              initialTime={
                dbEntry?.current_episode === currentIdx + 1 ? (dbEntry.episode_progress ?? 0) : 0
              }
              onProgress={handleProgress}
            />
          )}
        </div>

        <EpisodeList episodes={episodes} currentIdx={currentIdx} onSelect={handleEpisodeSelect} />
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
      {children}
    </span>
  );
}
