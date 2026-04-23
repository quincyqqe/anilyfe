import { Anime } from '@/shared/types/anime';
import { Bookmark, Heart, Tv2 } from 'lucide-react';

const AnimeCardOverlay = ({ anime }: { anime: Anime }) => {
  const totalViewers =
    anime.added_in_watching_collection +
    anime.added_in_planned_collection +
    anime.added_in_watched_collection +
    anime.added_in_postponed_collection +
    anime.added_in_abandoned_collection;

  const stats = [
    anime.added_in_users_favorites > 0 && {
      icon: (
        <Heart className="w-3 h-3 text-rose-400 fill-rose-400 drop-shadow-[0_0_6px_rgba(251,113,133,0.45)]" />
      ),
      value: formatNumber(anime.added_in_users_favorites),
      color: 'text-rose-300/80',
    },
    totalViewers > 0 && {
      icon: <Tv2 className="w-3 h-3 text-sky-400" />,
      value: formatNumber(totalViewers),
      color: 'text-sky-300/80',
    },
    anime.added_in_planned_collection > 0 && {
      icon: <Bookmark className="w-3 h-3 text-amber-400" />,
      value: formatNumber(anime.added_in_planned_collection),
      color: 'text-amber-300/80',
    },
  ].filter(Boolean) as Array<{
    icon: React.ReactNode;
    value: string;
    color: string;
  }>;

  return (
    <>
      <div
        className="
          absolute inset-0 z-10 opacity-0 group-hover:opacity-100
          transition-opacity duration-500 pointer-events-none
          transform-gpu backface-hidden
        "
        style={{
          background:
            'linear-gradient(to top, rgba(10,10,18,0.98) 0%, rgba(10,10,18,0.75) 45%, rgba(10,10,18,0.25) 70%, transparent 100%)',
        }}
      />

      <div
        className="
          absolute inset-x-0 bottom-0 z-20 p-3 flex flex-col gap-2.5
          translate-y-4 opacity-0
          group-hover:translate-y-0 group-hover:opacity-100
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        "
      >
        <div className="space-y-1">
          <h3 className="text-white font-semibold text-[13px] leading-snug line-clamp-2 drop-shadow-md">
            {anime.name.main}
          </h3>

          {anime.name.english && (
            <p className="text-white/40 text-[10px] line-clamp-1">{anime.name.english}</p>
          )}
        </div>

        {stats.length > 0 && (
          <div className="flex items-center gap-3 text-[10px]">
            {stats.map((s, i) => (
              <StatChip key={i} {...s} />
            ))}
          </div>
        )}

        {anime.description && (
          <p className="text-white/35 text-[10px] leading-relaxed line-clamp-3">
            {anime.description}
          </p>
        )}

        {anime.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 3).map((genre) => (
              <span
                key={genre.id}
                className="
                  text-[9px] px-2 py-[3px] rounded-md
                  bg-white/6 text-white/60 font-medium
                  border border-white/6
                  backdrop-blur-md
                  hover:bg-white/10 hover:text-white/80
                  transition-all duration-200
                "
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

const StatChip = ({
  icon,
  value,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  color: string;
}) => (
  <span
    className={`
      inline-flex items-center gap-1
      ${color}
      font-medium
      leading-none
      tabular-nums
      items-center
    `}
  >
    <span className="flex items-center justify-center w-3 h-3">{icon}</span>
    <span className="translate-y-[0.5px]">{value}</span>
  </span>
);

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default AnimeCardOverlay;
