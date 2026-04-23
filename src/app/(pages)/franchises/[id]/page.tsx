import Image from '@/components/ui/image';
import { fetchFranchiseDetails } from '@/shared/api/franchises';
import { CalendarRange, Clapperboard, Clock3, Star } from 'lucide-react';

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL!;

type Params = {
  id: string;
};

interface Props {
  params: Params;
}

export default async function FranchisePage({ params }: Props) {
  const { id } = await params;

  const franchise = await fetchFranchiseDetails(id);

  if (!franchise) {
    return (
      <div className="flex h-screen items-center justify-center text-white/50">
        Franchise not found
      </div>
    );
  }

  const releases = franchise.franchise_releases ?? [];

  return (
    <div className="min-h-screen text-white">
      {/* HERO */}
      <div className="relative overflow-hidden pt-26">
        <div
          className="absolute inset-0"
          style={{
            maskImage: 'linear-gradient(to top, transparent 0%, black 35%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 35%)',
          }}
        >
          <Image
            src={`${MEDIA_BASE_URL}${franchise.image?.preview}`}
            alt={franchise.name}
            fill
            className="object-cover opacity-30 blur-sm scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/70 to-[oklch(0.08_0.015_285)]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <h1 className="text-4xl font-black md:text-5xl">{franchise.name}</h1>

          {franchise.name_english && (
            <p className="mt-2 text-lg text-white/50">{franchise.name_english}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Badge>
              <CalendarRange className="h-4 w-4" />
              {franchise.first_year} — {franchise.last_year}
            </Badge>

            <Badge>
              <Clapperboard className="h-4 w-4" />
              {franchise.total_releases} релиза
            </Badge>

            <Badge>
              <Clock3 className="h-4 w-4" />
              {franchise.total_duration}
            </Badge>

            {franchise.rating && (
              <Badge color="amber">
                <Star className="h-4 w-4 fill-current" />
                {franchise.rating.toFixed(1)}
              </Badge>
            )}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Stat label="Эпизодов" value={franchise.total_episodes} />

            <Stat label="Релизов" value={franchise.total_releases} />

            <Stat label="Длительность" value={franchise.total_duration} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-4">
        <h2 className="text-2xl font-bold">Все части франшизы</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {releases.map((item: any) => {
            const release = item.release;

            return (
              <a
                key={item.id}
                href={`/anime/${release.alias}`}
                className="group flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-primary/30 hover:bg-white/10"
              >
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={`${MEDIA_BASE_URL}${release.poster?.optimized?.src ?? release.poster?.src}`}
                    alt={release.name.main}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-bold text-white group-hover:text-primary">
                    {release.name.main}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-sm text-white/50">
                    {release.description?.slice(0, 120)}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/40">
                    <span>{release.year}</span>

                    <span>•</span>

                    <span>{release.episodes_total} эп.</span>

                    <span>•</span>

                    <span>{release.type?.description}</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Badge({ children, color = 'default' }: any) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
        color === 'amber'
          ? 'border-amber-400/20 bg-amber-400/10 text-amber-200'
          : 'border-white/10 bg-white/5 text-white/70'
      }`}
    >
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/40">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}
