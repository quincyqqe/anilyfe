import type Artplayer from 'artplayer';
import type { AnimeEpisode } from '@/shared/types/anime';

const AUTO_HIDE_DELAY_MS = 10_000; // скрываем через 5 секунд если не нажали

interface Segment {
  start: number;
  stop: number;
  label: string;
}

function getSegments(episode: AnimeEpisode): Segment[] {
  const segments: Segment[] = [];

  const { opening, ending } = episode;

  if (opening.start !== null && opening.stop !== null)
    segments.push({ start: opening.start, stop: opening.stop, label: 'Пропустить опенинг' });

  if (ending.start !== null && ending.stop !== null)
    segments.push({ start: ending.start, stop: ending.stop, label: 'Пропустить эндинг' });

  return segments;
}

function showBtn(btn: HTMLButtonElement, label: string) {
  btn.textContent = label;
  btn.classList.remove('opacity-0', 'pointer-events-none');
  btn.classList.add('opacity-100');
}

function hideBtn(btn: HTMLButtonElement) {
  btn.classList.remove('opacity-100');
  btn.classList.add('opacity-0', 'pointer-events-none');
}

export function mountSkipSegments(art: Artplayer, episode: AnimeEpisode): void {
  const segments = getSegments(episode);
  if (!segments.length) return;

  const btn = document.createElement('button');
  btn.className = [
    'absolute bottom-16 right-4',
    'px-4 py-2 rounded-xl',
    'bg-black/70 backdrop-blur-sm',
    'border border-white/20',
    'text-white text-sm font-semibold',
    'opacity-0 pointer-events-none',
    'transition-opacity duration-200',
    'hover:bg-black/90 cursor-pointer',
    'z-50',
  ].join(' ');

  art.layers.add({
    name: 'skipSegment',
    mounted(container) {
      container.appendChild(btn);
    },
  });

  let activeSegment: Segment | null = null;
  let autoHideTimer: ReturnType<typeof setTimeout> | null = null;

  // Сбрасываем таймер автоскрытия
  function resetAutoHide(segment: Segment) {
    if (autoHideTimer !== null) {
      clearTimeout(autoHideTimer);
      autoHideTimer = null;
    }

    autoHideTimer = setTimeout(() => {
      // Прячем кнопку, но сегмент остаётся активным —
      // при следующем timeupdate мы НЕ показываем снова (dismissed = true)
      hideBtn(btn);
      dismissedSegment = segment;
      autoHideTimer = null;
    }, AUTO_HIDE_DELAY_MS);
  }

  // Сегмент который пользователь проигнорировал (не нажал — скрылась сама)
  let dismissedSegment: Segment | null = null;

  art.on('video:timeupdate', () => {
    const time = art.currentTime;
    const matched = segments.find((s) => time >= s.start && time < s.stop) ?? null;

    // Пользователь вышел из сегмента — сбрасываем dismissed
    if (!matched && dismissedSegment !== null) {
      dismissedSegment = null;
    }

    // Состояние не изменилось — ничего не делаем
    if (matched === activeSegment) return;

    activeSegment = matched;

    // Очищаем предыдущий таймер при любой смене сегмента
    if (autoHideTimer !== null) {
      clearTimeout(autoHideTimer);
      autoHideTimer = null;
    }

    if (!matched) {
      hideBtn(btn);
      return;
    }

    // Сегмент уже был проигнорирован пользователем — не показываем снова
    if (matched === dismissedSegment) return;

    showBtn(btn, matched.label);
    resetAutoHide(matched);

    const handleClick = () => {
      // Нажали — прыгаем, сбрасываем таймер, прячем кнопку
      art.currentTime = matched.stop;

      if (autoHideTimer !== null) {
        clearTimeout(autoHideTimer);
        autoHideTimer = null;
      }

      hideBtn(btn);
      btn.removeEventListener('click', handleClick);
    };

    btn.addEventListener('click', handleClick);
  });

  // Чистим таймер при уничтожении плеера
  art.on('destroy', () => {
    if (autoHideTimer !== null) clearTimeout(autoHideTimer);
  });
}
