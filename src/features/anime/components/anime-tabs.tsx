'use client';

import { getAnimeMediaVideo } from '@/features/anime/api/media-actions';
import { Anime } from '@/shared/types/anime';
import { Spinner, Tab, Tabs } from '@heroui/react';
import { Music } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
  anime: Anime;
}

type TabKey = 'info' | 'trailer' | 'op' | 'ed';

function TabLabel({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2 text-sm">
      {icon && <span className="opacity-80">{icon}</span>}
      <span>{text}</span>
    </span>
  );
}

const Video = React.memo(function Video({ id }: { id: string }) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-black">
      <iframe
        loading="lazy"
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0&modestbranding=1&controls=1&iv_load_policy=3&playsinline=1&vq=hd1080`}
        title="YouTube video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
});

function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 mb-3" />
      <p className="text-xs text-zinc-500">{text}</p>
    </div>
  );
}

export function AnimeTabs({ anime }: Props) {
  const [selected, setSelected] = useState<TabKey>('info');

  const [mediaIds, setMediaIds] = useState<{
    trailer: string | null | undefined;
    op: string | null | undefined;
    ed: string | null | undefined;
  }>({ trailer: undefined, op: undefined, ed: undefined });

  useEffect(() => {
    if (selected === 'info') return;

    const currentVal = mediaIds[selected as 'trailer' | 'op' | 'ed'];
    if (currentVal !== undefined) return;

    const fetchMedia = async () => {
      try {
        const videoId = await getAnimeMediaVideo(
          anime.id,
          anime.name.english,
          anime.year,
          selected as 'trailer' | 'op' | 'ed',
        );
        setMediaIds((prev) => ({ ...prev, [selected]: videoId }));
      } catch (e) {
        setMediaIds((prev) => ({ ...prev, [selected]: null }));
      }
    };

    fetchMedia();
  }, [selected, anime.id, anime.name.english, anime.year, mediaIds]);

  const renderContent = () => {
    switch (selected) {
      case 'info':
        return (
          <div className="p-5">
            <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-line">
              {anime.description || 'Описание отсутствует.'}
            </p>
          </div>
        );

      case 'trailer':
      case 'op':
      case 'ed':
        const videoId = mediaIds[selected];

        return (
          <div className="p-0">
            {videoId === undefined ? (
              <div className="w-full aspect-video flex items-center justify-center bg-black/20 rounded-xl">
                <Spinner color="white" />
              </div>
            ) : videoId ? (
              <Video key={videoId} id={videoId} />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-black/20 rounded-xl">
                <Empty text={`${selected.toUpperCase()} не найден`} />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <Tabs
        selectedKey={selected}
        onSelectionChange={(k) => setSelected(k as TabKey)}
        variant="underlined"
        classNames={{
          base: 'w-full',
          tabList: 'gap-2 w-full border-b border-white/10 overflow-x-hidden pb-[1px]',
          cursor: 'bg-white/40',
        }}
      >
        <Tab key="info" title={<TabLabel text="Описание" />} />
        <Tab key="trailer" title={<TabLabel text="Трейлер" />} />
        <Tab
          key="op"
          title={<TabLabel icon={<Music className="w-3.5 h-3.5" />} text="Опенинг (OP)" />}
        />
        <Tab
          key="ed"
          title={<TabLabel icon={<Music className="w-3.5 h-3.5" />} text="Эндинг (ED)" />}
        />
      </Tabs>

      <div className="relative rounded-xl overflow-hidden border border-white/10 glass shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        {renderContent()}
      </div>
    </div>
  );
}
