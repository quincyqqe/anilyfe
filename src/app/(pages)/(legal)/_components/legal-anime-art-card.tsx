import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import type { AnimeArtItem } from './anime-art';

interface LegalAnimeArtCardProps {
  art: AnimeArtItem;
}

export function LegalAnimeArtCard({ art }: LegalAnimeArtCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-none">
      <div className="pointer-events-none absolute -inset-3 -z-10 overflow-hidden rounded-[2.5rem] opacity-50 blur-3xl saturate-200 transform-gpu transition-all duration-700">
        <Image
          src={art.url}
          alt=""
          aria-hidden="true"
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/40 p-3 sm:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition duration-500 hover:border-white/20">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
          <Image
            src={art.url}
            alt={art.tag ? `Anime Art - ${art.tag}` : 'Anime Illustration'}
            fill
            unoptimized
            priority
            className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.03]"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-90" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-transparent to-transparent" />

          <div className="absolute inset-x-3 bottom-3 z-10">
            <div className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-950/75 px-3.5 py-2.5 backdrop-blur-xl shadow-lg transition hover:bg-zinc-950/90">
              <div className="min-w-0 flex-1">
                <span className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                  Иллюстратор
                </span>
                <span className="block truncate text-xs font-semibold text-white">
                  {art.artist_name}
                </span>
              </div>

              {art.source_url && (
                <a
                  href={art.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  title="Открыть источник работы"
                >
                  <span>Источник</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
