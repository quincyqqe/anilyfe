'use client';

import * as React from 'react';

import { cn } from '@/lib/utils/cn';

export type ScrollShadowVisibility =
  | 'auto'
  | 'both'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'none';

export interface ScrollShadowProps extends Omit<React.ComponentProps<'div'>, 'size'> {
  size?: number;
  offset?: number;
  orientation?: 'vertical' | 'horizontal';
  visibility?: ScrollShadowVisibility;
  isEnabled?: boolean;
  hideScrollBar?: boolean;
  onVisibilityChange?: (visibility: ScrollShadowVisibility) => void;
}

const VERTICAL_ATTRS = ['topScroll', 'bottomScroll', 'topBottomScroll'] as const;
const HORIZONTAL_ATTRS = ['leftScroll', 'rightScroll', 'leftRightScroll'] as const;

function clearScrollAttrs(el: HTMLElement) {
  [...VERTICAL_ATTRS, ...HORIZONTAL_ATTRS].forEach((attr) => {
    delete el.dataset[attr];
  });
}

export function ScrollShadow({
  children,
  className,
  hideScrollBar = false,
  isEnabled = true,
  offset = 0,
  onVisibilityChange,
  orientation = 'vertical',
  ref,
  size = 40,
  visibility = 'auto',
  style,
  ...props
}: ScrollShadowProps) {
  const internalRef = React.useRef<HTMLDivElement | null>(null);
  const lastVisibilityRef = React.useRef<ScrollShadowVisibility>('none');

  React.useEffect(() => {
    const el = internalRef.current;
    if (!el || !isEnabled || visibility !== 'auto') return;

    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = el.scrollTop > offset;
        const bottom = el.scrollHeight - el.scrollTop - el.clientHeight > offset;
        const left = el.scrollLeft > offset;
        const right = el.scrollWidth - el.scrollLeft - el.clientWidth > offset;

        clearScrollAttrs(el);

        let next: ScrollShadowVisibility = 'none';

        if (orientation === 'vertical') {
          if (top && bottom) {
            el.dataset['topBottomScroll'] = 'true';
            next = 'both';
          } else if (top) {
            el.dataset['topScroll'] = 'true';
            next = 'top';
          } else if (bottom) {
            el.dataset['bottomScroll'] = 'true';
            next = 'bottom';
          }
        } else {
          if (left && right) {
            el.dataset['leftRightScroll'] = 'true';
            next = 'both';
          } else if (left) {
            el.dataset['leftScroll'] = 'true';
            next = 'left';
          } else if (right) {
            el.dataset['rightScroll'] = 'true';
            next = 'right';
          }
        }

        if (next !== lastVisibilityRef.current) {
          lastVisibilityRef.current = next;
          onVisibilityChange?.(next);
        }
      });
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    Array.from(el.children).forEach((child) => observer.observe(child));

    el.addEventListener('scroll', update, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener('scroll', update);
    };
  }, [isEnabled, offset, onVisibilityChange, orientation, visibility]);

  React.useEffect(() => {
    const el = internalRef.current;
    if (!el || visibility === 'auto') return;

    clearScrollAttrs(el);

    if (visibility === 'both') {
      el.dataset[orientation === 'vertical' ? 'topBottomScroll' : 'leftRightScroll'] = 'true';
    } else if (visibility !== 'none') {
      el.dataset[`${visibility}Scroll`] = 'true';
    }
  }, [orientation, visibility]);

  return (
    <div
      ref={(node) => {
        internalRef.current = node;

        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.RefObject<HTMLDivElement | null>).current = node;
      }}
      data-orientation={orientation}
      data-slot="scroll-shadow"
      style={
        {
          '--scroll-shadow-size': `${size}px`,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        'scroll-shadow',
        orientation === 'vertical' ? 'scroll-shadow--vertical' : 'scroll-shadow--horizontal',
        hideScrollBar && 'scroll-shadow--hide-scrollbar',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
