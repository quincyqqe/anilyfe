'use client';

import { useEffect } from 'react';

interface MediaSessionMetadataProps {
  animeTitle: string;
  episodeTitle: string;
  poster?: string;
}

export function MediaSessionMetadata({
  animeTitle,
  episodeTitle,
  poster,
}: MediaSessionMetadataProps) {
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const artwork = poster
      ? [
          {
            src: poster,
            sizes: '512x512',
            type: 'image/jpeg',
          },
        ]
      : [];

    navigator.mediaSession.metadata = new MediaMetadata({
      title: episodeTitle,
      artist: animeTitle,
      album: 'AniLyfe',
      artwork,
    });

    return () => {
      navigator.mediaSession.metadata = null;
    };
  }, [animeTitle, episodeTitle, poster]);

  return null;
}
