'use client';

import { Archive, Heart, Play, Star } from 'lucide-react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry, WatchStatus } from '@/features/profile/types/profile';
import { STATUS_LABEL } from '../../model/anime-list/constants';
import { getAnimeHref, getAnimePosterSrc, getAnimeProgress } from '../../model/anime-list/helpers';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

export type CardVariant = 'cinema' | 'editorial' | 'hud' | 'compact' | 'dossier';

export const CARD_VARIANTS: { key: CardVariant; label: string; description: string }[] = [
  { key: 'cinema', label: 'Ticket', description: 'Билет в киноархив' },
  { key: 'editorial', label: 'Magazine', description: 'Обложка журнала' },
  { key: 'hud', label: 'HUD', description: 'Технический медиа-интерфейс' },
  { key: 'compact', label: 'Stack', description: 'Стопка коллекционных карточек' },
  { key: 'dossier', label: 'Archive', description: 'Архивная карточка-досье' },
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
      {typeof anime.score === 'number' && anime.score > 0 && (
        <span className="flex items-center gap-1 text-amber-300">
          <Star className="size-3 fill-current" aria-hidden="true" />
          {anime.score}
        </span>
      )}
    </div>
  );
}

function Progress({ anime, className }: { anime: UserAnimeEntry; className?: string }) {
  const percent = getAnimeProgress(anime);
  if (percent.totalEpisodes <= 0) return null;
  return (
    <div
      className={cn('h-1 overflow-hidden rounded-full bg-muted', className)}
      aria-label={`Прогресс ${Math.round(percent.seriesPercent)}%`}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-300"
        style={{ width: `${percent.seriesPercent}%` }}
      />
    </div>
  );
}

function Favourite({ anime }: { anime: UserAnimeEntry }) {
  return anime.is_favourite ? (
    <Heart className="size-4 fill-rose-400 text-rose-400" aria-label="В избранном" />
  ) : null;
}

const linkClass =
  'block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background';
const posterSizes = '(min-width:1280px) 190px, (min-width:768px) 22vw, 44vw';

function CinemaCard({ anime, priority = false }: Props) {
  const progress = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link href={getAnimeHref(anime)} className={linkClass}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-[2px] border border-border bg-muted shadow-[6px_6px_0_hsl(var(--muted))]">
          <Poster
            anime={anime}
            priority={priority}
            sizes={posterSizes}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-0 top-0 bg-primary px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-primary-foreground">
            ADMIT ONE
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between border-t border-border bg-background/90 p-3">
            <div>
              <p className="font-mono text-[10px] uppercase text-muted-foreground">
                {STATUS_LABEL[anime.status]}
              </p>
              <h3 className="mt-1 line-clamp-2 text-sm font-bold">{anime.anime_name}</h3>
            </div>
            <span className="font-mono text-xs text-primary">
              {String(progress.currentEpisode).padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3">
          <Meta anime={anime} />
          <Favourite anime={anime} />
        </div>
        <Progress anime={anime} className="mt-2" />
      </Link>
    </article>
  );
}

function EditorialCard({ anime, priority = false }: Props) {
  return (
    <article className="group min-w-0">
      <Link href={getAnimeHref(anime)} className={linkClass}>
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes={posterSizes}
            className="grayscale transition-[filter,transform] duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
          <div className="absolute left-3 top-3 bg-background px-2 py-1 font-mono text-[10px] uppercase tracking-widest">
            № {String(anime.current_episode).padStart(2, '0')}
          </div>
        </div>
        <div className="border-b-2 border-foreground py-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>{STATUS_LABEL[anime.status]}</span>
            <Favourite anime={anime} />
          </div>
          <h3 className="mt-2 line-clamp-2 min-h-10 font-serif text-lg leading-5 group-hover:text-primary">
            {anime.anime_name}
          </h3>
          <div className="mt-3 flex justify-between">
            <Meta anime={anime} />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Anime weekly
            </span>
          </div>
          <Progress anime={anime} className="mt-3" />
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
            sizes={posterSizes}
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
  const progress = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          linkClass,
          'relative flex gap-4 border-b border-border bg-card/20 py-3 pl-3 pr-2 hover:bg-muted/40',
        )}
      >
        <div className="relative size-20 shrink-0 overflow-hidden bg-muted">
          <Poster anime={anime} priority={priority} sizes="80px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {String(progress.currentEpisode).padStart(2, '0')} / {progress.totalEpisodes || '∞'}
            </span>
            <Favourite anime={anime} />
          </div>
          <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 group-hover:text-primary">
            {anime.anime_name}
          </h3>
          <div className="mt-2 flex items-center justify-between">
            <Meta anime={anime} />
            <span
              className={cn('size-2 rounded-full', STATUS_DOT[anime.status])}
              title={STATUS_LABEL[anime.status]}
            />
          </div>
          <Progress anime={anime} className="mt-2" />
        </div>
        <span className="absolute bottom-0 left-0 top-0 w-0.5 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
      </Link>
    </article>
  );
}

function DossierCard({ anime, priority = false }: Props) {
  const progress = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          linkClass,
          'border border-dashed border-border p-3 transition-colors hover:border-primary',
        )}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              FILE / {anime.anime_slug}
            </p>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 group-hover:text-primary">
              {anime.anime_name}
            </h3>
          </div>
          <Archive className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="relative aspect-[5/3] overflow-hidden bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes={posterSizes}
            className="transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border pt-3 font-mono text-[10px] uppercase text-muted-foreground">
          <span>
            Status <b className="text-foreground">{STATUS_LABEL[anime.status]}</b>
          </span>
          <span>
            Episode <b className="text-foreground">{progress.currentEpisode}</b>
          </span>
          <span>
            Score <b className="text-foreground">{anime.score || '—'}</b>
          </span>
          <span className="flex justify-end">
            <Favourite anime={anime} />
          </span>
        </div>
        <Progress anime={anime} className="mt-3" />
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
