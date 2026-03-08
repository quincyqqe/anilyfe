import Link from 'next/link';
import Image from '@/components/ui/image';
import { ScrollShadow } from '@heroui/scroll-shadow';

const BASE_URL = 'https://aniliberty.top';

interface Props {
  franchise: any;
  currentReleaseId: number;
}

export function AnimeFranchise({ franchise, currentReleaseId }: Props) {
  const sorted = [...franchise.franchise_releases].sort((a, b) => a.sort_order - b.sort_order);

  const franchiseBanner = `${BASE_URL}${franchise.image.optimized.preview}`;

  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-zinc-500">
        Франшиза
      </span>

      <div className="flex gap-4 items-start">
        <div className="hidden lg:flex shrink-0 w-[180px] flex-col gap-3">
          <div className="relative w-full aspect-[415/450] rounded-2xl overflow-hidden border border-white/8">
            <Image src={franchiseBanner} alt={franchise.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-0.5">
              <span className="text-sm font-bold text-white leading-tight">{franchise.name}</span>
              <span className="text-[11px] text-zinc-400">{franchise.name_english}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/6 bg-white/2 p-3.5 backdrop-blur-sm flex flex-col gap-2">
            <StatRow label="Релизов" value={String(franchise.total_releases)} />
            <StatRow label="Эпизодов" value={String(franchise.total_episodes)} />
            <StatRow label="Хронометраж" value={franchise.total_duration} />
            <StatRow label="Годы" value={`${franchise.first_year} – ${franchise.last_year}`} />
          </div>
        </div>

        <ScrollShadow className="flex-1 min-w-0 max-h-[480px] overflow-y-auto pr-1" hideScrollBar>
          <div className="flex flex-col gap-2">
            {sorted.map((item, index) => {
              const { release } = item;
              const isCurrent = release.id === currentReleaseId;
              const posterSrc = `${BASE_URL}${release.poster.optimized.src}`;

              return (
                <Link
                  key={item.id}
                  href={`/anime/${release.alias}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`
                    group relative flex items-center gap-3 rounded-xl border
                    overflow-hidden transition-all duration-200 shrink-0
                    ${
                      isCurrent
                        ? 'border-primary/40 bg-primary/8 pointer-events-none'
                        : 'border-white/6 bg-white/3 hover:bg-white/6 hover:border-white/12'
                    }
                  `}
                >
                  {isCurrent && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary" />
                  )}

                  <span className="shrink-0 w-10 text-center text-xs font-bold text-zinc-600 pl-3">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative shrink-0 w-12 h-[68px] rounded-lg overflow-hidden my-2.5 border border-white/8">
                    <Image src={posterSrc} alt={release.name.main} fill className="object-cover" />
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-0 flex-1 py-3">
                    <span
                      className={`text-sm font-semibold line-clamp-1 ${
                        isCurrent ? 'text-primary' : 'text-zinc-100'
                      }`}
                    >
                      {release.name.main}
                    </span>
                    <span className="text-xs text-zinc-500 truncate">{release.name.english}</span>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1 pr-4 py-3">
                    <span className="text-xs font-medium text-zinc-400">{release.year}</span>
                    <span className="text-[10px] text-zinc-600">
                      {release.type.description}
                      {release.episodes_total > 0 && ` · ${release.episodes_total} эп.`}
                    </span>
                    {release.is_in_production && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Онгоинг
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] text-zinc-600 uppercase tracking-wide shrink-0">{label}</span>
      <span className="text-[11px] font-semibold text-zinc-300 text-right">{value}</span>
    </div>
  );
}
