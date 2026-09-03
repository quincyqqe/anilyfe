'use client';

import { Heart, Play, Star, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry, WatchStatus } from '@/features/profile/types/profile';
import { STATUS_LABEL } from '../../model/anime-list/constants';
import { getAnimeHref, getAnimePosterSrc, getAnimeProgress } from '../../model/anime-list/helpers';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';
export type CardVariant =
  | 'hud'
  | 'billboard'
  | 'stream'
  | 'split'
  | 'glass'
  | 'bento'
  | 'index'
  | 'wall'
  | 'spotlight'
  | 'terminal';
export const CARD_VARIANTS: { key: CardVariant; label: string; description: string }[] = [
  { key: 'hud', label: 'HUD', description: 'Технический интерфейс' },
  { key: 'billboard', label: 'Billboard', description: 'Большая витрина стриминга' },
  { key: 'stream', label: 'Stream', description: 'Карточка как в видеосервисе' },
  { key: 'split', label: 'Split', description: 'Постер и данные на одной оси' },
  { key: 'glass', label: 'Glass', description: 'Мягкая премиальная панель' },
  { key: 'bento', label: 'Bento', description: 'Модульная медиакарточка' },
  { key: 'index', label: 'Index', description: 'Каталожная карточка архива' },
  { key: 'wall', label: 'Wall', description: 'Постерная галерея без рамок' },
  { key: 'spotlight', label: 'Spotlight', description: 'Фокус на одном тайтле' },
  { key: 'terminal', label: 'Terminal', description: 'Моноширинный data-first стиль' },
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
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-xs',
        light ? 'text-foreground/75' : 'text-muted-foreground',
      )}
    >
      <span className="flex items-center gap-1">
        <Play className="size-3 fill-current" aria-hidden="true" />
        {progress.totalEpisodes > 0
          ? `${progress.currentEpisode}/${progress.totalEpisodes}`
          : `Серия ${progress.currentEpisode}`}
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
const linkClass =
  'block outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background';
const posterSizes = '(min-width:1280px) 190px, (min-width:768px) 22vw, 44vw';

function HudCard({ anime, priority = false }: Props) {
  const progress = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link href={getAnimeHref(anime)} className={linkClass}>
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
function BillboardCard({ anime, priority = false }: Props) {
  return (
    <article className="group min-w-0">
      <Link href={getAnimeHref(anime)} className={linkClass}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes={posterSizes}
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-x-0 bottom-0 bg-background/90 p-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              {STATUS_LABEL[anime.status]}
            </span>
            <h3 className="mt-1 line-clamp-2 text-sm font-bold">{anime.anime_name}</h3>
          </div>
          <div className="absolute right-2 top-2 rounded-full bg-foreground px-2 py-1 text-[10px] font-bold text-background">
            HD
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Meta anime={anime} />
          <Favourite anime={anime} />
        </div>
        <Progress anime={anime} className="mt-2" />
      </Link>
    </article>
  );
}
function StreamCard({ anime, priority = false }: Props) {
  const p = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link href={getAnimeHref(anime)} className={linkClass}>
        <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
          <Poster anime={anime} priority={priority} sizes={posterSizes} />
          <div className="absolute inset-0 bg-background/10 transition-colors group-hover:bg-transparent" />
          <span className="absolute bottom-2 left-2 rounded bg-background/90 px-2 py-1 text-[10px] font-semibold">
            {p.currentEpisode > 0 ? `Серия ${p.currentEpisode}` : 'Начать'}
          </span>
        </div>
        <h3 className="mt-3 line-clamp-2 text-sm font-semibold group-hover:text-primary">
          {anime.anime_name}
        </h3>
        <div className="mt-2 flex justify-between">
          <Meta anime={anime} />
          <span className="text-[10px] text-muted-foreground">{STATUS_LABEL[anime.status]}</span>
        </div>
      </Link>
    </article>
  );
}
function SplitCard({ anime, priority = false }: Props) {
  const p = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(linkClass, 'flex gap-3 border-b-2 border-primary/60 pb-3')}
      >
        <div className="relative aspect-[2/3] w-24 shrink-0 overflow-hidden bg-muted">
          <Poster anime={anime} priority={priority} sizes="96px" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
          <div className="flex justify-between gap-2">
            <span className="font-mono text-[10px] uppercase text-primary">
              {STATUS_LABEL[anime.status]}
            </span>
            <Favourite anime={anime} />
          </div>
          <h3 className="line-clamp-3 text-base font-bold leading-5 group-hover:text-primary">
            {anime.anime_name}
          </h3>
          <div>
            <Meta anime={anime} />
            <Progress anime={anime} className="mt-2" />
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              UPDATED {new Date(anime.updated_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
function GlassCard({ anime, priority = false }: Props) {
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          linkClass,
          'rounded-2xl border border-border/70 bg-card/60 p-2 backdrop-blur-sm transition-colors hover:border-primary/70',
        )}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes={posterSizes}
            className="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 rounded-full bg-background/80 px-2 py-1 text-[10px]">
            {STATUS_LABEL[anime.status]}
          </div>
        </div>
        <div className="px-2 pb-1 pt-3">
          <div className="flex justify-between gap-2">
            <h3 className="truncate text-sm font-semibold group-hover:text-primary">
              {anime.anime_name}
            </h3>
            <Favourite anime={anime} />
          </div>
          <Meta anime={anime} />
          <Progress anime={anime} className="mt-2" />
        </div>
      </Link>
    </article>
  );
}
function BentoCard({ anime, priority = false }: Props) {
  const p = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          linkClass,
          'grid grid-cols-[1fr_72px] gap-3 rounded-lg border border-border bg-muted/30 p-3 hover:bg-muted/60',
        )}
      >
        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Zap className="size-3 text-primary" /> {STATUS_LABEL[anime.status]}
            </div>
            <h3 className="mt-2 line-clamp-3 text-sm font-bold">{anime.anime_name}</h3>
          </div>
          <div>
            <Meta anime={anime} />
            <Progress anime={anime} className="mt-2" />
          </div>
        </div>
        <div className="relative aspect-[2/3] overflow-hidden rounded bg-muted">
          <Poster anime={anime} priority={priority} sizes="72px" />
        </div>
      </Link>
    </article>
  );
}
function IndexCard({ anime, priority = false }: Props) {
  const p = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(linkClass, 'border-t-4 border-foreground pt-3')}
      >
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-mono text-2xl font-bold text-primary">
            {String(p.currentEpisode).padStart(2, '0')}
          </span>
          <Favourite anime={anime} />
        </div>
        <div className="relative mt-2 aspect-[3/4] overflow-hidden bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes={posterSizes}
            className="transition-[filter] duration-300 group-hover:brightness-110"
          />
        </div>
        <h3 className="mt-3 line-clamp-2 font-serif text-lg leading-5">{anime.anime_name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {STATUS_LABEL[anime.status]} · {p.totalEpisodes || '∞'} серий
        </p>
      </Link>
    </article>
  );
}
function WallCard({ anime, priority = false }: Props) {
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(linkClass, 'relative block aspect-[2/3] overflow-hidden bg-muted')}
      >
        <Poster
          anime={anime}
          priority={priority}
          sizes={posterSizes}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 translate-y-1 bg-background/95 p-3 transition-transform duration-300 group-hover:translate-y-0">
          <h3 className="truncate text-sm font-semibold">{anime.anime_name}</h3>
          <div className="mt-1 flex justify-between">
            <Meta anime={anime} light />
            <Favourite anime={anime} />
          </div>
        </div>
        <span
          className="absolute left-2 top-2 size-2 rounded-full border border-background"
          style={{ backgroundColor: 'currentColor' }}
          aria-label={STATUS_LABEL[anime.status]}
        />
      </Link>
    </article>
  );
}
function SpotlightCard({ anime, priority = false }: Props) {
  const p = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          linkClass,
          'relative block overflow-hidden rounded-xl border border-primary/30 bg-card',
        )}
      >
        <div className="relative aspect-[2/3] bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes={posterSizes}
            className="transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
        </div>
        <div className="relative -mt-10 mx-2 rounded-lg border border-border bg-card/95 p-3">
          <div className="flex justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Continue watching
            </span>
            <Favourite anime={anime} />
          </div>
          <h3 className="mt-2 line-clamp-2 text-base font-bold">{anime.anime_name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {p.currentEpisode} серия из {p.totalEpisodes || '∞'}
          </p>
          <Progress anime={anime} className="mt-3" />
        </div>
      </Link>
    </article>
  );
}
function TerminalCard({ anime, priority = false }: Props) {
  const p = getAnimeProgress(anime);
  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          linkClass,
          'border border-border bg-background p-3 font-mono hover:border-primary',
        )}
      >
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>MEDIA_NODE_{String(anime.current_episode).padStart(3, '0')}</span>
          <Favourite anime={anime} />
        </div>
        <div className="relative mt-3 aspect-video overflow-hidden bg-muted">
          <Poster
            anime={anime}
            priority={priority}
            sizes={posterSizes}
            className="opacity-80 transition-opacity group-hover:opacity-100"
          />
        </div>
        <h3 className="mt-3 truncate text-xs font-bold text-primary">&gt; {anime.anime_name}</h3>
        <div className="mt-2 grid grid-cols-2 gap-1 text-[10px] text-muted-foreground">
          <span>STATUS: {STATUS_LABEL[anime.status]}</span>
          <span className="text-right">EP: {p.currentEpisode}</span>
          <span>SCORE: {anime.score || '--'}</span>
          <span className="text-right">READY</span>
        </div>
        <Progress anime={anime} className="mt-3" />
      </Link>
    </article>
  );
}

export function ProfileAnimeCard({ anime, priority = false, variant = 'hud' }: Props) {
  const cards = {
    hud: HudCard,
    billboard: BillboardCard,
    stream: StreamCard,
    split: SplitCard,
    glass: GlassCard,
    bento: BentoCard,
    index: IndexCard,
    wall: WallCard,
    spotlight: SpotlightCard,
    terminal: TerminalCard,
  };
  const Card = cards[variant];
  return <Card anime={anime} priority={priority} variant={variant} />;
}
