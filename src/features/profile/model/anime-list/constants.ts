import { Play, CheckCircle2, Clock, PauseCircle, XCircle, LayoutGrid } from 'lucide-react';

import type { WatchStatus } from '@/features/profile/types/profile';
import type { FilterKey } from './types';

export const FILTER_TABS = [
  {
    key: 'watching',
    label: 'Смотрю',
    icon: Play,
    color: 'text-sky-400',
  },
  {
    key: 'completed',
    label: 'Завершено',
    icon: CheckCircle2,
    color: 'text-emerald-400',
  },
  {
    key: 'planned',
    label: 'В планах',
    icon: Clock,
    color: 'text-violet-400',
  },
  {
    key: 'on_hold',
    label: 'Отложено',
    icon: PauseCircle,
    color: 'text-amber-400',
  },
  {
    key: 'dropped',
    label: 'Брошено',
    icon: XCircle,
    color: 'text-rose-400',
  },
  {
    key: 'all',
    label: 'Все',
    icon: LayoutGrid,
    color: 'text-zinc-200',
  },
] as const;

export const SORT_OPTIONS = [
  { key: 'updated', label: 'По дате обновления' },
  { key: 'name', label: 'По названию' },
  { key: 'progress', label: 'По прогрессу' },
] as const;

export interface StatusMeta {
  label: string;
  dot: string;
  textColor: string;
  barColor: string;
  pill: string;
  glowBorder: string;
  glowBg: string;
}

export const STATUS_METADATA: Record<WatchStatus, StatusMeta> = {
  watching: {
    label: 'Смотрю',
    dot: 'bg-sky-400',
    textColor: 'text-sky-400',
    barColor: 'from-sky-500 via-cyan-400 to-sky-300',
    pill: 'bg-sky-500/10 text-sky-300 border-sky-500/25 shadow-[0_0_12px_rgba(56,189,248,0.15)]',
    glowBorder: 'group-hover:border-sky-500/35',
    glowBg: 'from-sky-500/20',
  },
  completed: {
    label: 'Просмотрено',
    dot: 'bg-emerald-400',
    textColor: 'text-emerald-400',
    barColor: 'from-emerald-500 via-teal-400 to-emerald-300',
    pill: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
    glowBorder: 'group-hover:border-emerald-500/35',
    glowBg: 'from-emerald-500/20',
  },
  planned: {
    label: 'В планах',
    dot: 'bg-violet-400',
    textColor: 'text-violet-400',
    barColor: 'from-violet-500 via-indigo-400 to-purple-300',
    pill: 'bg-violet-500/10 text-violet-300 border-violet-500/25 shadow-[0_0_12px_rgba(139,92,246,0.15)]',
    glowBorder: 'group-hover:border-violet-500/35',
    glowBg: 'from-violet-500/20',
  },
  on_hold: {
    label: 'Отложено',
    dot: 'bg-amber-400',
    textColor: 'text-amber-400',
    barColor: 'from-amber-400 via-orange-400 to-amber-300',
    pill: 'bg-amber-500/10 text-amber-300 border-amber-500/25 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
    glowBorder: 'group-hover:border-amber-400/35',
    glowBg: 'from-amber-500/20',
  },
  dropped: {
    label: 'Заброшено',
    dot: 'bg-rose-400',
    textColor: 'text-rose-400',
    barColor: 'from-rose-500 via-red-400 to-rose-300',
    pill: 'bg-rose-500/10 text-rose-300 border-rose-500/25 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    glowBorder: 'group-hover:border-rose-500/35',
    glowBg: 'from-rose-500/20',
  },
};

export const STATUS_LABEL = {
  watching: 'Смотрю',
  completed: 'Просмотрено',
  on_hold: 'Отложено',
  dropped: 'Заброшено',
  planned: 'В планах',
} as const;

export const STATUS_PILL = {
  watching: STATUS_METADATA.watching.pill,
  completed: STATUS_METADATA.completed.pill,
  on_hold: STATUS_METADATA.on_hold.pill,
  dropped: STATUS_METADATA.dropped.pill,
  planned: STATUS_METADATA.planned.pill,
} as const;

export const EMPTY_STATE_MESSAGES = {
  all: {
    title: 'Список пуст',
    sub: 'Добавьте аниме в коллекцию, чтобы отслеживать свой прогресс.',
  },
  watching: {
    title: 'Нет активного просмотра',
    sub: 'Выберите тайтл из каталога и начните смотреть прямо сейчас.',
  },
  completed: {
    title: 'Пока нет завершённых',
    sub: 'Просмотренные до конца аниме автоматически сохраняются здесь.',
  },
  planned: {
    title: 'Список планов пуст',
    sub: 'Добавьте интересные тайтлы, чтобы не потерять их в будущем.',
  },
  on_hold: {
    title: 'Отложенных тайтлов нет',
    sub: 'Здесь будут сериалы, просмотр которых временно приостановлен.',
  },
  dropped: {
    title: 'Заброшенных тайтлов нет',
    sub: 'Аниме, от которых вы решили отказаться, появятся здесь.',
  },
} satisfies Record<FilterKey, { title: string; sub: string }>;
