'use client';

import { Promotion } from '@/features/home/types/promotion';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Controls from './components/featured/controls';
import Info from './components/featured/info';
import Poster from './components/featured/poster';
import Slide from './components/featured/slide';

interface FeaturedProps {
  promotions: Promotion[];
}

const Featured = ({ promotions }: FeaturedProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplay = useRef(Autoplay({ delay: 6000, stopOnInteraction: false }));
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    autoplay.current,
    Fade(),
  ]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
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

  if (!promotions.length) return null;

  const current = promotions[selectedIndex];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'linear-gradient(to top, transparent 0%, black 35%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 35%)',
        }}
      >
        <div className="embla embla-hero" ref={emblaRef}>
          <div className="embla__container h-full">
            {promotions.map((promo) => (
              <Slide key={promo.id} promo={promo} />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-black/70 via-black/30 to-transparent" />

      <div className="absolute inset-0 flex items-center z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12 lg:gap-16 max-sm:pt-16">
            {current.release?.poster && <Poster release={current.release} />}
            <Info release={current.release} description={current.description} />
          </div>
        </div>
      </div>

      <Controls
        count={promotions.length}
        selectedIndex={selectedIndex}
        onDotClick={scrollTo}
        onPrev={scrollPrev}
        onNext={scrollNext}
      />
    </section>
  );
};

export default Featured;
