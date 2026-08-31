'use client';

import type { Anime, AnimeEpisode } from '@/shared/types/anime';
import { Clapperboard } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { EpisodeList } from './components/episode-list/episode-list';
import { usePlayerPersistence } from './hooks/use-player-persistence';
import type { PlayerProgress } from './model/player-types';
import { resolveThumb } from './lib/resolve-thumb';
import { VideoPlayer } from './video-player';

interface Props {
  anime: Anime;
  dbEntry: PlayerProgress | null;
}

export function AnimePlayer({ anime, dbEntry }: Props) {
  const episodes = anime.episodes ?? [];

  const initialIdx = dbEntry?.current_episode
    ? Math.min(Math.max(dbEntry.current_episode - 1, 0), Math.max(episodes.length - 1, 0))
    : 0;

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
    [episodes.length, dbEntry, anime.alias, saveProgress],
  );

  const handleProgress = useCallback(
    (currentTime: number, duration: number) => {
      if (!dbEntry || !anime.alias) return;

      saveProgress(currentIdx + 1, currentTime, duration);
    },
    [currentIdx, dbEntry, anime.alias, saveProgress],
  );
  if (!episodes.length) {
    return (
      <section className="container relative z-10 mx-auto flex flex-col gap-5 px-4 py-12">
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

  const videoSrc = getBestQuality(episode);
  const poster = resolveThumb(episode);

  const initialTime =
    dbEntry?.current_episode === currentIdx + 1 ? (dbEntry.episode_progress ?? 0) : 0;

  const episodeTitle = `Эпизод ${episode.ordinal ?? currentIdx + 1}${
    episode.name ? ` · ${episode.name}` : ''
  }`;
  const fragments: any = [
    ...(episode.opening?.start != null && episode.opening?.stop != null
      ? [
          {
            start: episode.opening.start,
            stop: episode.opening.stop,
            type: 'opening' as const,
          },
        ]
      : []),

    ...(episode.ending?.start != null && episode.ending?.stop != null
      ? [
          {
            start: episode.ending.start,
            stop: episode.ending.stop,
            type: 'ending' as const,
          },
        ]
      : []),
  ];

  return (
    <section className="container relative z-10 mx-auto flex flex-col gap-5 px-4 py-12">
      <SectionLabel>Смотреть онлайн</SectionLabel>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {videoSrc && (
            <VideoPlayer
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

function getBestQuality(episode: AnimeEpisode): string | null {
  return episode.hls_1080 ?? episode.hls_720 ?? episode.hls_480 ?? null;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[14px] font-bold uppercase tracking-[0.18em] text-zinc-500">
      {children}
    </span>
  );
}
