import Image from '@/components/ui/image';
import { Backlight } from '@/components/ui/backlight';

import type { Anime } from '@/shared/types/anime';
import type { AniListAnime } from '@/shared/types/anilist';
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
import { AnimeExternalLinks } from './components/anime-external-links';
import { AnimeRating } from './components/anime-rating';
import { AnimeTrailer } from './components/anime-trailer';
import { AnimeNextEpisode } from './components/anime-next-episode';

interface Props {
  anime: Anime;
  franchise: FranchiseItem | null;
  animeEntry: UserAnimeListEntry | null;
  aniList: AniListAnime | null;
}

export function AnimeInfo({ anime, franchise, animeEntry, aniList }: Props) {
  const posterSrc = anime.poster.optimized.src;

  return (
    <main className="pt-10 md:pt-36">
      <AnimeHero posterSrc={posterSrc} />
      {aniList?.trailer?.id && <AnimeTrailer trailer={aniList.trailer.id} />}

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
              {aniList?.averageScore && <AnimeRating score={aniList.averageScore} />}
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

            {aniList?.nextAiringEpisode && (
              <AnimeNextEpisode
                episode={aniList.nextAiringEpisode.episode}
                airingAt={aniList.nextAiringEpisode.airingAt}
              />
            )}
          </aside>

          <section className="flex flex-col gap-5.5 pt-8">
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

            {aniList?.externalLinks && <AnimeExternalLinks links={aniList.externalLinks} />}

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
