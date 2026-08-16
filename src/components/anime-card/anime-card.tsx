import Image from '@/components/ui/image';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import { Anime } from '@/shared/types/anime';
import Link from 'next/link';
import { Play } from 'lucide-react';

import AnimeHoverCard from './anime-hover-card';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL!;

interface Props {
  anime: Anime;
}

const AnimeCard = ({ anime }: Props) => {
  const poster = anime.poster?.optimized?.src ?? anime.poster?.src;
  const title = anime.name?.main ?? 'Постер';

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={150}
        closeDelay={150}
        render={<Link href={`/anime/${anime.alias}`} />}
      >
        <div className="group relative flex flex-col">
          <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg">
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

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-2">
              {anime.is_in_production ? (
                <Badge
                  variant="secondary"
                  className="h-5 gap-1.5 rounded-md border-emerald-400/15 bg-black/65 px-2 text-[9px] font-semibold uppercase tracking-wider text-emerald-300/90"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Онгоинг
                </Badge>
              ) : (
                <span />
              )}

              <div className="hidden items-center gap-1 sm:flex">
                {anime.type?.description && (
                  <Badge
                    variant="secondary"
                    className="h-5 rounded-md border-white/10 bg-black/55 px-1.5 text-[10px] font-medium text-white/85"
                  >
                    {anime.type.description}
                  </Badge>
                )}

                {anime.age_rating?.label && (
                  <Badge
                    variant="secondary"
                    className="h-5 rounded-md border-white/10 bg-black/55 px-1.5 text-[10px] font-medium text-white/85"
                  >
                    {anime.age_rating.label}
                  </Badge>
                )}
              </div>
            </div>

            {anime.latest_episode && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center p-2.5 opacity-0 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100">
                <span className="flex items-center gap-1.5 rounded-md bg-white/15 px-2 py-1 text-[10px] font-semibold text-white">
                  <Play className="h-2.5 w-2.5 fill-white" />
                  {anime.latest_episode.ordinal} эп.
                </span>
              </div>
            )}
          </div>

          <h3 className="mt-2 line-clamp-2 px-0.5 text-[13px] font-semibold leading-snug text-white/85 transition-colors duration-300 group-hover:text-primary">
            {title}
          </h3>
        </div>
      </HoverCardTrigger>

      <AnimeHoverCard anime={anime} />
    </HoverCard>
  );
};

export default AnimeCard;
