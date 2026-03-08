import Image from '@/components/ui/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface PosterRelease {
  alias: string;
  name: {
    main: string;
  };
  poster: {
    optimized: {
      src: string;
    };
  };
}

const Poster = ({ release }: { release: PosterRelease }) => {
  return (
    <div className="flex-shrink-0 flex flex-col items-center gap-4 w-48 sm:w-56 md:w-56 lg:w-64 xl:w-72">
      <Link href={`/anime/${release.alias}`} className="group block w-full">
        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:-translate-y-2">
          <Image
            src={`https://aniliberty.top${release.poster.optimized.src}`}
            alt={release.name.main}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
      </Link>
      <Link href={`/anime/${release.alias}`} className="w-full">
        <button className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/85 transition-colors duration-200 cursor-pointer max-sm:hidden">
          <Play className="w-4 h-4 fill-current" />
          Смотреть
        </button>
      </Link>
    </div>
  );
};

export default Poster;
