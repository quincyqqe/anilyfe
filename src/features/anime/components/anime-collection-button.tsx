'use client';

import { removeAnimeEntry, upsertAnimeStatus } from '@/lib/db/actions/anime-list';
import type { Anime } from '@/shared/types/anime';
import type { UserAnimeListEntry, WatchStatus } from '@/shared/types/user-anime-list';
import {
  addToast,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@heroui/react';
import { useState, useTransition } from 'react';
import { FaCheck, FaPlus } from 'react-icons/fa';

const STATUS_OPTIONS: { key: WatchStatus; label: string }[] = [
  { key: 'watching', label: 'Смотрю' },
  { key: 'planned', label: 'В планах' },
  { key: 'completed', label: 'Просмотрено' },
  { key: 'on_hold', label: 'Отложено' },
  { key: 'dropped', label: 'Заброшено' },
];

interface Props {
  anime: Anime;
  animeEntry: UserAnimeListEntry | null;
}

export function AnimeCollectionButton({ anime, animeEntry }: Props) {
  const [status, setStatus] = useState<WatchStatus | null>(animeEntry?.status ?? null);
  const [isPending, startTransition] = useTransition();

  const currentLabel = STATUS_OPTIONS.find((o) => o.key === status)?.label;

  const handleSelect = (key: string) => {
    const newStatus = key as WatchStatus;

    if (!animeEntry) {
      addToast({
        title: 'Ошибка',
        description: 'Вы должны авторизоваться, чтобы добавить аниме в список',
        color: 'danger',
      });
      return;
    }

    startTransition(async () => {
      const result = await upsertAnimeStatus(
        anime.alias,
        anime.name.main,
        anime.poster.optimized.src,
        newStatus,
      );

      if (result?.error) {
        addToast({
          title: 'Ошибка',
          description: 'Не удалось обновить статус',
          color: 'danger',
        });
        return;
      }

      setStatus(newStatus);
    });
  };

  const handleRemove = () => {
    setStatus(null);

    startTransition(async () => {
      const result = await removeAnimeEntry(anime.alias);
      if (result?.error) {
        setStatus(animeEntry?.status ?? null);
        console.error(result.error);
      }
    });
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          className={`
      w-full h-11 font-semibold
      rounded-2xl
      glass


    `}
          isLoading={isPending}
        >
          {status ? (
            <>
              <FaCheck className="h-4 w-4" />
              {currentLabel}
            </>
          ) : (
            <>
              <FaPlus className="h-4 w-4" />
              Добавить в список
            </>
          )}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        className="w-56"
        variant="solid"
        color="primary"
        onAction={(key) => {
          if (key === 'remove') return handleRemove();
          handleSelect(key as string);
        }}
      >
        {[
          ...STATUS_OPTIONS.map((opt) => (
            <DropdownItem
              key={opt.key}
              className={status === opt.key ? 'bg-primary/50 text-white' : ''}
            >
              {opt.label}
            </DropdownItem>
          )),
          ...(status
            ? [
                <DropdownItem key="remove" className="text-red-400">
                  Удалить из списка
                </DropdownItem>,
              ]
            : []),
        ]}
      </DropdownMenu>
    </Dropdown>
  );
}
