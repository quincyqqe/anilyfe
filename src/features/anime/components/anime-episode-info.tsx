import { Anime } from '@/shared/types/anime';
import { Tv } from 'lucide-react';

interface Props {
  anime: Anime;
}

export function AnimeEpisodeInfo({ anime }: Props) {
  const hasEpisodeData =
    anime.episodes_total || anime.latest_episode || anime.average_duration_of_episode;

  if (!hasEpisodeData) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-zinc-600">
        Эпизоды
      </span>
      <div className="flex items-center gap-4 text-sm text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Tv size={14} className="text-zinc-600" />
          {anime.episodes_are_unknown ? (
            'Неизвестно'
          ) : (
            <>
              {anime.episodes.length ?? 0}
              {anime.episodes_total ? (
                <span className="text-zinc-600">/ {anime.episodes_total}</span>
              ) : null}{' '}
              эп.
            </>
          )}
        </span>

        {anime.average_duration_of_episode && (
          <span className="text-zinc-600">~{anime.average_duration_of_episode} мин / эп.</span>
        )}
      </div>
    </div>
  );
}
