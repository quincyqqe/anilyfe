import { Anime } from '@/shared/types/anime';
import { Heart, Eye, BookMarked, PauseCircle, XCircle, Clock } from 'lucide-react';

interface Props {
  anime: Anime;
}

const STATS = [
  { key: 'added_in_users_favorites', icon: Heart, label: 'Избранное' },
  { key: 'added_in_watching_collection', icon: Eye, label: 'Смотрят' },
  { key: 'added_in_planned_collection', icon: Clock, label: 'В планах' },
  { key: 'added_in_watched_collection', icon: BookMarked, label: 'Просмотрено' },
  { key: 'added_in_postponed_collection', icon: PauseCircle, label: 'Отложено' },
  { key: 'added_in_abandoned_collection', icon: XCircle, label: 'Заброшено' },
] as const;

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function AnimeStats({ anime }: Props) {
  const stats = STATS.map((s) => ({ ...s, value: anime[s.key] })).filter((s) => s.value > 0);

  if (!stats.length) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
        Статистика
      </span>
      <div className="flex flex-col gap-2">
        {stats.map(({ key, icon: Icon, label, value }) => (
          <div key={key} className="flex items-center gap-2">
            <Icon size={12} className="text-zinc-600 shrink-0" />
            <span className="text-xs text-zinc-500 flex-1">{label}</span>
            <span className="text-xs font-semibold text-zinc-300 tabular-nums">
              {formatCount(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
