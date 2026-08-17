import Image from '@/components/ui/image';
import { Backlight } from '@/components/ui/backlight';

import type { Anime } from '@/shared/types/anime';
import type { FranchiseItem } from '@/shared/types/franchise';
import type { UserAnimeListEntry } from '@/shared/types/user-anime-list';

import { AnimeCollectionButton } from './components/anime-collection-button';
import { AnimeDescription } from './components/anime-description';
import { AnimeFranchise } from './components/anime-franchise';
import { AnimeGenres } from './components/anime-genres';
import { AnimeHero } from './components/anime-hero';
import { AnimeMetaChips } from './components/anime-meta-chips';
import { AnimeStats } from './components/anime-stats';
import { AnimeTeam } from './components/anime-team';

interface Props {
  anime: Anime;
  franchise: FranchiseItem | null;
  animeEntry: UserAnimeListEntry | null;
}

export function AnimeInfo({ anime, franchise, animeEntry }: Props) {
  const posterSrc = anime.poster.optimized.src;
  

  return (
    <main className="pt-10 md:pt-28">
      <AnimeHero posterSrc={posterSrc} />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="flex flex-col gap-5">
            <div className="relative mx-auto w-55 shrink-0 lg:w-full">
              <Backlight>
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${posterSrc}`}
                  alt={anime.name.main}
                  preload
                  width={455}
                  height={650}
                  sizes="(max-width: 1023px) 220px, 260px"
                  className="relative z-10 aspect-[455/650] w-full rounded-sm border border-white/8 object-cover"
                />
              </Backlight>
            </div>

            <AnimeCollectionButton anime={anime} animeEntry={animeEntry} />

            <div className="glass p-4">
              <AnimeStats anime={anime} />
            </div>

            {anime.members.length > 0 && (
              <div className="glass p-4">
                <AnimeTeam members={anime.members} />
              </div>
            )}
          </aside>

          <section className="flex flex-col gap-5.5 pt-6">
            <header className="flex flex-col gap-1.5">
              <h1
                id="anime-title"
                className="line-clamp-2 text-xl font-bold leading-tight text-zinc-50 md:text-4xl"
              >
                {anime.name.main}
              </h1>

              {anime.name.english && (
                <p className="font-mono text-sm font-medium text-zinc-400 md:text-base">
                  {anime.name.english}
                </p>
              )}
            </header>

            <AnimeMetaChips anime={anime} />

            <section className="flex flex-col gap-3">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                Жанры
              </h2>

              <AnimeGenres genres={anime.genres} />
            </section>

            <AnimeDescription anime={anime} />

            {franchise && (
              <section className="flex flex-col gap-3">
                <AnimeFranchise franchise={franchise} currentReleaseId={anime.id} />
              </section>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
