import { Calendar, Tv2, Clock } from 'lucide-react';
import clsx from 'clsx';
import { Anime } from '@/shared/types/anime';

interface BadgeProps {
  icon?: React.ReactNode;
  label: string;
  bold?: boolean;
}

const Badges = ({ release }: { release: Anime }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:justify-start">
      {release.year && (
        <Badge icon={<Calendar className="h-4 w-4 text-primary" />} label={String(release.year)} />
      )}

      {release.type?.description && (
        <Badge icon={<Tv2 className="h-4 w-4 text-primary" />} label={release.type.description} />
      )}

      {release.episodes_total && <Badge label={`${release.episodes_total} серий`} />}

      {release.average_duration_of_episode && (
        <Badge
          icon={<Clock className="h-4 w-4 text-primary" />}
          label={`${release.average_duration_of_episode} мин`}
        />
      )}

      {release.age_rating && <Badge label={release.age_rating.label} bold />}

      {release.is_in_production && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 px-3.5 py-2">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-green-400">Онгоинг</span>
        </div>
      )}
    </div>
  );
};

function Badge({ icon, label, bold }: BadgeProps) {
  return (
    <div className="glass flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1 sm:px-3.5 sm:py-2">
      {icon}
      <span className={clsx('text-sm text-white/80', bold ? 'font-bold' : 'font-medium')}>
        {label}
      </span>
    </div>
  );
}

export default Badges;
