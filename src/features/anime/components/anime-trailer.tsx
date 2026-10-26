'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/utils/use-media-query';

interface Props {
  trailer: string;
}

const YOUTUBE_NOCOOKIE_ORIGIN = 'https://www.youtube-nocookie.com';
const DEFAULT_VOLUME = 40;

const BUTTON_CLASS_NAME =
  'size-9 rounded-full bg-black/50 text-white/80 shadow-lg hover:bg-black/70 hover:text-white';

type YouTubeCommand = 'mute' | 'unMute' | 'setVolume' | 'playVideo' | 'pauseVideo';

interface YouTubePlayer {
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        iframe: HTMLIFrameElement,
        options: {
          events: {
            onReady: (event: { target: YouTubePlayer }) => void;
            onStateChange: (event: { data: number }) => void;
            onError: () => void;
          };
        },
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export function AnimeTrailer({ trailer }: Props) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const userPausedRef = useRef(false);

  const [muted, setMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    setMuted(true);
    setIsPaused(false);
    setHasStartedPlayback(false);
    setIsUnavailable(false);
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
      origin: typeof window === 'undefined' ? '' : window.location.origin,
      widget_referrer: typeof window === 'undefined' ? '' : window.location.href,
    });

    return `${YOUTUBE_NOCOOKIE_ORIGIN}/embed/${encodeURIComponent(trailer)}?${params}`;
  }, [trailer]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!isDesktop || !iframe) return;

    let player: YouTubePlayer | null = null;
    let cancelled = false;
    const previousReady = window.onYouTubeIframeAPIReady;

    const initializePlayer = () => {
      if (cancelled || player || !window.YT?.Player) return;
      player = new window.YT.Player(iframe, {
        events: {
          onReady: ({ target }) => {
            playerRef.current = target;
            target.mute();
            target.playVideo();
          },
          onStateChange: ({ data }) => {
            if (data === 1) setHasStartedPlayback(true);
          },
          onError: () => setIsUnavailable(true),
        },
      });
    };

    if (window.YT?.Player) initializePlayer();
    else {
      window.onYouTubeIframeAPIReady = () => {
        previousReady?.();
        initializePlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (window.onYouTubeIframeAPIReady !== previousReady) {
        window.onYouTubeIframeAPIReady = previousReady;
      }
      player?.destroy();
      playerRef.current = null;
    };
  }, [isDesktop, trailer]);

  const sendCommand = useCallback((command: YouTubeCommand, args: (string | number)[] = []) => {
    const player = playerRef.current;
    if (!player) return;
    if (command === 'mute') player.mute();
    if (command === 'unMute') player.unMute();
    if (command === 'setVolume') player.setVolume(Number(args[0]));
    if (command === 'playVideo') player.playVideo();
    if (command === 'pauseVideo') player.pauseVideo();
  }, []);
  useEffect(() => {
    if (!containerRef.current || !hasStartedPlayback || !isDesktop) return;

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
  }, [isDesktop, hasStartedPlayback, sendCommand]);

  const handleMuteToggle = useCallback(() => {
    if (!hasStartedPlayback) return;

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
  }, [hasStartedPlayback, sendCommand]);

  const handlePlayToggle = useCallback(() => {
    if (!hasStartedPlayback) return;

    setIsPaused((currentPaused) => {
      const nextPaused = !currentPaused;

      userPausedRef.current = nextPaused;
      sendCommand(nextPaused ? 'pauseVideo' : 'playVideo');

      return nextPaused;
    });
  }, [hasStartedPlayback, sendCommand]);

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
          key={trailer}
          ref={iframeRef}
          src={trailerSrc}
          title="Anime Trailer"
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          className="
              pointer-events-none absolute left-1/2 top-1/2
              aspect-video w-screen min-w-[520px]
              -translate-x-1/2 -translate-y-1/2
              scale-[1.15]
              border-0
              brightness-75 saturate-125
              transition-opacity duration-300
            "
          style={{ opacity: hasStartedPlayback && !isUnavailable ? 1 : 0 }}
        />
      </div>

      {!isUnavailable && hasStartedPlayback && (
        <div className="absolute right-4 top-[20.5rem] z-40 flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={!hasStartedPlayback}
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
            disabled={!hasStartedPlayback}
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
      )}
    </>
  );
}
