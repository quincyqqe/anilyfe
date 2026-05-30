import { Anime } from '@/shared/types/anime';
import { AlignLeft } from 'lucide-react';

interface Props {
  anime: Anime;
}

export function AnimeDescription({ anime }: Props) {
  const description = anime.description?.trim();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white/5 border border-white/8">
          <AlignLeft className="w-3 h-3 text-zinc-400" strokeWidth={2} />
        </span>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
          Описание
        </span>
        <span className="flex-1 h-px bg-gradient-to-r from-white/8 to-transparent" />
      </div>

      <div className="relative">
        <div className="pl-4">
          {description ? (
            <p className="text-sm text-zinc-400 leading-[1.8] whitespace-pre-line tracking-[0.01em]">
              {description}
            </p>
          ) : (
            <p className="text-sm text-zinc-600 italic">Описание отсутствует.</p>
          )}
        </div>
      </div>
    </div>
  );
}
