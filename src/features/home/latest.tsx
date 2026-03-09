import Link from 'next/link';
import { Anime } from '@/shared/types/anime';
import { AnimeCard } from '@/components/anime-card';

interface LatestProps {
  animeList: Anime[];
}

const Latest = ({ animeList }: LatestProps) => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">
              Новинки
            </p>
            <h2 className="text-2xl md:text-4xl font-black text-white">Последние обновления</h2>
          </div>
          <Link
            href="/catalog"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
          >
            Смотреть все
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-5">
          {animeList.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
        <Link
          href="/catalog"
          className="md:hidden flex items-center justify-center gap-2 mt-8 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          Смотреть все
        </Link>
      </div>
    </section>
  );
};

export default Latest;
