'use client';

import { useCallback, useEffect, type KeyboardEvent, type RefObject } from 'react';

interface IOSVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
  webkitExitFullscreen?: () => void;
  webkitDisplayingFullscreen?: boolean;
  webkitSetPresentationMode?: (mode: 'inline' | 'picture-in-picture') => void;
  webkitPresentationMode?: 'inline' | 'picture-in-picture';
}

interface UsePlayerBrowserOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  title?: string;
  artist?: string;
  artwork?: string;
  togglePlay: () => void;
  seekRelative: (delta: number) => void;
  setVolume: (value: number) => void;
  toggleMute: () => void;
  onFullscreenChange: (value: boolean) => void;
  onPipChange: (value: boolean) => void;
  onPipSupportChange: (value: boolean) => void;
}

export function usePlayerBrowser({
  videoRef,
  containerRef,
  title,
  artist,
  artwork,
  togglePlay,
  seekRelative,
  setVolume,
  toggleMute,
  onFullscreenChange,
  onPipChange,
  onPipSupportChange,
}: UsePlayerBrowserOptions) {
  const toggleFullscreen = useCallback(() => {
    const video = videoRef.current as IOSVideoElement | null;
    const container = containerRef.current;

    if (!container) return;

    if (typeof container.requestFullscreen !== 'function') {
      if (video?.webkitEnterFullscreen && !video.webkitDisplayingFullscreen) {
        video.webkitEnterFullscreen();
      } else if (video?.webkitExitFullscreen && video.webkitDisplayingFullscreen) {
        video.webkitExitFullscreen();
      }
      return;
    }

    if (document.fullscreenElement === container) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }

    container.requestFullscreen().catch(() => {
      video?.webkitEnterFullscreen?.();
    });
  }, [containerRef, videoRef]);

  const togglePip = useCallback(async () => {
    const video = videoRef.current as IOSVideoElement | null;
    if (!video) return;

    try {
      if (document.pictureInPictureElement === video) {
        await document.exitPictureInPicture();
        return;
      }

      if (typeof video.requestPictureInPicture === 'function') {
        await video.requestPictureInPicture();
        return;
      }

      if (video.webkitSetPresentationMode) {
        video.webkitSetPresentationMode('picture-in-picture');
      }
    } catch {
      // Unsupported or denied PiP is represented by the unchanged state.
    }
  }, [videoRef]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      if (
        target.closest(
          'button, input, textarea, select, [role="menuitem"], [contenteditable="true"]',
        )
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case ' ':
        case 'k':
          event.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
          event.preventDefault();
          seekRelative(-10);
          break;
        case 'arrowright':
          event.preventDefault();
          seekRelative(10);
          break;
        case 'arrowup':
          event.preventDefault();
          setVolume((videoRef.current?.volume ?? 1) + 0.05);
          break;
        case 'arrowdown':
          event.preventDefault();
          setVolume((videoRef.current?.volume ?? 1) - 0.05);
          break;
        case 'm':
          event.preventDefault();
          toggleMute();
          break;
        case 'f':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'escape':
          if (document.fullscreenElement) {
            event.preventDefault();
            document.exitFullscreen().catch(() => undefined);
          }
          break;
      }
    },
    [seekRelative, setVolume, toggleFullscreen, toggleMute, togglePlay, videoRef],
  );

  useEffect(() => {
    const video = videoRef.current as IOSVideoElement | null;
    if (!video) return;

    const syncFullscreen = () => {
      onFullscreenChange(
        document.fullscreenElement === containerRef.current ||
          Boolean(video.webkitDisplayingFullscreen),
      );
    };
    const syncPip = () => {
      onPipChange(
        document.pictureInPictureElement === video ||
          video.webkitPresentationMode === 'picture-in-picture',
      );
    };

    onPipSupportChange(
      (document.pictureInPictureEnabled !== false &&
        typeof video.requestPictureInPicture === 'function') ||
        typeof video.webkitSetPresentationMode === 'function',
    );

    document.addEventListener('fullscreenchange', syncFullscreen);
    video.addEventListener('webkitbeginfullscreen', syncFullscreen);
    video.addEventListener('webkitendfullscreen', syncFullscreen);
    video.addEventListener('enterpictureinpicture', syncPip);
    video.addEventListener('leavepictureinpicture', syncPip);

    return () => {
      document.removeEventListener('fullscreenchange', syncFullscreen);
      video.removeEventListener('webkitbeginfullscreen', syncFullscreen);
      video.removeEventListener('webkitendfullscreen', syncFullscreen);
      video.removeEventListener('enterpictureinpicture', syncPip);
      video.removeEventListener('leavepictureinpicture', syncPip);
    };
  }, [containerRef, onFullscreenChange, onPipChange, onPipSupportChange, videoRef]);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || 'Anilyfe',
      artist: artist || 'Anilyfe',
      artwork: artwork ? [{ src: artwork, sizes: '512x512', type: 'image/jpeg' }] : [],
    });

    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ['play', () => videoRef.current?.play()],
      ['pause', () => videoRef.current?.pause()],
      ['seekbackward', () => seekRelative(-10)],
      ['seekforward', () => seekRelative(10)],
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Browsers expose different subsets of Media Session actions.
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Ignore unsupported cleanup operations.
        }
      }
    };
  }, [artist, artwork, seekRelative, title, videoRef]);

  return { handleKeyDown, toggleFullscreen, togglePip };
}
