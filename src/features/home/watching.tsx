'use client';

import { getAnimeHistory } from '@/lib/utils/anime-history';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function formatTime(time: number) {
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function getProgress(item: { time: number; timeLeft: number }) {
  const total = item.time + item.timeLeft;
  if (!total) return 0;
  return (item.time / total) * 100;
}

const ContinueWatching = () => {
  const [items, setItems] = useState<ReturnType<typeof getAnimeHistory>>([]);
  const [mounted, setMounted] = useState(false);

  const [emblaRef] = useEmblaCarousel({ align: 'start', loop: false });

  useEffect(() => {
    setMounted(true);
    setItems(getAnimeHistory());
  }, []);

  if (!mounted || !items.length) return null;

  return (
       <section className="py-6 md:py-12 px-4 ">
      <div className="container mx-auto flex flex-col gap-5">
        <h2 className="text-2xl md:text-4xl font-black text-white mb-3">Продолжить просмотр</h2>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {items.map((item) => (
              <div
                className="embla__slide min-w-[270px] max-w-[270px] pr-4"
                key={`${item.animeId}-${item.episode}`}
              >
                <Link href={`/anime/${item.animeSlug}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className="aspect-video bg-zinc-900">
                      {item.preview && (
                        <img
                          src={item.preview}
                          alt={item.animeTitle ?? 'Anime preview'}
                          className="w-full h-full object-cover "
                        />
                      )}
                    </div>

                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition" />

                    <div className="absolute bottom-2 right-2 text-[10px] px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-white border border-white/10 shadow">
                      {formatTime(item.time)}
                    </div>

                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10">
                      <div
                        className="h-full bg-white/80 transition-all duration-300"
                        style={{ width: `${getProgress(item)}%` }}
                      />
                    </div>

                    <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 group-hover:ring-white/20 transition" />
                  </div>

                  <div className="mt-3 flex flex-col gap-1 px-1">
                    <span className="text-sm font-semibold text-zinc-200 line-clamp-1 group-hover:text-white transition">
                      {item.animeTitle}
                    </span>
                    <span className="text-xs text-zinc-500 group-hover:text-zinc-400 transition">
                      Эпизод {item.episode + 1}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContinueWatching;
