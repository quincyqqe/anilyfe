import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  count: number;
  selectedIndex: number;
  onDotClick: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

const Controls = ({ count, selectedIndex, onDotClick, onPrev, onNext }: Props) => {
  return (
    <>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => onDotClick(i)}
            className={clsx(
              'h-1.5 rounded-full transition-all duration-300',
              i === selectedIndex
                ? 'w-8 bg-primary shadow-[0_0_10px_rgba(0,186,165,0.9)]'
                : 'w-2.5 bg-white/20 hover:bg-white/50',
            )}
          />
        ))}
      </div>

      <div className="absolute bottom-7 right-6 md:right-10 z-20 flex gap-2">
        {[
          { icon: ChevronLeft, action: onPrev },
          { icon: ChevronRight, action: onNext },
        ].map(({ icon: Icon, action }, i) => (
          <button
            key={i}
            onClick={action}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 backdrop-blur-md transition-all duration-200 group"
          >
            <Icon className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          </button>
        ))}
      </div>
    </>
  );
};

export default Controls;
