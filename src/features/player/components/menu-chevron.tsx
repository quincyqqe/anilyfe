'use client';

import type { ReactNode } from 'react';
import { ChevronIcon } from '@videojs/react/icons';

interface MenuChevronProps {
  flipped?: boolean;
}

export function MenuChevron({ flipped = false }: MenuChevronProps): ReactNode {
  return (
    <ChevronIcon
      className={`media-icon media-menu__chevron ${flipped ? 'media-icon--flipped' : ''}`}
    />
  );
}
