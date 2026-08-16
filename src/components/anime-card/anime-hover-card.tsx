import Image from 'next/image';
import { HoverCardContent } from '@/components/ui/hover-card';
import { Anime } from '@/shared/types/anime';
import Link from 'next/link';
import { Bookmark, CalendarClock, Clock, Film, Heart, Play, Tv2 } from 'lucide-react';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL!;

const freshAtFormat = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

const formatFreshDate = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return freshAtFormat.format(date).replace(/\.$/, '');
};

const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
};

const AnimeHoverCard = ({ anime }: { anime: Anime }) => {
  const backdrop = anime.poster?.optimized?.src ?? anime.poster?.src;

  const totalViewers =
    anime.added_in_watching_collection +
    anime.added_in_planned_collection +
    anime.added_in_watched_collection +
    anime.added_in_postponed_collection +
    anime.added_in_abandoned_collection;

  const metaItems: string[] = [];
  if (anime.year) metaItems.push(String(anime.year));
  if (anime.season?.description) metaItems.push(anime.season.description);
  if (anime.type?.description) metaItems.push(anime.type.description);

  const freshDate = formatFreshDate(anime.fresh_at ?? anime.updated_at);

  return (
    <HoverCardContent
      side="right"
      align="start"
      sideOffset={14}
      className="w-[340px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border-white/[0.07] p-0"
    >
      <div className="relative h-29">
        <Image
          src={`${MEDIA_URL}${backdrop}`}
          alt=""
          fill
          quality={75}
          sizes="340px"
          className="object-cover object-[50%_20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b13]/30 via-transparent to-[#0b0b13]" />
      </div>

      <div className="space-y-3 px-4 pb-4 pt-3">
        <div className="space-y-1">
          <h3 className="line-clamp-2 text-[14px] font-bold leading-[1.35] tracking-[-0.005em] text-white">
            {anime.name?.main}
          </h3>

          {anime.name?.english && (
            <p className="line-clamp-1 text-[11px] font-medium text-white/35">
              {anime.name.english}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {metaItems.map((item) => (
            <MetaChip key={item}>{item}</MetaChip>
          ))}

          {anime.episodes_total && (
            <MetaChip icon={<Film className="h-3 w-3" />}>{anime.episodes_total} эп.</MetaChip>
          )}

          {anime.average_duration_of_episode > 0 && (
            <MetaChip icon={<Clock className="h-3 w-3" />}>
              ~{anime.average_duration_of_episode} мин.
            </MetaChip>
          )}

          {anime.age_rating?.label && <MetaChip>{anime.age_rating.label}</MetaChip>}
        </div>

        <div className="flex divide-x divide-white/[0.06] border-y border-white/[0.06] py-2.5">
          {anime.added_in_users_favorites > 0 && (
            <Stat
              icon={<Heart className="h-3.5 w-3.5 fill-rose-400/90 text-rose-400/90" />}
              value={formatNumber(anime.added_in_users_favorites)}
              label="избранных"
            />
          )}

          {totalViewers > 0 && (
            <Stat
              icon={<Tv2 className="h-3.5 w-3.5 text-sky-400/90" />}
              value={formatNumber(totalViewers)}
              label="в коллекциях"
            />
          )}

          {anime.added_in_planned_collection > 0 && (
            <Stat
              icon={<Bookmark className="h-3.5 w-3.5 text-amber-400/90" />}
              value={formatNumber(anime.added_in_planned_collection)}
              label="запланировали"
            />
          )}
        </div>

        {anime.description && (
          <p className="line-clamp-3 text-[11.5px] leading-[1.55] text-white/45">
            {anime.description}
          </p>
        )}

        {anime.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {anime.genres.slice(0, 5).map((genre) => (
              <Link
                key={genre.id}
                href={`/catalog?genres=${genre.id}`}
                prefetch={false}
                className="rounded-full bg-white/[0.05] px-2 py-[3px] text-[9.5px] font-semibold text-white/45 transition-colors duration-200 hover:bg-white/[0.09] hover:text-white/70"
              >
                {genre.name}
              </Link>
            ))}

            {anime.genres.length > 5 && (
              <span className="rounded-full px-1 py-[3px] text-[9.5px] font-semibold text-white/30">
                +{anime.genres.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
          {freshDate ? (
            <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-white/35">
              <CalendarClock className="h-3 w-3 shrink-0 text-white/25" />
              <span className="truncate">Обновлено {freshDate}</span>
            </div>
          ) : (
            <span />
          )}

          <Link
            href={`/anime/${anime.alias}`}
            prefetch={false}
            className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 text-[11px] font-bold text-zinc-950 transition-all duration-200 ease-out hover:bg-white/85 active:scale-[0.96]"
          >
            <Play className="h-3 w-3 fill-current" />
            Смотреть
          </Link>
        </div>
      </div>
    </HoverCardContent>
  );
};

const Stat = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <div className="flex flex-1 items-center gap-2 px-3 first:pl-0 last:pr-0">
    <span className="shrink-0">{icon}</span>
    <div className="flex min-w-0 flex-col gap-0.5 leading-none">
      <span className="text-[11px] font-semibold tabular-nums text-white/80">{value}</span>
      <span className="text-[8px] text-white/30">{label}</span>
    </div>
  </div>
);

const MetaChip = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/50">
    {icon}
    {children}
  </span>
);

export default AnimeHoverCard;
