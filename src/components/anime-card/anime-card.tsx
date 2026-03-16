import Image from '@/components/ui/image';
import Link from 'next/link';
import { Anime } from '@/shared/types/anime';
import CardOverlay from './anime-card-overlay';

const AnimeCard = ({ anime }: { anime: Anime }) => (
  <Link
    href={`/anime/${anime.alias}`}
    className="group relative flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
  >
    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-white/5">
      <div className="absolute inset-0 will-change-transform transition-transform duration-500 ease-out group-hover:scale-[1.06]">
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${anime.poster.optimized.src}`}
          alt={anime.name.main || 'Постер'}
          className="object-cover"
          fill
          preload
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
        />
      </div>

      <div className="absolute inset-0 z-10 pointer-events-none">
        {anime.age_rating && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {anime.age_rating.label}
          </div>
        )}
      </div>

      <CardOverlay anime={anime} />
    </div>

    <div className="mt-2 px-0.5 pb-1 flex flex-col gap-1">
      <h3 className="text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-primary transition-colors duration-200">
        {anime.name.main}
      </h3>
      <div className="flex items-center gap-1 text-[11px] text-white/40">
        <span>{anime.type?.description}</span>
        {anime.year && (
          <>
            <span className="text-white/20">·</span>
            <span className="text-white/60 font-medium">{anime.year}</span>
          </>
        )}
        {!anime.episodes_are_unknown && anime.episodes_total && (
          <>
            <span className="text-white/20">·</span>
            <span>{anime.episodes_total} эп.</span>
          </>
        )}
      </div>
    </div>
  </Link>
);

export default AnimeCard;
