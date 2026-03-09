import { Calendar, Tv2, Clock } from 'lucide-react';
import { Anime } from '@/shared/types/anime';

const Badges = ({ release }: { release: Anime }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
      {release.year && (
        <Badge icon={<Calendar className="w-4 h-4 text-primary" />} label={String(release.year)} />
      )}
      {release.type?.description && (
        <Badge icon={<Tv2 className="w-4 h-4 text-primary" />} label={release.type.description} />
      )}
      {release.episodes_total && <Badge label={`${release.episodes_total} серий`} />}
      {release.average_duration_of_episode && (
        <Badge
          icon={<Clock className="w-4 h-4 text-primary" />}
          label={`${release.average_duration_of_episode} мин`}
        />
      )}
      {release.age_rating && <Badge label={release.age_rating.label} bold />}
      {release.is_in_production && (
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-400 font-semibold">Онгоинг</span>
        </div>
      )}
    </div>
  );
};

function Badge({ icon, label, bold }: { icon?: React.ReactNode; label: string; bold?: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 max-sm:px-2 max-sm:py-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      {icon}
      <span className={`text-sm text-white/80 ${bold ? 'font-bold' : 'font-medium'}`}>{label}</span>
    </div>
  );
}

export default Badges;
