'use client';

import { motion } from 'framer-motion';
import { BookmarkPlus } from 'lucide-react';
import { EMPTY_STATE_MESSAGES } from '../../model/anime-list/constants';
import type { FilterKey } from '../../model/anime-list/types';

interface AnimeListEmptyStateProps {
  filter: FilterKey;
}

export function AnimeListEmptyState({ filter }: AnimeListEmptyStateProps) {
  const message = EMPTY_STATE_MESSAGES[filter];

  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="col-span-full flex flex-col items-center justify-center gap-3 py-20 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/5">
        <BookmarkPlus className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-semibold text-foreground">{message.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{message.sub}</p>
      </div>
    </motion.div>
  );
}
