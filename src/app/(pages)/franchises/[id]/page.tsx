import Image from '@/components/ui/image';
import { fetchFranchiseDetails } from '@/shared/api/franchises';
import { CalendarRange, Clock3, Play, Star } from 'lucide-react';
import Link from 'next/link';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL!;

interface Props {
  params: { id: string };
}

export default async function FranchisePage({ params }: Props) {
  const { id } = await params;
  const franchise = await fetchFranchiseDetails(id);

  if (!franchise) {
    return (
      <div className="flex h-screen items-center justify-center text-white/30 text-sm tracking-widest uppercase">
        Франшиза не найдена
      </div>
    );
  }

  const releases = franchise.franchise_releases ?? [];

  return (
    <div className="min-h-screen text-white">
      <div className="relative h-[30vh] overflow-hidden sm:h-[50vh]">
        <Image
          src={`${MEDIA_URL}${franchise.image?.preview}`}
          alt={franchise.name}
          fill
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-linear-to-r from-[#080810] via-[#080810]/70 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-[#080810] via-[#080810]/20 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-6xl mx-auto px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Франшиза
              </span>
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {franchise.name}
            </h1>

            {franchise.name_english && (
              <p className="mt-3 text-base font-medium text-white/35 sm:text-lg">
                {franchise.name_english}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/50">
              {franchise.first_year && (
                <span className="flex items-center gap-1.5">
                  <CalendarRange className="h-4 w-4 text-white/30" />
                  {franchise.first_year}
                  {franchise.last_year && franchise.last_year !== franchise.first_year
                    ? ` — ${franchise.last_year}`
                    : ''}
                </span>
              )}
              <span className="h-3 w-px bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-white/30" />
                {franchise.total_duration}
              </span>
              {franchise.rating && (
                <>
                  <span className="h-3 w-px bg-white/15" />
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold">{franchise.rating.toFixed(1)}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-y border-white/6 bg-white/2">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-white/6">
            <StatBar label="Частей" value={franchise.total_releases} />
            <StatBar label="Эпизодов" value={franchise.total_episodes} />
            <StatBar label="Длительность" value={franchise.total_duration} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Все части
            </p>
            <h2 className="text-2xl font-black  text-white sm:text-3xl">
              {franchise.total_releases} {pluralizeReleases(franchise.total_releases)}
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {releases.map((item: any, index: number) => {
            const release = item.release;
            const poster = release.poster?.optimized?.src ?? release.poster?.src;

            return (
              <Link
                key={item.id}
                href={`/anime/${release.alias}`}
                className="group relative flex gap-4 overflow-hidden rounded-2xl border border-white/6 bg-white/2 p-4 transition-colors duration-300 hover:border-primary/30 hover:bg-primary/6"
              >
                <span className="absolute right-4 top-4 text-[11px] font-bold tabular-nums text-white/40">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative h-30 w-20 shrink-0 overflow-hidden rounded-md">
                  {poster && (
                    <Image
                      src={`${MEDIA_URL}${poster}`}
                      alt={release.name.main}
                      fill
                      sizes="76px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div>
                    <h3 className="line-clamp-2 pr-8 text-[14px] font-bold leading-snug text-white/90 transition-colors duration-200 group-hover:text-white">
                      {release.name.main}
                    </h3>
                    {release.name?.english && (
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-white/30">
                        {release.name.english}
                      </p>
                    )}
                  </div>

                  {release.description && (
                    <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-white/40">
                      {release.description.slice(0, 110)}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-white/30">
                      {release.year && <span>{release.year}</span>}
                      {release.episodes_total && (
                        <>
                          <span className="text-white/15">·</span>
                          <span>{release.episodes_total} эп.</span>
                        </>
                      )}
                      {release.type?.description && (
                        <>
                          <span className="text-white/15">·</span>
                          <span>{release.type.description}</span>
                        </>
                      )}
                    </div>

                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/30 opacity-0 transition-all duration-200 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary group-hover:opacity-100">
                      <Play className="h-3 w-3 fill-current" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-6 py-5 text-center sm:px-8 sm:py-6">
      <p className="text-[11px] font-medium uppercase tracking-widest text-white/30">{label}</p>
      <p className="mt-1.5 text-md font-black tabular-nums text-white sm:text-2xl">{value}</p>
    </div>
  );
}

function pluralizeReleases(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return 'релиз';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'релиза';
  return 'релизов';
}
