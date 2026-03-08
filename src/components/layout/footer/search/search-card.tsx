'use client';
import { useMemo } from 'react';
import { Tooltip } from '@heroui/react';
import { Calendar, Clock, Crown, Eye, Heart, TrendingUp, ChevronRight } from 'lucide-react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { Anime } from '@/shared/types/anime';

const getPopularityLevel = (favorites: number) => {
  if (favorites >= 10000)
    return { label: 'Очень популярное', icon: Crown, color: 'text-amber-400' };
  if (favorites >= 5000) return { label: 'Популярное', icon: TrendingUp, color: 'text-orange-400' };
  return null;
};

export const SearchResultCard = ({ anime, onClick }: { anime: Anime; onClick: () => void }) => {
  const popularity = useMemo(
    () => getPopularityLevel(anime.added_in_users_favorites),
    [anime.added_in_users_favorites],
  );
  const PopularityIcon = popularity?.icon;

  return (
    <li className="list-none outline-none">
      <Link
        href={`/anime/${anime.alias}`}
        prefetch={false}
        onClick={onClick}
        className="group relative flex p-3 md:p-4 rounded-[20px] bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.06] hover:border-white/[0.12] hover:shadow-[0_24px_40px_-12px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary overflow-hidden"
        aria-label={`Перейти к аниме ${anime.name.main}`}
      >
        {/* Subtle hover gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

        {/* Poster Image */}
        <div className="relative shrink-0 w-[5.5rem] h-[8rem] md:w-[6.5rem] md:h-[9rem] rounded-[14px] overflow-hidden mr-4 md:mr-5 bg-zinc-900/50">
          <Image
            src={`https://aniliberty.top${anime.poster.optimized?.src || anime.poster.src}`}
            alt={anime.name.main}
            fill
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b]/90 via-[#09090b]/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80" />
          <div className="absolute inset-0 rounded-[14px] box-border border border-white/10 mix-blend-overlay pointer-events-none" />

          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-white/90 text-[9px] font-bold tracking-wider uppercase">
            {anime.type.value}
          </div>
        </div>

        {/* Info Content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-zinc-100 text-sm md:text-base leading-snug line-clamp-1 transition-colors duration-300 group-hover:text-white">
                {anime.name.main}
              </h3>
              {popularity && PopularityIcon && (
                <Tooltip content={popularity.label} classNames={{ content: 'text-xs' }}>
                  <div
                    className={`flex items-center gap-1 ${popularity.color} shrink-0 bg-white/5 p-1.5 rounded-full border border-white/5`}
                  >
                    <PopularityIcon size={14} />
                  </div>
                </Tooltip>
              )}
            </div>

            {anime.name.english && (
              <p className="text-zinc-500 text-[11px] md:text-xs line-clamp-1 italic tracking-wide">
                {anime.name.english}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-zinc-400 font-medium pt-1">
              {anime.year && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-zinc-500" /> {anime.year}
                </span>
              )}
              {anime.average_duration_of_episode > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={12} className="text-zinc-500" /> {anime.average_duration_of_episode}м
                </span>
              )}
              {anime.age_rating && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${
                    anime.age_rating.is_adult
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                  }`}
                >
                  {anime.age_rating.label}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between mt-auto pt-3">
            <div className="flex items-center gap-3">
              {anime.added_in_users_favorites > 0 && (
                <div className="flex items-center gap-1.5 text-rose-400/90 bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/10">
                  <Heart size={12} className="fill-current" />
                  <span className="text-[10px] font-bold">{anime.added_in_users_favorites}</span>
                </div>
              )}
              {anime.added_in_watching_collection + anime.added_in_planned_collection > 0 && (
                <div className="flex items-center gap-1.5 text-indigo-400/90 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/10">
                  <Eye size={12} />
                  <span className="text-[10px] font-bold">
                    {anime.added_in_watching_collection + anime.added_in_planned_collection}
                  </span>
                </div>
              )}
              {anime.is_in_production && (
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase">
                    Онгоинг
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
              <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest hidden md:block">
                Подробнее
              </span>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                <ChevronRight size={14} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
