'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { ScrollShadow } from '@heroui/scroll-shadow';

interface Props {
  franchise: any;
  currentReleaseId: number;
}

export function AnimeFranchise({ franchise, currentReleaseId }: Props) {
  const sorted = [...franchise.franchise_releases].sort((a, b) => a.sort_order - b.sort_order);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && currentItemRef.current) {
      const container = containerRef.current;
      const item = currentItemRef.current;

      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const scrollPos =
        container.scrollTop +
        (itemRect.top - containerRect.top) -
        container.clientHeight / 2 +
        itemRect.height / 2;

      container.scrollTo({
        top: scrollPos,
        behavior: 'smooth',
      });
    }
  }, [currentReleaseId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl md:text-2xl font-black text-white px-2">Порядок просмотра</h2>
        <p className="text-sm font-medium text-zinc-400 px-2">{franchise.name}</p>
      </div>

      <ScrollShadow ref={containerRef} className="max-h-[450px] overflow-y-auto pr-4 -mr-4">
        <div className="relative border-l-2 border-white/5 ml-6 py-2 flex flex-col gap-3">
          {sorted.map((item) => {
            const { release } = item;
            const isCurrent = release.id === currentReleaseId;

            return (
              <div key={item.id} className="relative pl-6" ref={isCurrent ? currentItemRef : null}>
                <div
                  className={`absolute -left-[5px] top-6 w-2 h-2 rounded-full transition-all duration-300 z-10 ${
                    isCurrent
                      ? 'bg-primary shadow-[0_0_10px_rgba(var(--heroui-primary),0.8)] ring-4 ring-primary/20'
                      : 'bg-zinc-700'
                  }`}
                />

                <span className="absolute -left-3 top-5 -translate-x-full text-[10px] font-bold text-zinc-600">
                  {item.sort_order}
                </span>

                <Link
                  href={`/anime/${release.alias}`}
                  className={`
                    block group relative w-full rounded-xl transition-all duration-300 overflow-hidden
                    ${
                      isCurrent
                        ? 'border border-primary/30 bg-primary/5 shadow-lg shadow-primary/5'
                        : 'border border-transparent bg-white/[0.03] hover:bg-white/5 hover:border-white/10 hover:shadow-xl'
                    }
                  `}
                >
                  <div className="flex sm:flex-row flex-col gap-3 p-2.5 relative z-10 min-w-0">
                    <div className="flex items-center gap-3 min-w-0 w-full">
                      <div className="relative shrink-0 w-[3rem] h-[4.2rem] rounded-lg overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors shadow-xl">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${release.poster.src}`}
                          alt={release.name.main}
                          fill
                          className="object-contain"
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 ring-2 ring-primary/80 ring-inset rounded-lg pointer-events-none" />
                        )}
                      </div>

                      <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center py-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-sm font-bold truncate ${isCurrent ? 'text-primary' : 'text-white group-hover:text-primary transition-colors'}`}
                          >
                            {release.name.main}
                          </span>
                          {isCurrent && (
                            <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest font-black bg-primary text-white shadow-sm">
                              Вы здесь
                            </span>
                          )}
                        </div>

                        <span
                          className="text-xs font-medium text-zinc-400 truncate w-full"
                          title={release.name.english}
                        >
                          {release.name.english}
                        </span>

                        <div className="flex items-center gap-x-2 gap-y-1 mt-1 flex-wrap text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                          {[
                            release.year ? <span key="year">{release.year}</span> : null,
                            release.type?.description ? (
                              <span key="type">{release.type.description}</span>
                            ) : null,
                            release.episodes_total > 0 ? (
                              <span key="eps">{release.episodes_total} эп.</span>
                            ) : null,
                            release.is_in_production ? (
                              <span
                                key="ongoing"
                                className="flex items-center gap-1 text-primary/80"
                              >
                                <span className="w-1 h-1 rounded-sm bg-primary/80 animate-pulse" />
                                Онгоинг
                              </span>
                            ) : null,
                          ]
                            .filter(Boolean)
                            .map((el, i, arr) => (
                              <div key={i} className="flex items-center gap-2">
                                {el}
                                {i < arr.length - 1 && (
                                  <span className="w-1 h-1 rounded-sm bg-white/20" />
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </ScrollShadow>
    </div>
  );
}
