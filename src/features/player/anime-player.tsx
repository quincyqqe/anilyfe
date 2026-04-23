'use client';

import { updateAnimeProgress } from '@/lib/db/actions/anime-list';
import { Anime, AnimeEpisode } from '@/shared/types/anime';
import { Clapperboard } from 'lucide-react';
import { useCallback, useState } from 'react';
import { EpisodeList } from './components/episode-list';
import { PlayerView } from './components/player-view';
import { saveAnimeHistory } from '../../lib/utils/anime-history';
import { getBestUrl } from './lib/quality';

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
      <section className="container mx-auto px-4 relative z-10 py-12 flex flex-col gap-5">
        <SectionLabel>Смотреть онлайн</SectionLabel>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-5 px-8 py-14 text-center">
            <div className="relative flex items-center justify-center">
              <span className="absolute inline-flex h-16 w-16 rounded-full bg-primary/10 animate-ping opacity-30" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <Clapperboard size={24} className="text-zinc-400" />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px] shadow-primary/60 animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-primary/80">
                Ожидается выход
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-zinc-200">Серии ещё не вышли</p>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
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
    <span className="text-[14px] font-bold tracking-[0.18em] uppercase text-zinc-500">
      {children}
    </span>
  );
}
