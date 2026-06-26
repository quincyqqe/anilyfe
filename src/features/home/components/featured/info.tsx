import { Anime } from '@/shared/types/anime';
import Link from 'next/link';
import { Play, Info as InfoIcon } from 'lucide-react';
import Badges from './badges';
import Stats from './stats';

interface Props {
  release: Anime;
  description: string;
}

function Info({ release, description }: Props) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-4 md:items-start md:gap-5">
      <div className="min-w-0">
        <h1 className="text-xl lg:text-4xl font-bold text-zinc-50 leading-tight text-balance line-clamp-2">
          {release.name.main}
        </h1>

        {release.name.english && (
          <p className="mt-1.5 line-clamp-1 text-sm font-medium text-white/40 sm:text-base">
            {release.name.english}
          </p>
        )}
      </div>

      <Badges release={release} />

      <p className="line-clamp-2 max-w-2xl text-pretty text-sm leading-relaxed text-white/55 sm:line-clamp-3 sm:text-base">
        {description}
      </p>

      <Stats release={release} />

      <div className="flex w-full items-center justify-center gap-3 md:justify-start">
        <Link
          href={`/anime/${release.alias}`}
          className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition-[background-color,transform] duration-200 hover:bg-white/85 active:scale-[0.98] sm:flex-none sm:px-8"
        >
          <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
          Смотреть
        </Link>

        <Link
          href={`/anime/${release.alias}`}
          aria-label="Подробнее о релизе"
          className="glass inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/90 transition-[border-color,color,transform] duration-200 hover:border-white/25 hover:text-white active:scale-[0.98] sm:px-7"
        >
          <InfoIcon className="h-4 w-4" />
          <span className="max-sm:hidden">Подробнее</span>
        </Link>
      </div>
    </div>
  );
}

export default Info;