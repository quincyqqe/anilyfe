import type { WatchStatus } from '@/features/profile/types/profile';

export type FilterKey = WatchStatus | 'all';

export type SortKey =
  | 'name'
  | 'score'
  | 'progress'
  | 'updated';

export type ViewMode = 'grid' | 'list';
