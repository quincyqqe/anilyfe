'use client';

import { Calendar, Film, Clock, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import { Anime } from '@/shared/types/anime';

interface Props {
  anime: Anime;
}

export function AnimeMetaChips({ anime }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <MetaChip icon={<Calendar size={13} />}>
        {anime.season.description} {anime.year}
      </MetaChip>

      <MetaChip icon={<Film size={13} />}>
        {anime.type.description}
      </MetaChip>

      <MetaChip icon={<Clock size={13} />}>
        {anime.episodes_total ? `${anime.episodes_total} серий` : 'Серии неизвестны'}
      </MetaChip>

      <MetaChip icon={<ShieldAlert size={13} />}>
        {anime.age_rating.label}
      </MetaChip>

      {anime.average_duration_of_episode > 0 && (
        <MetaChip>
          ~{anime.average_duration_of_episode} мин / эп.
        </MetaChip>
      )}
    </div>
  );
}

interface MetaChipProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
}

function MetaChip({ icon, children, highlight }: MetaChipProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium',
        'cursor-default select-none',
        highlight
          ? 'border-primary/25 bg-primary/10 text-primary'
          : 'border-white/6 bg-white/3 text-zinc-400',
      )}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {children}
    </span>
  );
}
