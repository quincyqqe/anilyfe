import Image from '@/components/ui/image';
import { Anime } from '@/shared/types/anime';
import Link from 'next/link';
import CardOverlay from './anime-card-overlay';


const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL!;

interface Props {
  anime: Anime;
}

const AnimeCard = ({ anime }: Props) => {
  const poster = anime.poster?.optimized?.src ?? anime.poster?.src;
  const title = anime.name?.main ?? 'Постер';

  return (
    <Link href={`/anime/${anime.alias}`} className="group relative flex flex-col">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-sm">
        <div className="absolute inset-0">
          <Image
            src={`${MEDIA_URL}${poster}`}
            alt={title}
            fill
            quality={75}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
            className="object-cover"

          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-2.5">
          <StatusPill isOngoing={anime.is_in_production} />
          <div className="hidden items-center gap-1.5 sm:flex ">
            {anime.type?.description && <Badge>{anime.type.description}</Badge>}
            {anime.age_rating?.label && <Badge>{anime.age_rating.label}</Badge>}
          </div>
        </div>

        <CardOverlay anime={anime} />
      </div>

      <h3 className="mt-2 px-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-white/90 transition-colors duration-300 group-hover:text-primary">
        {title}
      </h3>
    </Link>
  );
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="shrink-0 rounded-md border border-white/10 bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white/90">
    {children}
  </span>
);

const StatusPill = ({ isOngoing }: { isOngoing: boolean }) => {
  if (!isOngoing) return null;

  return (
    <span className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/60 px-2 py-1.25 text-[9px] font-semibold uppercase tracking-wider text-white/80">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
        <span className="relative h-full w-full rounded-full bg-emerald-400" />
      </span>
      Онгоинг
    </span>
  );
};

export default AnimeCard;
