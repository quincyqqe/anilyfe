import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  count: number;
  selectedIndex: number;
  autoplayDelay: number;
  isPlaying: boolean;
  onDotClick: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleAutoplay: () => void;
}

const Controls = ({
  count,
  selectedIndex,
  autoplayDelay,
  isPlaying,
  onDotClick,
  onPrev,
  onNext,
  onToggleAutoplay,
}: Props) => {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6 sm:px-6 sm:pb-7">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Слайды">
          {Array.from({ length: count }).map((_, i) => {
            const active = i === selectedIndex;

            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Слайд ${i + 1}`}
                onClick={() => onDotClick(i)}
                className={clsx(
                  'h-1.5 overflow-hidden rounded-full duration-300 transition-[width,background-color]',
                  active ? 'w-10 bg-white/20' : 'w-2.5 bg-white/20 hover:bg-white/40',
                )}
              >
                {active && (
                  <span
                    key={`${selectedIndex}-${isPlaying}`}
                    className={clsx(
                      'block h-full w-full rounded-full bg-primary',
                      isPlaying && 'hero-progress-fill',
                    )}
                    style={
                      isPlaying
                        ? { animationDuration: `${autoplayDelay}ms` }
                        : { transform: 'scaleX(1)', transformOrigin: 'left center' }
                    }
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleAutoplay}
            aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
            className="group hidden rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors hover:border-white/25 hover:bg-white/15 sm:block"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white/60 transition-colors group-hover:text-white" />
            ) : (
              <Play className="h-5 w-5 text-white/60 transition-colors group-hover:text-white" />
            )}
          </button>

          <button
            type="button"
            onClick={onPrev}
            aria-label="Предыдущий слайд"
            className="group rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors hover:border-white/25 hover:bg-white/15"
          >
            <ChevronLeft className="h-5 w-5 text-white/60 transition-colors group-hover:text-white" />
          </button>

          <button
            type="button"
            onClick={onNext}
            aria-label="Следующий слайд"
            className="group rounded-xl border border-white/10 bg-white/5 p-2.5 transition-colors hover:border-white/25 hover:bg-white/15"
          >
            <ChevronRight className="h-5 w-5 text-white/60 transition-colors group-hover:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;