'use client';

import Link from 'next/link';
import { Tooltip } from '@heroui/react';
import { Calendar, Clock, Crown, Eye, Heart, TrendingUp, ChevronRight } from 'lucide-react';

import Image from '@/components/ui/image';
import { Anime } from '@/shared/types/anime';

type Props = {
  anime: Anime;
  onClick: () => void;
};

const getPopularityLevel = (favorites: number) => {
  if (favorites >= 10000)
    return { label: 'Очень популярное', icon: Crown, color: 'text-amber-400' };

  if (favorites >= 5000) return { label: 'Популярное', icon: TrendingUp, color: 'text-orange-400' };

  return null;
};

export const SearchResultCard = ({ anime, onClick }: Props) => {
  const popularity = getPopularityLevel(anime.added_in_users_favorites);
  const PopularityIcon = popularity?.icon;

  const watchingCount = anime.added_in_watching_collection + anime.added_in_planned_collection;

  const posterSrc = anime.poster.optimized?.src || anime.poster.src;

  return (
    <li className="list-none">
      <Link
        href={`/anime/${anime.alias}`}
        prefetch={false}
        onClick={onClick}
        aria-label={`Перейти к аниме ${anime.name.main}`}
        className="
          group
          flex
          p-3 md:p-4
          rounded-xl
          bg-white/[0.03]
          border border-white/[0.06]
          transition-colors
          hover:bg-white/[0.06]
        "
      >
        <div className="relative shrink-0 w-[5.5rem] h-[8rem] md:w-[6rem] md:h-[9rem] rounded-lg overflow-hidden mr-4 bg-zinc-900">
          <Image
            src={`https://aniliberty.top${posterSrc}`}
            alt={anime.name.main}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold uppercase tracking-wide">
            {anime.type.value}
          </div>
        </div>

        <div className="flex flex-col flex-1 min-w-0 justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm md:text-base font-semibold text-zinc-100 line-clamp-1">
                {anime.name.main}
              </h3>

              {popularity && PopularityIcon && (
                <Tooltip content={popularity.label}>
                  <div
                    className={`flex items-center ${popularity.color} bg-white/5 p-1.5 rounded-full border border-white/10`}
                  >
                    <PopularityIcon size={14} />
                  </div>
                </Tooltip>
              )}
            </div>

            {anime.name.english && (
              <p className="text-xs text-zinc-500 italic line-clamp-1">{anime.name.english}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400 pt-1">
              {anime.year && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {anime.year}
                </span>
              )}

              {anime.average_duration_of_episode > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {anime.average_duration_of_episode}м
                </span>
              )}

              {anime.age_rating && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border ${
                    anime.age_rating.is_adult
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  }`}
                >
                  {anime.age_rating.label}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-2">
              {anime.added_in_users_favorites > 0 && (
                <div className="flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-1 rounded text-[10px] font-bold border border-rose-500/10">
                  <Heart size={12} className="fill-current" />
                  {anime.added_in_users_favorites}
                </div>
              )}

              {watchingCount > 0 && (
                <div className="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded text-[10px] font-bold border border-indigo-500/10">
                  <Eye size={12} />
                  {watchingCount}
                </div>
              )}

              {anime.is_in_production && (
                <div className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Онгоинг
                </div>
              )}
            </div>
            <ChevronRight
              size={18}
              className="text-zinc-500 group-hover:text-white transition-colors"
            />
          </div>
        </div>
      </Link>
    </li>
  );
};
