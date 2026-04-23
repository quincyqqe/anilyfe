'use client';

import { Anime } from '@/shared/types/anime';
import clsx from 'clsx';
import { Calendar, Clock, Film, ShieldAlert } from 'lucide-react';

interface Props {
  anime: Anime;
}

export function AnimeMetaChips({ anime }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <MetaChip icon={<Calendar size={13} />}>
        {anime.season.description} {anime.year}
      </MetaChip>

      <MetaChip icon={<Film size={13} />}>{anime.type.description}</MetaChip>

      <MetaChip icon={<Clock size={13} />}>
        {anime.episodes_total ? `${anime.episodes_total} серий` : 'Серии неизвестны'}
      </MetaChip>

      <MetaChip icon={<ShieldAlert size={13} />}>{anime.age_rating.label}</MetaChip>

      {anime.average_duration_of_episode > 0 && (
        <MetaChip>~{anime.average_duration_of_episode} мин / эп.</MetaChip>
      )}

      {anime.is_in_production && (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Онгоинг
        </span>
      )}
    </div>
  );
}

interface MetaChipProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function MetaChip({ icon, children }: MetaChipProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium',
        'select-none glass text-zinc-400',
      )}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {children}
    </span>
  );
}
