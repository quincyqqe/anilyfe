import { Anime } from '@/shared/types/anime';
import { Bookmark, Heart, Tv2 } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: string;
  color: string;
}

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const AnimeCardOverlay = ({ anime }: { anime: Anime }) => {
  const totalViewers =
    anime.added_in_watching_collection +
    anime.added_in_planned_collection +
    anime.added_in_watched_collection +
    anime.added_in_postponed_collection +
    anime.added_in_abandoned_collection;

  const stats: StatItem[] = [
    anime.added_in_users_favorites > 0 && {
      icon: <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />,
      value: formatNumber(anime.added_in_users_favorites),
      color: 'text-rose-300/80',
    },
    totalViewers > 0 && {
      icon: <Tv2 className="h-3 w-3 text-sky-400" />,
      value: formatNumber(totalViewers),
      color: 'text-sky-300/80',
    },
    anime.added_in_planned_collection > 0 && {
      icon: <Bookmark className="h-3 w-3 text-amber-400" />,
      value: formatNumber(anime.added_in_planned_collection),
      color: 'text-amber-300/80',
    },
  ].filter(Boolean) as StatItem[];

  return (
    <>
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,18,0.98) 0%, rgba(10,10,18,0.75) 45%, rgba(10,10,18,0.25) 70%, transparent 100%)',
        }}
      />

      <div className="absolute inset-x-0 bottom-0 z-20 flex translate-y-4 flex-col gap-2.5 p-3 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100">
        <div className="space-y-1">
          {anime.name.english && (
            <h3 className="line-clamp-2 text-[13px] text-white leading-tight">
              {anime.name.english}
            </h3>
          )}
        </div>

        {stats.length > 0 && (
          <div className="flex items-center gap-3 text-[10px]">
            {stats.map((stat, i) => (
              <StatChip key={i} {...stat} />
            ))}
          </div>
        )}

        {anime.description && (
          <p className="line-clamp-3 text-[10px] leading-relaxed text-white/35">
            {anime.description}
          </p>
        )}

        {anime.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="rounded-md border border-white/[0.06] bg-white/[0.06] px-2 py-[3px] text-[9px] font-medium text-white/60 transition-all duration-200 hover:bg-white/10 hover:text-white/80"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const StatChip = ({ icon, value, color }: StatItem) => (
  <span className={`inline-flex items-center gap-1 font-medium tabular-nums leading-none ${color}`}>
    <span className="flex h-3 w-3 items-center justify-center">{icon}</span>
    <span className="translate-y-[0.5px]">{value}</span>
  </span>
);

export default AnimeCardOverlay;
