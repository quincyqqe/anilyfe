'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { ScrollShadow } from '@heroui/react';

interface Props {
  franchise: any;
  currentReleaseId: number;
}

export function AnimeFranchise({ franchise, currentReleaseId }: Props) {
  const sorted = [...franchise.franchise_releases].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const currentItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const item = currentItemRef.current;

    if (!container || !item) return;

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
  }, [currentReleaseId]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="px-2 text-xl font-bold text-white md:text-2xl">
          Порядок просмотра
        </h2>
        <p className="px-2 text-sm font-medium text-zinc-400">
          {franchise.name}
        </p>
      </div>

      <ScrollShadow
        ref={containerRef}
        className="max-h-[450px] overflow-y-auto pr-4 -mr-4"
      >
        <div className="ml-6 flex flex-col gap-3 border-l-2 border-white/5 py-2">
          {sorted.map((item) => {
            const { release } = item;
            const isCurrent = release.id === currentReleaseId;

            const meta = [
              release.year && String(release.year),
              release.type?.description,
              release.episodes_total > 0
                ? `${release.episodes_total} эп.`
                : null,
            ].filter(Boolean);

            return (
              <div
                key={item.id}
                ref={isCurrent ? currentItemRef : null}
                className="relative pl-6"
              >
                <div
                  className={`absolute top-6 -left-[5px] z-10 h-2 w-2 rounded-full ${
                    isCurrent ? 'bg-primary' : 'bg-zinc-700'
                  }`}
                />

                <span className="absolute top-5 -left-3 -translate-x-full text-[10px] font-bold text-zinc-600">
                  {item.sort_order}
                </span>

                <Link
                  href={`/anime/${release.alias}`}
                  prefetch={false}
                  className={`group relative block w-full overflow-hidden rounded-xl transition-colors duration-300 ${
                    isCurrent
                      ? 'border border-primary/30 bg-primary/5'
                      : 'border border-transparent bg-white/3 hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="relative z-10 flex flex-col gap-3 p-2.5 sm:flex-row">
                    <div className="flex w-full min-w-0 items-center gap-3">
                      <div className="relative h-[4.2rem] w-12 shrink-0 overflow-hidden rounded-sm">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${release.poster.src}`}
                          alt={release.name.main}
                          fill
                          sizes="48px"
                          className="object-contain"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`truncate text-sm font-bold ${
                              isCurrent
                                ? 'text-primary'
                                : 'text-white transition-colors group-hover:text-primary'
                            }`}
                          >
                            {release.name.main}
                          </span>

                          {isCurrent && (
                            <span className="shrink-0 rounded bg-primary px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white">
                              Вы здесь
                            </span>
                          )}
                        </div>

                        <span
                          title={release.name.english}
                          className="truncate text-xs font-medium text-zinc-400"
                        >
                          {release.name.english}
                        </span>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                          {meta.map((value, index) => (
                            <div
                              key={`${item.id}-${value}`}
                              className="flex items-center gap-2"
                            >
                              <span>{value}</span>

                              {index < meta.length - 1 && (
                                <span className="h-1 w-1 rounded-sm bg-white/20" />
                              )}
                            </div>
                          ))}

                          {release.is_in_production && (
                            <div className="flex items-center gap-1 text-primary/80">
                              <span className="h-1 w-1 animate-pulse rounded-sm bg-primary/80" />
                              Онгоинг
                            </div>
                          )}
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