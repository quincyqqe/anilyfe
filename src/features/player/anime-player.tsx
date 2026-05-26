'use client';

import { updateAnimeProgress } from '@/lib/db/actions/anime-list';
import type { Anime, AnimeEpisode } from '@/shared/types/anime';
import { Clapperboard } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { saveAnimeHistory } from '../../lib/utils/anime-history';
import { AnilyfeHlsPlayer } from './components/anilyfe-hls-player';
import { EpisodeList } from './components/episode-list';

function resolveThumb(episode: AnimeEpisode): string | undefined {
  const src = episode.preview?.optimized?.src;
  return src ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${src}` : undefined;
}

interface Props {
  anime: Anime;
  dbEntry: any | null;
}

export function AnimePlayer({ anime, dbEntry }: Props) {
  const episodes = useMemo(() => anime.episodes ?? [], [anime.episodes]);

  const initialIdx = dbEntry?.current_episode ? Math.max(0, dbEntry.current_episode - 1) : 0;

  const [currentIdx, setCurrentIdx] = useState(initialIdx);

  useEffect(() => {
    setCurrentIdx(initialIdx);
  }, [initialIdx]);

  const lastEpisodeRef = useRef<number | null>(null);
  const lastProgressSyncRef = useRef(0);

  const handleEpisodeSelect = useCallback(
    (idx: number) => {
      setCurrentIdx(idx);

      if (!dbEntry || !anime.alias) return;

      if (lastEpisodeRef.current === idx) return;
      lastEpisodeRef.current = idx;

      updateAnimeProgress(anime.alias, idx + 1, 0, 0);
    },
    [dbEntry, anime.alias],
  );

  const handleProgress = useCallback(
    (currentTime: number, duration: number) => {
      console.log('progress tick', currentTime);

      const episode = anime.episodes?.[currentIdx];
      if (!episode) return;

      saveAnimeHistory({
        animeId: anime.id,
        animeSlug: anime.alias,
        animeTitle: anime.name?.main,
        episode: currentIdx,
        preview: resolveThumb(episode),
        time: currentTime,
        timeLeft: duration - currentTime,
      });

      const now = Date.now();

      if (now - lastProgressSyncRef.current < 10000) return;
      lastProgressSyncRef.current = now;

      if (!dbEntry || !anime.alias) return;

      updateAnimeProgress(
        anime.alias,
        currentIdx + 1,
        Math.round(currentTime),
        Math.round(duration),
      );
    },
    [anime, currentIdx, dbEntry],
  );

  if (!episodes.length) {
    return (
      <section className="container mx-auto relative z-10 flex flex-col gap-5 px-4 py-12">
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

  const episode = episodes[currentIdx] as AnimeEpisode | undefined;
  const poster = episode ? resolveThumb(episode) : undefined;

  const initialTime =
    dbEntry?.current_episode === currentIdx + 1 ? (dbEntry.episode_progress ?? 0) : 0;

  const episodeTitle = useMemo(() => {
    if (!episode) return undefined;

    return `Эпизод ${episode.ordinal ?? currentIdx + 1}${episode.name ? ` · ${episode.name}` : ''}`;
  }, [episode, currentIdx]);

  return (
    <section className="container mx-auto relative z-10 flex flex-col gap-5 px-4 py-12">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <SectionLabel>Смотреть онлайн</SectionLabel>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          {episode && (
            <AnilyfeHlsPlayer
              episode={episode}
              poster={poster}
              initialTime={initialTime}
              title={episodeTitle}
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
    <span className="text-[14px] font-bold uppercase tracking-[0.18em] text-zinc-500">
      {children}
    </span>
  );
}
