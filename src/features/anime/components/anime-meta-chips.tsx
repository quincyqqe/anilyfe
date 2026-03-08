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

      <MetaChip icon={<Film size={13} />}>{anime.type.description}</MetaChip>

      <MetaChip icon={<Clock size={13} />}>
        {anime.episodes_total ? `${anime.episodes_total} серий` : 'Серии неизвестны'}
      </MetaChip>

      <MetaChip icon={<ShieldAlert size={13} />}>{anime.age_rating.label}</MetaChip>

      {anime.average_duration_of_episode > 0 && (
        <MetaChip>~{anime.average_duration_of_episode} мин / эп.</MetaChip>
      )}
    </div>
  );
}

function MetaChip({
  icon,
  children,
  highlight,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
        highlight
          ? 'bg-primary/10 text-primary border-primary/25'
          : 'bg-white/4 text-zinc-400 border-white/8 hover:border-white/14 hover:text-zinc-300',
      )}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {children}
    </span>
  );
}
