import { Anime } from '@/shared/types/anime';
import Link from 'next/link';

interface Props {
  genres: Anime['genres'];
}

export function AnimeGenres({ genres }: Props) {
  if (!genres.length) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <li key={genre.id}>
          <Link
            href={`/catalog?genres=${genre.id}&page=1`}
            prefetch={false}
            className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-white/8 bg-white/3 text-zinc-400 hover:text-primary hover:border-primary/30 hover:bg-primary/6 transition-all duration-200"
          >
            {genre.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
