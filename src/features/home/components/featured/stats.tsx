import { Heart, Eye, Bookmark } from 'lucide-react';
import { Anime } from '@/shared/types/anime';

const Stats = ({ release }: { release: Anime }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
      {release.added_in_users_favorites != null && (
        <Stat
          icon={<Heart className="w-4 h-4 text-red-400" />}
          value={release.added_in_users_favorites}
          label="в избранном"
        />
      )}
      {release.added_in_watching_collection != null && (
        <Stat
          icon={<Eye className="w-4 h-4 text-blue-400" />}
          value={release.added_in_watching_collection}
          label="смотрят"
        />
      )}
      {release.added_in_planned_collection != null && (
        <Stat
          icon={<Bookmark className="w-4 h-4 text-yellow-400" />}
          value={release.added_in_planned_collection}
          label="в планах"
        />
      )}
    </div>
  );
};

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/50">
      {icon}
      <span className="text-white/80 font-bold">{value.toLocaleString()}</span>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

export default Stats;
