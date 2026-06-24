import Image from 'next/image';
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
    <Link
      href={`/anime/${release.alias}`}
      aria-label={`Открыть «${release.name.main}»`}
      className="group block w-32 shrink-0 sm:w-44 md:w-52 lg:w-60 xl:w-64"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${release.poster.optimized.src}`}
          alt={release.name.main}
          fill
          priority
          quality={85}
          sizes="(max-width: 640px) 128px, (max-width: 1024px) 208px, 256px"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="absolute inset-0 grid place-items-center">
          <span
            className="
              flex h-12 w-12 items-center justify-center rounded-full
              bg-primary/25 text-primary-foreground
              opacity-0 scale-95
              transition-[opacity,transform] duration-200
              group-hover:scale-100 group-hover:opacity-100
              sm:h-14 sm:w-14
            "
          >
            <Play className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Poster;