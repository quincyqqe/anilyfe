import { Anime } from '@/shared/types/anime';
import { AnimeCollectionButton } from './components/anime-collection-button';
import { AnimeGenres } from './components/anime-genres';
import { AnimeHero } from './components/anime-hero';
import { AnimeMetaChips } from './components/anime-meta-chips';
import { AnimeStats } from './components/anime-stats';
import { AnimeTeam } from './components/anime-team';

import Image from '@/components/ui/image';
import { FranchiseItem } from '@/shared/types/franchise';
import { UserAnimeListEntry } from '@/shared/types/user-anime-list';
import { AnimeFranchise } from './components/anime-franchise';
import { AnimeDescription } from './components/anime-description';

interface Props {
  anime: Anime;
  franchise: FranchiseItem | null;
  animeList: UserAnimeListEntry | null;
}
export function AnimeInfo({ anime, franchise, animeList }: Props) {
  return (
    <main className="pt-28">
      <AnimeHero posterSrc={anime.poster.optimized.src} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 ">
          <aside className="flex flex-col gap-5">
            <div className="relative mx-auto h-77 w-55 shrink-0 lg:h-92.5 lg:w-full">
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${anime.poster.optimized.src}`}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1024px) 220px, 320px"
                className="absolute inset-0 -z-10 scale-105 rounded-sm object-cover opacity-70 blur-xl"
              />
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${anime.poster.src}`}
                alt={anime.name.main}
                fill
                preload
                quality={75}
                sizes="(max-width: 1024px) 220px, 320px"
                className="relative z-10 rounded-sm border border-white/8 object-cover"
                id="anime-poster"
              />
            </div>

            <AnimeCollectionButton anime={anime} animeEntry={animeList} />

            <div className="p-4 glass">
              <AnimeStats anime={anime} />
            </div>

            {anime.members.length > 0 && (
              <div className="p-4 glass">
                <AnimeTeam members={anime.members} />
              </div>
            )}
          </aside>

          <section className="flex flex-col gap-5.5 pt-6 ">
            <header className="flex flex-col gap-1.5">
              <h1
                className="text-xl md:text-4xl font-bold text-zinc-50 leading-tight line-clamp-2"
                id="anime-title"
              >
                {anime.name.main}
              </h1>
              {!!anime.name.english && (
                <span className="text-sm md:text-base text-zinc-400 font-medium">
                  {anime.name.english}
                </span>
              )}
            </header>

            <AnimeMetaChips anime={anime} />

            <div className="flex flex-col gap-3">
              <SectionLabel>Жанры</SectionLabel>
              <AnimeGenres genres={anime.genres} />
            </div>

            <AnimeDescription anime={anime} />

            {franchise && (
              <div className="flex flex-col gap-3">
                <AnimeFranchise franchise={franchise} currentReleaseId={anime.id} />
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
      {children}
    </span>
  );
}
