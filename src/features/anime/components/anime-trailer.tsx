'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/utils/use-media-query';

interface Props {
  trailer: string;
}

const YOUTUBE_NOCOOKIE_ORIGIN = 'https://www.youtube-nocookie.com';
const DEFAULT_VOLUME = 60;

const BUTTON_CLASS_NAME =
  'size-9 rounded-full bg-black/50 text-white/80 shadow-lg hover:bg-black/70 hover:text-white';

type YouTubeCommand = 'mute' | 'unMute' | 'setVolume' | 'playVideo' | 'pauseVideo';

export function AnimeTrailer({ trailer }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const userPausedRef = useRef(false);

  const [muted, setMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    setMuted(true);
    setIsPaused(false);
    setIsPlayerReady(false);
    userPausedRef.current = false;
  }, [trailer]);

  const trailerSrc = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      playsinline: '1',
      controls: '0',
      disablekb: '1',
      fs: '0',
      iv_load_policy: '3',
      rel: '0',
      cc_load_policy: '0',
      enablejsapi: '1',
    });

    return `${YOUTUBE_NOCOOKIE_ORIGIN}/embed/${encodeURIComponent(trailer)}?${params}`;
  }, [trailer]);

  const sendCommand = useCallback((command: YouTubeCommand, args: (string | number)[] = []) => {
    const playerWindow = iframeRef.current?.contentWindow;

    if (!playerWindow) return;

    playerWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func: command,
        args,
      }),
      YOUTUBE_NOCOOKIE_ORIGIN,
    );
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isPlayerReady || !isDesktop) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!userPausedRef.current) {
            sendCommand('playVideo');
            setIsPaused(false);
          }
        } else {
          sendCommand('pauseVideo');
          setIsPaused(true);
        }
      },
      { threshold: 0 },
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isDesktop, isPlayerReady, sendCommand]);

  const handleMuteToggle = useCallback(() => {
    if (!isPlayerReady) return;

    setMuted((currentMuted) => {
      const nextMuted = !currentMuted;

      if (nextMuted) {
        sendCommand('mute');
      } else {
        sendCommand('unMute');
        sendCommand('setVolume', [DEFAULT_VOLUME]);
      }

      return nextMuted;
    });
  }, [isPlayerReady, sendCommand]);

  const handlePlayToggle = useCallback(() => {
    if (!isPlayerReady) return;

    setIsPaused((currentPaused) => {
      const nextPaused = !currentPaused;

      userPausedRef.current = nextPaused;
      sendCommand(nextPaused ? 'pauseVideo' : 'playVideo');

      return nextPaused;
    });
  }, [isPlayerReady, sendCommand]);

  if (!isDesktop) return null;

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden="true"
        className={`
          pointer-events-none absolute inset-x-0 top-0 z-10 h-96 overflow-hidden
          [mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]
          [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]
          motion-reduce:hidden
          transition-opacity duration-700 ease-in-out
          ${isPaused ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <iframe
          ref={iframeRef}
          src={trailerSrc}
          title="Anime Trailer"
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setIsPlayerReady(true)}
          className="
            pointer-events-none absolute left-1/2 top-1/2
            aspect-video w-screen min-w-[520px]
            -translate-x-1/2 -translate-y-1/2
            scale-[1.15]
            border-0
            brightness-75 saturate-125
          "
        />
      </div>

      <div className="absolute right-4 top-[20.5rem] z-40 flex gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!isPlayerReady}
          onClick={handlePlayToggle}
          aria-label={isPaused ? 'Воспроизвести трейлер' : 'Поставить трейлер на паузу'}
          aria-pressed={!isPaused}
          className={BUTTON_CLASS_NAME}
        >
          {isPaused ? (
            <Play className="size-4" aria-hidden="true" />
          ) : (
            <Pause className="size-4" aria-hidden="true" />
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!isPlayerReady}
          onClick={handleMuteToggle}
          aria-label={muted ? 'Включить звук трейлера' : 'Выключить звук трейлера'}
          aria-pressed={!muted}
          className={BUTTON_CLASS_NAME}
        >
          {muted ? (
            <VolumeX className="size-4" aria-hidden="true" />
          ) : (
            <Volume2 className="size-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    </>
  );
}
