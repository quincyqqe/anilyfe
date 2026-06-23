import { Play, CheckCircle, BookmarkPlus, PauseCircle, XCircle } from 'lucide-react';

import type { FilterKey } from './types';

export const FILTER_TABS = [
  {
    key: 'all',
    label: 'Все',
    icon: BookmarkPlus,
    color: 'text-white/80',
    activeClass: 'text-white',
    activeBg: 'bg-white/10 border-white/5',
  },
  {
    key: 'watching',
    label: 'Смотрю',
    icon: Play,
    color: 'text-blue-400',
    activeClass: 'text-blue-400',
    activeBg: 'bg-blue-500/10 border-blue-500/20',
  },
  {
    key: 'completed',
    label: 'Завершено',
    icon: CheckCircle,
    color: 'text-emerald-400',
    activeClass: 'text-emerald-400',
    activeBg: 'bg-emerald-500/10 border-emerald-500/20',
  },
  {
    key: 'planned',
    label: 'В планах',
    icon: BookmarkPlus,
    color: 'text-violet-400',
    activeClass: 'text-violet-400',
    activeBg: 'bg-violet-500/10 border-violet-500/20',
  },
  {
    key: 'on_hold',
    label: 'Отложено',
    icon: PauseCircle,
    color: 'text-amber-400',
    activeClass: 'text-amber-400',
    activeBg: 'bg-amber-500/10 border-amber-500/20',
  },
  {
    key: 'dropped',
    label: 'Брошено',
    icon: XCircle,
    color: 'text-red-400',
    activeClass: 'text-red-400',
    activeBg: 'bg-red-500/10 border-red-500/20',
  },
] as const;

export const SORT_OPTIONS = [
  { key: 'updated', label: 'По дате обновления' },
  { key: 'name', label: 'По названию' },
  { key: 'progress', label: 'По прогрессу' },
] as const;

export const STATUS_LABEL = {
  watching: 'Смотрю',
  completed: 'Просмотрено',
  on_hold: 'На паузе',
  dropped: 'Отложено',
  planned: 'В планах',
} as const;

export const STATUS_PILL = {
  watching: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  on_hold: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  dropped: 'bg-red-500/10 text-red-400 border-red-500/20',
  planned: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
} as const;

export const STATUS_BAR = {
  watching: 'bg-blue-400',
  completed: 'bg-emerald-400',
  on_hold: 'bg-amber-400',
  dropped: 'bg-red-400',
  planned: 'bg-violet-400',
} as const;

export const EMPTY_STATE_MESSAGES = {
  all: {
    title: 'Список пуст',
    sub: 'Добавьте аниме, чтобы оно появилось здесь.',
  },
  watching: {
    title: 'Нет активного просмотра',
    sub: 'Выберите тайтл и начните смотреть.',
  },
  completed: {
    title: 'Пока нет завершённых',
    sub: 'Завершённые тайтлы появятся здесь.',
  },
  planned: {
    title: 'Пустой список планов',
    sub: 'Добавьте что-нибудь в список будущего просмотра.',
  },
  on_hold: {
    title: 'Пауза пока пуста',
    sub: 'Тайтлы на паузе появятся здесь.',
  },
  dropped: {
    title: 'Пока ничего не брошено',
    sub: 'Здесь будут отложенные тайтлы.',
  },
} satisfies Record<FilterKey, { title: string; sub: string }>;
