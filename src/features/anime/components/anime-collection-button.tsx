'use client';

import { removeAnimeEntry, upsertAnimeStatus } from '@/lib/db/actions/anime-list';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast';
import type { Anime } from '@/shared/types/anime';
import type { UserAnimeListEntry, WatchStatus } from '@/shared/types/user-anime-list';
import { cn } from '@/lib/utils/cn';
import { ChevronDown, ListPlus, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

const STATUS_OPTIONS: {
  value: WatchStatus;
  label: string;
  dot: string;
}[] = [
  { value: 'watching', label: 'Смотрю', dot: 'bg-sky-400' },
  { value: 'planned', label: 'В планах', dot: 'bg-violet-400' },
  { value: 'completed', label: 'Просмотрено', dot: 'bg-emerald-400' },
  { value: 'on_hold', label: 'Отложено', dot: 'bg-amber-400' },
  { value: 'dropped', label: 'Заброшено', dot: 'bg-rose-400' },
];

class AnimeListError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'AnimeListError';
  }
}

interface Props {
  anime: Anime;
  animeEntry: UserAnimeListEntry | null;
}

export function AnimeCollectionButton({ anime, animeEntry }: Props) {
  const [status, setStatus] = useState<WatchStatus | null>(animeEntry?.status ?? null);
  const [isPending, startTransition] = useTransition();

  const current = STATUS_OPTIONS.find((option) => option.value === status);

  const handleChange = (next: WatchStatus | null) => {
    startTransition(() => {
      const promise = (async () => {
        const result = next
          ? await upsertAnimeStatus(anime.alias, anime.name.main, anime.poster.optimized.src, next)
          : await removeAnimeEntry(anime.alias);

        if (result?.error === 'Unauthorized') {
          throw new AnimeListError(
            'Войдите в аккаунт, чтобы управлять своей коллекцией',
            'Unauthorized',
          );
        }

        if (result?.error) {
          throw new AnimeListError(
            next ? 'Не удалось обновить статус' : 'Не удалось удалить аниме',
          );
        }

        return next;
      })();

      toast.promise(promise, {
        loading: next ? 'Обновляем статус…' : 'Удаляем из списка…',

        success: (newStatus) => {
          setStatus(newStatus);

          return newStatus
            ? {
                timeout: 2200,
                title: 'Статус обновлён',
                description: `«${anime.name.main}» — ${
                  STATUS_OPTIONS.find((option) => option.value === newStatus)?.label
                }`,
              }
            : {
                timeout: 2200,
                title: 'Удалено из списка',
                description: `«${anime.name.main}» больше не в вашем списке`,
              };
        },

        error: (error) => {
          if (error instanceof AnimeListError && error.code === 'Unauthorized') {
            return {
              type: 'warning',
              timeout: 3000,
              title: 'Нужна авторизация',
              description: 'Войдите в аккаунт, чтобы собирать свою коллекцию аниме',
            };
          }

          return {
            type: 'error',
            timeout: 3000,
            title: 'Не удалось обновить список',
            description:
              error instanceof Error ? error.message : 'Что-то пошло не так, попробуйте ещё раз',
          };
        },
      });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            disabled={isPending}
            className="glass cursor-pointer h-11 w-full gap-2 px-4 text-sm font-semibold data-[popup-open]:border-white/25"
          />
        }
      >
        {current ? (
          <span className={cn('size-2 shrink-0 rounded-full', current.dot)} />
        ) : (
          <ListPlus className="size-4 shrink-0 text-muted-foreground" />
        )}

        <span className="flex-1 truncate text-left">{current?.label ?? 'Добавить в список'}</span>

        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[popup-open]/button:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        sideOffset={6}
        className="min-w-52 rounded-xl p-1.5 glass backdrop-blur-sm"
      >
        <DropdownMenuRadioGroup
          value={status ?? ''}
          onValueChange={(value) => handleChange(value as WatchStatus)}
        >
          <DropdownMenuLabel>Мой список</DropdownMenuLabel>

          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              closeOnClick
              className="py-2 text-[13px] font-medium cursor-pointer"
            >
              <span className={cn('size-2 shrink-0 rounded-full', option.dot)} />
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        {status && (
          <>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              className="py-2 text-[13px] font-medium cursor-pointer"
              onClick={() => handleChange(null)}
            >
              <Trash2 />
              Удалить из списка
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
