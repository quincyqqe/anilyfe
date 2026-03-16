import { Anime } from '@/shared/types/anime';
import { AnimeHero } from './components/anime-hero';
import { AnimeMetaChips } from './components/anime-meta-chips';
import { AnimeGenres } from './components/anime-genres';
import { AnimeTeam } from './components/anime-team';
import { AnimeCollectionButton } from './components/anime-collection-button';
import { AnimeStats } from './components/anime-stats';

import Image from '@/components/ui/image';
import { FranchiseItem } from '@/shared/types/franchise';
import { AnimeFranchise } from './components/anime-franchise';
import { UserAnimeListEntry } from '@/shared/types/user-anime-list';

interface Props {
  anime: Anime;
  franchise: FranchiseItem | null;
  animeList: UserAnimeListEntry;
}

export function AnimeInfo({ anime, franchise, animeList }: Props) {
  const posterUrl = `https://aniliberty.top${anime.poster.optimized.src}`;

  return (
    <main className="pt-28">
      <AnimeHero posterSrc={anime.poster.optimized.src} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 ">
          <aside className="flex flex-col gap-5">
            <div className="relative mx-auto shrink-0 w-[220px] lg:w-full h-[310px] lg:h-[370px]">
              <Image
                src={posterUrl}
                alt=""
                aria-hidden
                width={32}
                height={48}
                quality={1}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover rounded-2xl scale-110 blur-2xl opacity-50 -z-10"
              />
              <Image
                src={`https://aniliberty.top${anime.poster.src}`}
                alt={anime.name.main}
                width={260}
                height={370}
                priority
                className="relative w-full h-full object-cover rounded-2xl border border-white/8 shadow-2xl z-10"
                id="anime-poster"
              />

              {anime.is_in_production && (
                <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Онгоинг
                </span>
              )}
            </div>

            <AnimeCollectionButton anime={anime} animeEntry={animeList} />

            <div className="rounded-2xl border border-white/6 bg-white/3 p-4 backdrop-blur-sm">
              <AnimeStats anime={anime} />
            </div>

            {anime.members.length > 0 && (
              <div className="rounded-2xl border border-white/6 bg-white/3 p-4 backdrop-blur-sm">
                <AnimeTeam members={anime.members} />
              </div>
            )}
          </aside>

          <section className="flex flex-col gap-5.5 pt-6 ">
            <header className="flex flex-col gap-1.5">
              <h1
                className="text-4xl font-bold text-zinc-50 leading-tight text-balance line-clamp-2"
                id="anime-title"
              >
                {anime.name.main}
              </h1>
              {!!anime.name.english && (
                <span className="text-base text-zinc-400 font-medium">{anime.name.english}</span>
              )}
            </header>

            <AnimeMetaChips anime={anime} />

            <div className="flex flex-col gap-3">
              <SectionLabel>Жанры</SectionLabel>
              <AnimeGenres genres={anime.genres} />
            </div>

            {anime.description && (
              <div className="flex flex-col gap-3 ">
                <SectionLabel>Описание</SectionLabel>
                <div className="rounded-2xl border border-white/6 bg-white/2 p-5 backdrop-blur-sm ">
                  <p className="text-sm text-zinc-400 leading-relaxed text-pretty ">
                    {anime.description}
                  </p>
                </div>
              </div>
            )}

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
