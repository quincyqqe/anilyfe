'use client';

import { useEffect, useState } from 'react';

interface Props {
  episode: number;
  airingAt: number;
}

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

function getTimeLeft(airingAt: number) {
  return Math.max(airingAt * SECOND - Date.now(), 0);
}

export function AnimeNextEpisode({ episode, airingAt }: Props) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(airingAt));

  useEffect(() => {
    const update = () => {
      setTimeLeft(getTimeLeft(airingAt));
    };

    const interval = window.setInterval(update, SECOND);

    return () => window.clearInterval(interval);
  }, [airingAt]);

  if (timeLeft <= 0) return null;

  const days = Math.floor(timeLeft / DAY);
  const hours = Math.floor((timeLeft % DAY) / HOUR);
  const minutes = Math.floor((timeLeft % HOUR) / MINUTE);
  const seconds = Math.floor((timeLeft % MINUTE) / SECOND);

  const timeBlocks = [
    ['Дней', days],
    ['Часов', hours],
    ['Минут', minutes],
    ['Секунд', seconds],
  ] as const;

  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4">
      <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-rose-500/20 blur-2xl" />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 py-1.5 text-xs font-semibold tracking-wide text-rose-400">
          <span className="relative flex size-2">
            <span className="absolute size-full animate-ping rounded-full bg-rose-400 opacity-75" />
            <span className="relative size-2 rounded-full bg-rose-500" />
          </span>

          <span>🇯🇵 ПРЕМЬЕРА В ЯПОНИИ</span>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <h3 className="text-lg font-bold tracking-tight text-zinc-50">Эпизод {episode}</h3>

          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Выходит через
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {timeBlocks.map(([label, value]) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-1 py-2.5 transition-colors hover:border-rose-500/30 hover:bg-white/[0.07]"
            >
              <span className="font-mono text-xl font-bold tracking-tight text-white sm:text-2xl">
                {String(value).padStart(2, '0')}
              </span>

              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-500">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
