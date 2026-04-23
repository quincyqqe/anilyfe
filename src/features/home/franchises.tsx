'use client';

import { ArrowUpRight, Clock3, Star } from 'lucide-react';

import Image from '@/components/ui/image';
import { FranchiseItem } from '@/shared/types/franchise';

import Link from 'next/link';
import { formatYearRange, getFranchiseImage, MEDIA_URL } from './lib/franchise';

interface Props {
  animeList: FranchiseItem[];
}

const RandomFranchises = ({ animeList }: Props) => {
  return (
    <>
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
                Франшизы
              </p>
              <h2 className="text-2xl font-black text-white md:text-4xl">Популярные франшизы</h2>
            </div>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 xl:grid-cols-[repeat(auto-fill,minmax(420px,1fr))]">
            {animeList.map((franchise, index) => {
              const imageSrc = getFranchiseImage(franchise);
              const yearRange = formatYearRange(franchise);

              return (
                <Link
                  key={franchise.id}
                  href={`/franchises/${franchise.id}`}
                  type="button"
                  aria-haspopup="dialog"
                  aria-label={`Открыть франшизу ${franchise.name}`}
                  style={{ animationDelay: `${index * 80}ms` }}
                  className="group relative flex overflow-hidden rounded-[24px] border border-white/4 bg-[oklch(0.1_0.016_285/0.35)] text-left shadow-[0_1px_0_oklch(1_0_0/0.03)_inset,0_8px_40px_oklch(0_0_0/0.45)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/20 hover:shadow-2xl hover:shadow-black/60"
                >
                  <div className="relative min-h-[220px] w-[155px] shrink-0 overflow-hidden">
                    {imageSrc && (
                      <Image
                        src={`${MEDIA_URL}${imageSrc}`}
                        alt={franchise.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                      />
                    )}

                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to right, transparent 48%, rgba(10, 10, 18, 0.58) 82%, rgba(10, 10, 18, 0.96) 100%)',
                      }}
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5">
                    <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                      <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/15 px-2 py-[2px] uppercase tracking-wide text-primary">
                        {yearRange}
                      </span>

                      <span className="inline-flex items-center rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-[2px] text-sky-300">
                        {franchise.total_episodes} эп.
                      </span>

                      {franchise.total_releases > 1 && (
                        <span className="inline-flex items-center rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-[2px] text-emerald-300">
                          {franchise.total_releases} части
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-white transition-colors group-hover:text-primary">
                        {franchise.name}
                      </h3>

                      {franchise.name_english && (
                        <p className="mt-1 line-clamp-1 text-[12px] text-white/40">
                          {franchise.name_english}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/50">
                      <div className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        <span>{franchise.total_duration}</span>
                      </div>

                      {franchise.rating !== null && (
                        <div className="flex items-center gap-1.5 text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{franchise.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end items-center">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/65 transition group-hover:border-primary/30 group-hover:bg-primary/12 group-hover:text-primary">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default RandomFranchises;
