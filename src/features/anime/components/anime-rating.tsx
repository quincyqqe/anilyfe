import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function AnimeRating({ score }: { score: number }) {
  return (
    <div className="pointer-events-none absolute top-3 right-0 z-20 translate-x-1/2">
      <Tooltip>
        <TooltipTrigger>
          <div className="pointer-events-auto flex h-7 min-w-9 items-center justify-center rounded-md border border-white/20 bg-white/15 px-2 shadow-md backdrop-blur-md">
            <span className="text-sm font-bold leading-none text-white drop-shadow-sm">
              {score}
            </span>
          </div>
        </TooltipTrigger>

        <TooltipContent>
          <p>Средняя оценка тайтла по мнению зрителей</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
