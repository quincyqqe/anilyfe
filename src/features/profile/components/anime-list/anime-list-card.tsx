'use client';

import { Heart, Play, Star } from 'lucide-react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry, WatchStatus } from '@/features/profile/types/profile';
import { STATUS_LABEL } from '../../model/anime-list/constants';
import { getAnimeHref, getAnimePosterSrc, getAnimeProgress } from '../../model/anime-list/helpers';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

export type CardVariant = 'cinema' | 'editorial' | 'hud' | 'compact' | 'dossier';

export const CARD_VARIANTS: { key: CardVariant; label: string; description: string }[] = [
  { key: 'cinema', label: 'Cinema', description: 'Постер как главный герой' },
  { key: 'editorial', label: 'Editorial', description: 'Спокойная журнальная подача' },
  { key: 'hud', label: 'HUD', description: 'Технический медиа-интерфейс' },
  { key: 'compact', label: 'Compact', description: 'Максимум информации в минимуме места' },
  { key: 'dossier', label: 'Dossier', description: 'Премиальная карточка-досье' },
];

const STATUS_DOT: Record<WatchStatus, string> = {
  watching: 'bg-blue-400',
  completed: 'bg-emerald-400',
  on_hold: 'bg-amber-400',
  dropped: 'bg-red-400',
  planned: 'bg-violet-400',
};

interface Props {
  anime: UserAnimeEntry;
  priority?: boolean;
  variant?: CardVariant;
}

function Poster({
  anime,
  priority,
  className,
  sizes,
}: {
  anime: UserAnimeEntry;
  priority: boolean;
  className?: string;
  sizes: string;
}) {
  return (
    <Image
      src={getAnimePosterSrc(anime, MEDIA_URL)}
      alt={anime.anime_name || 'Постер аниме'}
      fill
      priority={priority}
      className={cn('object-cover', className)}
      sizes={sizes}
    />
  );
}

function Meta({ anime, light = false }: { anime: UserAnimeEntry; light?: boolean }) {
  const progress = getAnimeProgress(anime);
  const hasScore = typeof anime.score === 'number' && anime.score > 0;
  const episode =
    progress.totalEpisodes > 0
      ? `${progress.currentEpisode}/${progress.totalEpisodes}`
      : `Серия ${progress.currentEpisode}`;

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs',
        light ? 'text-foreground/75' : 'text-muted-foreground',
      )}
    >
      <span className="flex items-center gap-1">
        <Play className="size-3 fill-current" aria-hidden="true" />
        {episode}
      </span>
      {hasScore && (
        <span className="flex items-center gap-1 text-amber-300">
          <Star className="size-3 fill-current" aria-hidden="true" />
          {anime.score}
        </span>
      )}
    </div>
  );
}

function Progress({ anime, className }: { anime: UserAnimeEntry; className?: string }) {
  const progress = getAnimeProgress(anime);
  if (progress.totalEpisodes <= 0) return null;
  return (
    <div
      className={cn('h-1 overflow-hidden rounded-full bg-muted', className)}
      aria-label={`Прогресс ${Math.round(progress.seriesPercent)}%`}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-300"
        style={{ width: `${progress.seriesPercent}%` }}
      />
    </div>
  );
}

function Favourite({ anime }: { anime: UserAnimeEntry }) {
  return anime.is_favourite ? (
    <Heart className="size-4 fill-rose-400 text-rose-400" aria-label="В избранном" />
  ) : null;
}

function CinemaCard({ anime, priority = false }: Props) {
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes="(min-width:1280px) 190px, (min-width:768px) 22vw, 44vw"
            className="transition-transform duration-300 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/65 to-transparent px-3 pb-3 pt-16">
            <div className="flex items-center gap-2 text-xs">
              <span className={cn('size-1.5 rounded-full', STATUS_DOT[anime.status])} />
              <span className="truncate text-foreground/80">{STATUS_LABEL[anime.status]}</span>
              <Favourite anime={anime} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-3">
          <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-primary">
            {anime.anime_name}
          </h3>
          <Meta anime={anime} />
          <Progress anime={anime} />
        </div>
      </Link>
    </article>
  );
}

function EditorialCard({ anime, priority = false }: Props) {
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes="(min-width:1280px) 190px, (min-width:768px) 22vw, 44vw"
            className="transition-transform duration-300 group-hover:scale-[1.025]"
          />
        </div>
        <div className="border-b border-border/70 py-3">
          <div className="mb-2 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className={cn('size-1.5 rounded-full', STATUS_DOT[anime.status])} />
              {STATUS_LABEL[anime.status]}
            </span>
            <Favourite anime={anime} />
          </div>
          <h3 className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 group-hover:text-primary">
            {anime.anime_name}
          </h3>
          <div className="mt-2">
            <Meta anime={anime} />
          </div>
          <Progress anime={anime} className="mt-2" />
        </div>
      </Link>
    </article>
  );
}

function HudCard({ anime, priority = false }: Props) {
  const progress = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[2/3] overflow-hidden border border-border/70 bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes="(min-width:1280px) 190px, (min-width:768px) 22vw, 44vw"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex items-center gap-1.5 bg-background/85 px-2 py-1 font-mono text-[10px] text-foreground">
            <span className={cn('size-1.5 rounded-full', STATUS_DOT[anime.status])} />
            {String(progress.currentEpisode).padStart(2, '0')}
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-muted">
            <div
              className="h-full bg-primary"
              style={{ width: `${progress.seriesPercent || 3}%` }}
            />
          </div>
        </div>
        <div className="flex items-start justify-between gap-2 border-x border-b border-border/70 bg-card/40 p-2.5">
          <div className="min-w-0">
            <h3 className="truncate text-xs font-semibold group-hover:text-primary">
              {anime.anime_name}
            </h3>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {STATUS_LABEL[anime.status]} ·{' '}
              {progress.totalEpisodes > 0
                ? `${progress.currentEpisode}/${progress.totalEpisodes}`
                : 'ONGOING'}
            </p>
          </div>
          <Favourite anime={anime} />
        </div>
      </Link>
    </article>
  );
}

function CompactCard({ anime, priority = false }: Props) {
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className="flex gap-3 rounded-lg border border-border/60 bg-card/35 p-2 outline-none transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-md bg-muted">
          <Poster anime={anime} priority={priority} sizes="80px" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className={cn('size-1.5 rounded-full', STATUS_DOT[anime.status])} />
                {STATUS_LABEL[anime.status]}
              </span>
              <Favourite anime={anime} />
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 group-hover:text-primary">
              {anime.anime_name}
            </h3>
          </div>
          <div className="flex flex-col gap-2">
            <Meta anime={anime} />
            <Progress anime={anime} />
          </div>
        </div>
      </Link>
    </article>
  );
}

function DossierCard({ anime, priority = false }: Props) {
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className="block overflow-hidden rounded-2xl border border-border/60 bg-card/45 outline-none transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes="(min-width:1280px) 190px, (min-width:768px) 22vw, 44vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/10" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span
                className={cn(
                  'rounded-full border border-border/70 bg-background/65 px-2 py-1 text-[10px] text-foreground/80',
                )}
              >
                {STATUS_LABEL[anime.status]}
              </span>
              <Favourite anime={anime} />
            </div>
            <h3 className="line-clamp-2 text-base font-semibold leading-5">{anime.anime_name}</h3>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 p-3">
          <Meta anime={anime} light />
          <Progress anime={anime} className="max-w-16 flex-1" />
        </div>
      </Link>
    </article>
  );
}

export function ProfileAnimeCard({ anime, priority = false, variant = 'cinema' }: Props) {
  const cards = {
    cinema: CinemaCard,
    editorial: EditorialCard,
    hud: HudCard,
    compact: CompactCard,
    dossier: DossierCard,
  };
  const Card = cards[variant];
  return <Card anime={anime} priority={priority} variant={variant} />;
}
