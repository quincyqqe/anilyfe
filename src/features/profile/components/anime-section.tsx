import Image from '@/components/ui/image';
import Link from 'next/link';

interface UserAnime {
  id: string;
  anime_name: string;
  anime_poster: string;
  anime_slug?: string;
  alias?: string;
}

interface Profile {
  user_anime_list: UserAnime[];
}

export default function AnimeSection({ profile }: any) {
  const animeList = profile.user_anime_list ?? [];

  if (!animeList.length) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 px-4">
      <div className="grid grid-cols-3 gap-3 md:grid-cols-5 md:gap-5 lg:grid-cols-6 xl:grid-cols-7">
        {animeList.map((anime: any) => {
          const slug = anime.anime_slug ?? anime.alias ?? '';
          return (
            <Link
              key={anime.id}
              href={slug ? `/anime/${slug}` : '#'}
              className="group relative flex cursor-pointer flex-col rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-white/5">
                <Image
                  src={`https://aniliberty.top${anime.anime_poster}`}
                  alt={anime.anime_name || 'Постер'}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  fill
                  preload
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                />
              </div>

              <div className="mt-2 flex flex-col gap-1 px-0.5 pb-1">
                <h3 className="line-clamp-1 text-sm font-semibold text-white/90 transition-colors duration-200 group-hover:text-primary">
                  {anime.anime_name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
