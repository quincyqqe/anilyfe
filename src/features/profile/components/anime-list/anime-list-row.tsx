'use client';

import { motion } from 'framer-motion';
import { Heart, Play, Star } from 'lucide-react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry } from '@/features/profile/types/profile';
import { STATUS_LABEL, STATUS_PILL } from '../../model/anime-list/constants';
import { formatUpdated, getAnimeHref, getAnimePosterSrc } from '../../model/anime-list/helpers';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

interface AnimeListRowProps {
  anime: UserAnimeEntry;
}

export function AnimeListRow({ anime }: AnimeListRowProps) {
  const hasScore = typeof anime.score === 'number' && anime.score > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group"
    >
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5',
          'transition-all duration-200',
          'hover:bg-white/[0.04]',
          'hover:shadow-[0_0_0_1px_rgba(255,255,255,0.04)]',
        )}
      >
        <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-white/5">
          <Image
            src={getAnimePosterSrc(anime, MEDIA_URL)}
            alt={anime.anime_name || 'Anime poster'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            sizes="44px"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="line-clamp-1 text-[14px] font-medium text-white/90 transition-colors group-hover:text-white">
            {anime.anime_name}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[10px] font-medium',
                STATUS_PILL[anime.status],
              )}
            >
              {STATUS_LABEL[anime.status]}
            </span>

            <span className="text-[11px] text-white/40">{formatUpdated(anime.updated_at)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {anime.is_favourite && (
            <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400 opacity-90" />
          )}

          {hasScore && (
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              <span className="text-sm font-medium">{anime.score}</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
