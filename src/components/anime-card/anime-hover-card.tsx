import Link from 'next/link';
import {
  Bookmark,
  CalendarClock,
  Clock,
  ExternalLink,
  Film,
  Heart,
  Play,
  Star,
  Tv2,
} from 'lucide-react';
import { SiMyanimelist, SiShikimori } from 'react-icons/si';
import type { IconType } from 'react-icons';

import { HoverCardContent } from '@/components/ui/hover-card';
import type { Anime } from '@/shared/types/anime';

const freshAtFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

interface CommunityRating {
  id: string;
  label: string;
  rating: number;
  votes: number;
  url: string;
  Icon: IconType;
  brandClass: string;
}

const formatFreshDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return freshAtFormat.format(date).replace(/\.$/, '');
};

const formatNumber = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
};

const formatVotes = (value: number): string => new Intl.NumberFormat('ru-RU').format(value);

const AnimeHoverCard = ({ anime }: { anime: Anime }) => {
  const totalViewers =
    anime.added_in_watching_collection +
    anime.added_in_planned_collection +
    anime.added_in_watched_collection +
    anime.added_in_postponed_collection +
    anime.added_in_abandoned_collection;

  const ratings: CommunityRating[] = [];
  if (anime.mal && anime.mal.url && anime.mal.rating > 0) {
    ratings.push({
      id: 'mal',
      label: 'MyAnimeList',
      rating: anime.mal.rating,
      votes: anime.mal.votes,
      url: anime.mal.url,
      Icon: SiMyanimelist,
      brandClass: 'text-[#8da8ee]',
    });
  }
  if (anime.shikimori && anime.shikimori.url && anime.shikimori.rating > 0) {
    ratings.push({
      id: 'shikimori',
      label: 'Shikimori',
      rating: anime.shikimori.rating,
      votes: anime.shikimori.votes,
      url: anime.shikimori.url,
      Icon: SiShikimori,
      brandClass: 'text-rose-300',
    });
  }

  const metaItems = [anime.season?.description, anime.year ? String(anime.year) : null].filter(
    (item): item is string => Boolean(item),
  );
  const freshDate = formatFreshDate(anime.fresh_at ?? anime.updated_at);

  return (
    <HoverCardContent
      side="right"
      align="start"
      sideOffset={12}
      className="w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border-white/10 bg-zinc-950/98 p-0 shadow-[0_18px_48px_-18px_rgba(0,0,0,0.8)]"
    >
      <div className="space-y-4 p-4">
        <header className="space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h3 className="line-clamp-2 text-[15px] font-bold leading-snug tracking-tight text-zinc-50">
                {anime.name.main}
              </h3>
              {anime.name.english && anime.name.english !== anime.name.main && (
                <p className="line-clamp-1 text-[11px] text-zinc-400">{anime.name.english}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {anime.type?.description && <MetaChip>{anime.type.description}</MetaChip>}
            {metaItems.map((item) => (
              <MetaChip key={item}>{item}</MetaChip>
            ))}
            {anime.episodes_total !== null && (
              <MetaChip icon={<Film className="size-3" />}>{anime.episodes_total} эп.</MetaChip>
            )}
            {anime.average_duration_of_episode > 0 && (
              <MetaChip icon={<Clock className="size-3" />}>
                ~{anime.average_duration_of_episode} мин.
              </MetaChip>
            )}
            {anime.age_rating?.label && <MetaChip>{anime.age_rating.label}</MetaChip>}
          </div>
        </header>

        {ratings.length > 0 && (
          <section className="space-y-2" aria-label="Оценки на MyAnimeList и Shikimori">
            <div className="flex items-center gap-2">
              <Star className="size-3 text-amber-300" />
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                Оценки сообщества
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {ratings.map(({ id, label, rating, votes, url, Icon, brandClass }) => (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-2.5 py-2 transition-colors hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <Icon className={`size-4 shrink-0 ${brandClass}`} aria-hidden="true" />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-[10px] font-semibold text-zinc-300">
                      {label}
                    </span>
                    <span className="truncate text-[9px] text-zinc-500">
                      {votes > 0 ? `${formatVotes(votes)} голосов` : 'Внешняя оценка'}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 font-mono text-[13px] font-bold tabular-nums text-zinc-100">
                    <Star className="size-3 fill-amber-300 text-amber-300" />
                    {rating.toFixed(2)}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {(anime.added_in_users_favorites > 0 || totalViewers > 0) && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 border-y border-white/[0.08] py-2.5">
            {anime.added_in_users_favorites > 0 && (
              <Stat
                icon={<Heart className="size-3.5 text-rose-300" />}
                value={formatNumber(anime.added_in_users_favorites)}
                label="избранное"
              />
            )}
            {totalViewers > 0 && (
              <Stat
                icon={<Tv2 className="size-3.5 text-sky-300" />}
                value={formatNumber(totalViewers)}
                label="в списках"
              />
            )}
            {anime.added_in_planned_collection > 0 && (
              <Stat
                icon={<Bookmark className="size-3.5 text-amber-300" />}
                value={formatNumber(anime.added_in_planned_collection)}
                label="в планах"
              />
            )}
          </div>
        )}

        {anime.description && (
          <p className="line-clamp-3 text-[11px] leading-relaxed text-zinc-400">
            {anime.description}
          </p>
        )}

        {anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {anime.genres.slice(0, 5).map((genre) => (
              <Link
                key={genre.id}
                href={`/catalog?genres=${genre.id}`}
                prefetch={false}
                className="rounded-md border border-white/[0.07] px-2 py-1 text-[9px] font-medium text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                {genre.name}
              </Link>
            ))}
            {anime.genres.length > 5 && (
              <span className="px-1 py-1 text-[9px] font-medium text-zinc-500">
                +{anime.genres.length - 5}
              </span>
            )}
          </div>
        )}

        <footer className="flex items-center justify-between gap-3 pt-0.5">
          {freshDate ? (
            <span className="flex min-w-0 items-center gap-1.5 text-[10px] text-zinc-500">
              <CalendarClock className="size-3 shrink-0" />
              <span className="truncate">Обновлено {freshDate}</span>
            </span>
          ) : (
            <span />
          )}
          <Link
            href={`/anime/${anime.alias}`}
            prefetch={false}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-zinc-100 px-4 text-[10px] font-bold text-zinc-950 transition-colors hover:bg-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <Play className="size-3 fill-current" />
            Смотреть
          </Link>
        </footer>
      </div>
    </HoverCardContent>
  );
};

const Stat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="inline-flex items-center gap-1.5">
    {icon}
    <span className="font-mono text-[10px] font-semibold tabular-nums text-zinc-200">{value}</span>
    <span className="text-[9px] text-zinc-500">{label}</span>
  </div>
);

const MetaChip = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.035] px-1.5 py-1 text-[9px] font-medium text-zinc-400">
    {icon}
    {children}
  </span>
);

export default AnimeHoverCard;
