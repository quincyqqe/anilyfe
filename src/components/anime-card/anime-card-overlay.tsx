import { Anime } from '@/shared/types/anime';
import { Heart, Tv2 } from 'lucide-react';

const AnimeCardOverlay = ({ anime }: { anime: Anime }) => (
  <>
    <div
      className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      style={{
        background:
          'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.55) 75%, transparent 100%)',
      }}
    />

    <div className="absolute inset-x-0 bottom-0 z-20 p-3 flex flex-col gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
      <div>
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-3 drop-shadow">
          {anime.name.main}
        </h3>
        {anime.name.english && (
          <p className="text-white/45 text-[11px] line-clamp-1 mt-0.5">{anime.name.english}</p>
        )}
        {anime.name.alternative && (
          <p className="text-white/30 text-[10px] line-clamp-1">{anime.name.alternative}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <StatusBadge isInProduction={anime.is_in_production} />

        <div className="flex items-center gap-2">
          {anime.added_in_users_favorites > 0 && (
            <Stat
              icon={<Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />}
              value={anime.added_in_users_favorites}
            />
          )}
          {anime.added_in_watching_collection > 0 && (
            <Stat
              icon={<Tv2 className="w-2.5 h-2.5 text-sky-400" />}
              value={anime.added_in_watching_collection}
            />
          )}
        </div>
      </div>

      {anime.description && (
        <p className="text-white/45 text-[10px] leading-relaxed line-clamp-3">
          {anime.description}
        </p>
      )}

      {anime.genres?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {anime.genres.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/65 font-medium border border-white/8 leading-none"
            >
              {genre.name}
            </span>
          ))}
        </div>
      )}
    </div>
  </>
);

const Stat = ({ icon, value }: { icon: React.ReactNode; value: number }) => (
  <span className="flex items-center gap-0.5 text-[10px] text-white/50">
    {icon}
    {value}
  </span>
);

const StatusBadge = ({ isInProduction }: { isInProduction: boolean }) => (
  <span
    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none ${
      isInProduction
        ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20'
        : 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/20'
    }`}
  >
    {isInProduction ? 'Онгоинг' : 'Завершено'}
  </span>
);

export default AnimeCardOverlay;
