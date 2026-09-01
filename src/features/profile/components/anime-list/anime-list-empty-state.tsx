'use client';

import { motion } from 'framer-motion';
import { BookmarkPlus } from 'lucide-react';
import { EMPTY_STATE_MESSAGES } from '../../model/anime-list/constants';
import type { FilterKey } from '../../model/anime-list/types';

export function AnimeListEmptyState({ filter }: { filter: FilterKey }) {
  const message = EMPTY_STATE_MESSAGES[filter];
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="col-span-full flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.02] px-6 text-center"
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <BookmarkPlus className="size-6" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-foreground">{message.title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{message.sub}</p>
      </div>
    </motion.div>
  );
}
