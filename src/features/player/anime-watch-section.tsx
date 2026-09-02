'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Clapperboard } from 'lucide-react';

import type { Anime } from '@/shared/types/anime';

import { EpisodeList } from './components/episode-list/episode-list';
import { HlsVideoPlayer } from './hls-video-player';
import { usePlayerPersistence } from './hooks/use-player-persistence';
import {
  clampEpisodeIndex,
  getEpisodeFragments,
  getEpisodeSource,
  getEpisodeTitle,
} from './lib/player-domain';
import { resolveThumb } from './lib/resolve-thumb';
import type { PlayerProgress } from './model/player-types';

export interface AnimeWatchSectionProps {
  anime: Anime;
  dbEntry: PlayerProgress | null;
}

export function AnimeWatchSection({ anime, dbEntry }: AnimeWatchSectionProps) {
  const episodes = anime.episodes ?? [];

  const initialIdx = clampEpisodeIndex((dbEntry?.current_episode ?? 1) - 1, episodes.length);

  const [currentIdx, setCurrentIdx] = useState(initialIdx);

  useEffect(() => {
    setCurrentIdx(initialIdx);
  }, [initialIdx]);

  const saveProgress = usePlayerPersistence({
    animeSlug: anime.alias,
    enabled: Boolean(dbEntry),
  });

  const lastEpisodeRef = useRef<number | null>(null);

  useEffect(() => {
    lastEpisodeRef.current = null;
  }, [anime.alias]);

  const handleEpisodeSelect = useCallback(
    (idx: number) => {
      if (idx < 0 || idx >= episodes.length) return;
      if (lastEpisodeRef.current === idx) return;

      lastEpisodeRef.current = idx;
      setCurrentIdx(idx);

      if (dbEntry && anime.alias) {
        saveProgress(idx + 1, 0, 0, true);
      }
    },
    [anime.alias, dbEntry, episodes.length, saveProgress],
  );

  const handleProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (!dbEntry || !anime.alias) return;

      saveProgress(currentIdx + 1, currentTime, duration);
    },
    [anime.alias, currentIdx, dbEntry, saveProgress],
  );

  if (!episodes.length) {
    return (
      <section className="container relative z-10 mx-auto flex flex-col gap-5 px-4 py-12">
        {' '}
        <SectionLabel>Смотреть онлайн</SectionLabel>
        <div className="glass overflow-hidden rounded-2xl">
          <div className="flex flex-col items-center justify-center gap-5 px-8 py-14 text-center">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-primary/10 opacity-30" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Clapperboard size={24} className="text-zinc-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary shadow-[0_0_6px] shadow-primary/60" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/80">
                Ожидается выход
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-zinc-200">Серии ещё не вышли</p>

              <p className="max-w-xs text-xs leading-relaxed text-zinc-500">
                Премьера этого аниме ожидается в ближайшее время. Следите за обновлениями — серии
                появятся здесь сразу после выхода.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const episode = episodes[currentIdx];
  const videoSrc = getEpisodeSource(episode);
  const poster = resolveThumb(episode);

  const initialTime =
    dbEntry?.current_episode === currentIdx + 1 ? (dbEntry.episode_progress ?? 0) : 0;

  const episodeTitle = getEpisodeTitle(episode, currentIdx);
  const fragments = getEpisodeFragments(episode);

  return (
    <section className="container relative z-10 mx-auto flex flex-col gap-5 px-4 py-12">
      {' '}
      <SectionLabel>Смотреть онлайн</SectionLabel>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {videoSrc && (
            <HlsVideoPlayer
              key={episode.id}
              src={videoSrc}
              animeTitle={anime.name.main}
              poster={poster}
              initialTime={initialTime}
              title={episodeTitle}
              onProgress={handleProgress}
              fragments={fragments}
            />
          )}
        </div>

        <EpisodeList episodes={episodes} currentIdx={currentIdx} onSelect={handleEpisodeSelect} />
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="text-[14px] font-bold uppercase tracking-[0.18em] text-zinc-500">
      {children}{' '}
    </span>
  );
}
