'use client';

import Image from 'next/image';
import { FranchiseItem } from '@/shared/types/franchise';
import { ArrowUpRight, Clock3, Star } from 'lucide-react';
import Link from 'next/link';
import { formatYearRange, getFranchiseImage, MEDIA_URL } from './lib/franchise';

interface Props {
  animeList: FranchiseItem[];
}

const RandomFranchises = ({ animeList }: Props) => {
  return (
    <section className="px-4 py-6 md:py-12">
      <div className="container mx-auto">
        <div className="mb-8 md:mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Франшизы
            </p>
            <h2 className="text-2xl font-black text-white md:text-4xl">Популярные франшизы</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:gap-6 xl:grid-cols-[repeat(auto-fill,minmax(420px,1fr))]">
          {animeList.map((franchise, index) => {
            const imageSrc = getFranchiseImage(franchise);
            const yearRange = formatYearRange(franchise);

            return (
              <Link
                key={franchise.id}
                href={`/franchises/${franchise.id}`}
                aria-label={`Открыть франшизу ${franchise.name}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/4 bg-[oklch(0.1_0.016_285/0.35)] transition-colors duration-400 hover:border-primary/20 sm:flex-row"
              >
                <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-auto sm:w-38.75">
                  {imageSrc && (
                    <Image
                      src={`${MEDIA_URL}${imageSrc}`}
                      alt={franchise.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}

                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: [
                        'linear-gradient(to bottom, transparent 50%, rgba(10,10,18,0.95) 100%)',
                        'linear-gradient(to right, transparent 48%, rgba(10,10,18,0.58) 82%, rgba(10,10,18,0.96) 100%)',
                      ].join(', '),
                    }}
                  />

                  <div className="absolute bottom-0 left-0 flex flex-wrap gap-1.5 p-3 sm:hidden">
                    <Badge variant="primary">{yearRange}</Badge>
                    <Badge variant="sky">{franchise.total_episodes} эп.</Badge>
                    {franchise.total_releases > 1 && (
                      <Badge variant="emerald">{franchise.total_releases} части</Badge>
                    )}
                  </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 p-4 sm:gap-4 sm:p-5">
                  <div className="hidden flex-wrap gap-2 text-[10px] font-semibold sm:flex">
                    <Badge variant="primary">{yearRange}</Badge>
                    <Badge variant="sky">{franchise.total_episodes} эп.</Badge>
                    {franchise.total_releases > 1 && (
                      <Badge variant="emerald">{franchise.total_releases} части</Badge>
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

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-white/50">
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5" />
                        {franchise.total_duration}
                      </span>
                      {franchise.rating !== null && (
                        <span className="flex items-center gap-1.5 text-amber-300">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {franchise.rating.toFixed(1)}
                        </span>
                      )}
                    </div>

                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/65 transition-colors duration-300 group-hover:border-primary/30 group-hover:bg-primary/12 group-hover:text-primary sm:h-10 sm:w-10 sm:rounded-2xl">
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
  );
};

const Badge = ({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'primary' | 'sky' | 'emerald';
}) => {
  const styles = {
    primary: 'border-primary/20 bg-primary/15 text-primary uppercase tracking-wide',
    sky: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

export default RandomFranchises;
