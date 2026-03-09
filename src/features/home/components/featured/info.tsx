import { Anime } from '@/shared/types/anime';
import Badges from './badges';
import Stats from './stats';

interface Props {
  release: Anime;
  description: string;
}

export function Info({ release, description }: Props) {
  return (
    <div className="flex flex-col gap-5 min-w-0 flex-1 text-center md:text-left">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-black leading-tight text-white">
          {release?.name.main}
        </h1>
        {release?.name.english && (
          <p className="mt-1.5 text-sm text-white/40 font-medium">{release.name.english}</p>
        )}
      </div>

      {release && <Badges release={release} />}

      <p className="text-white/50 text-sm md:text-base leading-relaxed line-clamp-3 max-w-xl mx-auto md:mx-0 px-4">
        {description}
      </p>

      {release && <Stats release={release} />}
    </div>
  );
}

export default Info;
