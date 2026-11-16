import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const DELTA_THRESHOLD = 4;
const HEADER_HEIGHT = 80;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface HeaderScrollState {
  isScrolled: boolean;
  isHidden: boolean;
}

export function useHeaderScroll(threshold = 50): HeaderScrollState {
  const [state, setState] = useState<HeaderScrollState>({
    isScrolled: false,
    isHidden: false,
  });

  const lastY = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    let rafId: number | null = null;

    const updateScrollState = () => {
      rafId = null;
      const y = Math.max(0, window.scrollY);
      const prevY = lastY.current;

      setState((prev) => {
        const isScrolled = y > threshold;
        let isHidden = prev.isHidden;

        if (prevY !== null) {
          const delta = y - prevY;

          if (delta > DELTA_THRESHOLD && y > HEADER_HEIGHT) {
            isHidden = true;
          } else if (delta < -DELTA_THRESHOLD || y <= HEADER_HEIGHT) {
            isHidden = false;
          }
        }

        if (prev.isScrolled === isScrolled && prev.isHidden === isHidden) {
          return prev;
        }

        return { isScrolled, isHidden };
      });

      lastY.current = y;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [threshold]);

  return state;
}
