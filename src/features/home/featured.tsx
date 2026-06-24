'use client';

import { Promotion } from '@/features/home/types/promotion';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Controls from './components/featured/controls';
import Info from './components/featured/info';
import Slide from './components/featured/slide';

const AUTOPLAY_DELAY = 7000;

interface FeaturedProps {
  promotions: Promotion[];
}

const Featured = ({ promotions }: FeaturedProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const autoplay = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', duration: 28 }, [
    autoplay.current,
    Fade(),
  ]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onPlay = () => setIsPlaying(true);
    const onStop = () => setIsPlaying(false);

    emblaApi.on('select', onSelect);
    emblaApi.on('autoplay:play', onPlay);
    emblaApi.on('autoplay:stop', onStop);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('autoplay:play', onPlay);
      emblaApi.off('autoplay:stop', onStop);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    autoplay.current?.reset();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    autoplay.current?.reset();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (i: number) => {
      emblaApi?.scrollTo(i);
      autoplay.current?.reset();
    },
    [emblaApi],
  );

  const toggleAutoplay = useCallback(() => {
    const plugin = autoplay.current;
    if (!plugin) return;
    plugin.isPlaying() ? plugin.stop() : plugin.play();
  }, []);

  if (!promotions.length) return null;

  const current = promotions[selectedIndex];

  return (
    <section
      className="relative w-full h-dvh overflow-hidden embla"
      aria-roledescription="carousel"
      aria-label="Рекомендуемые релизы"
    >
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to top, transparent 0%, black 40%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%)',
        }}
      >
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {promotions.map((promo, i) => (
              <Slide key={promo.id} promo={promo} priority={i === 0} />
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-black/30 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/85 via-background/30 to-transparent md:via-transparent" />

      <div className="absolute inset-0 z-10 flex items-end md:items-center pb-24 sm:pb-28 md:pb-0">
        <div className="container mx-auto px-4 sm:px-6">
          <div
            key={selectedIndex}
            className="flex flex-col lg:flex-row items-center lg:items-end text-center lg:text-left gap-6 md:gap-10 lg:gap-14"
          >
            <Info release={current.release} description={current.description} />
          </div>
        </div>
      </div>

      <Controls
        count={promotions.length}
        selectedIndex={selectedIndex}
        autoplayDelay={AUTOPLAY_DELAY}
        isPlaying={isPlaying}
        onDotClick={scrollTo}
        onPrev={scrollPrev}
        onNext={scrollNext}
        onToggleAutoplay={toggleAutoplay}
      />
    </section>
  );
};

export default Featured;
