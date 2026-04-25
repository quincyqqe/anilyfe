import Image from '@/components/ui/image';
import { Anime } from '@/shared/types/anime';
import Link from 'next/link';
import CardOverlay from './anime-card-overlay';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL!;

const AnimeCard = ({ anime }: { anime: Anime }) => {
  const poster = anime.poster?.optimized?.src || anime.poster?.src;
  const title = anime.name?.main || 'Постер';

  return (
    <Link
      href={`/anime/${anime.alias}`}
      style={{ contain: 'layout paint' }}
      className="group relative flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-2xl">
       <div className="absolute inset-0 will-change-transform transition-transform duration-500 ease-out group-hover:scale-[1.05]">
          <Image
            src={`${MEDIA_URL}${poster}`}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-2.5">
          <StatusPill isOngoing={anime.is_in_production} />

          <div className="flex items-center gap-1.5">
            {anime.type?.description && <Badge>{anime.type.description}</Badge>}
            {anime.age_rating?.label && <Badge>{anime.age_rating.label}</Badge>}
          </div>
        </div>

        <CardOverlay anime={anime} />
      </div>

      <div className="mt-2 px-0.5 pb-1 flex flex-col gap-1">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-white/90 transition-colors duration-300 group-hover:text-primary">
          {title}
        </h3>
      </div>
    </Link>
  );
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 rounded-md border border-white/10 bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white/80">
    {children}
  </span>
);

const StatusPill = ({ isOngoing }: { isOngoing: boolean }) => {
  if (!isOngoing) return null;

  return (
    <span className="flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-[5px] text-[9px] font-semibold uppercase tracking-wider text-white/80 border border-white/10">
      <span className="relative flex items-center justify-center w-[6px] h-[6px]">
        <span className="absolute w-full h-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
        <span className="w-[6px] h-[6px] rounded-full bg-emerald-400" />
      </span>

      <span className="leading-none">Онгоинг</span>
    </span>
  );
};

export default AnimeCard;
