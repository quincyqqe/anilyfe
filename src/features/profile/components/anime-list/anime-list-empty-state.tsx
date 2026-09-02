import { BookmarkPlus } from 'lucide-react';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { EMPTY_STATE_MESSAGES } from '../../model/anime-list/constants';
import type { FilterKey } from '../../model/anime-list/types';

export function AnimeListEmptyState({ filter }: { filter: FilterKey }) {
  const message = EMPTY_STATE_MESSAGES[filter];
  return (
    <Empty className="min-h-72 rounded-xl border border-dashed border-border/70 bg-card/20 px-6 py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BookmarkPlus className="size-5" aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{message.title}</EmptyTitle>
        <EmptyDescription>{message.sub}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <p className="text-xs text-muted-foreground">
          Добавьте первый тайтл в свою библиотеку, чтобы начать.
        </p>
      </EmptyContent>
    </Empty>
  );
}
