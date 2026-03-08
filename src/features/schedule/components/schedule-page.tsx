'use client';

import { daysOfWeek } from '@/shared/constants';
import { cn } from '@/lib/utils/cn';
import { AnimeCard } from '@/components/anime-card';
import { useScheduleDay } from '../hooks/use-schedule-day';
import type { ScheduleItem } from '@/features/schedule/types/schedule';

export function SchedulePage({ schedule }: { schedule: ScheduleItem[] }) {
  const { currentDay, setDay } = useScheduleDay();

  const countByDay = daysOfWeek.reduce<Record<string, number>>((acc, day) => {
    acc[day.id] = schedule.filter(
      (item) => item.release.publish_day?.value === day.value && item.next_release_episode_number,
    ).length;
    return acc;
  }, {});

  const getAnimeForDay = (dayId: string) => {
    const dayValue = daysOfWeek.find((d) => d.id === dayId)?.value;
    return schedule.filter(
      (item) => item.release.publish_day?.value === dayValue && item.next_release_episode_number,
    );
  };

  return (
    <main className="min-h-screen w-full pt-28 px-4">
      <div className="container mx-auto">
        <h1 className="font-black text-4xl sm:text-5xl text-white mb-12">Расписание</h1>

        <div className="flex gap-8 lg:gap-16">
          <div className="relative flex flex-col shrink-0">
            <div className="absolute left-[9px] top-3 bottom-3 w-px bg-white/8" />

            {daysOfWeek.map((day, idx) => {
              const isActive = day.id === currentDay;
              const count = countByDay[day.id] ?? 0;
              const isLast = idx === daysOfWeek.length - 1;

              return (
                <button
                  key={day.id}
                  onClick={() => setDay(day.id)}
                  className={cn(
                    'relative flex items-center gap-4 text-left transition-all duration-200 group',
                    !isLast && 'pb-8',
                  )}
                >
                  <div
                    className={cn(
                      'relative z-10 w-[18px] h-[18px] rounded-full border-2 shrink-0 transition-all duration-200 flex items-center justify-center',
                      isActive
                        ? 'border-primary bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]'
                        : 'border-white/20 bg-background group-hover:border-white/50',
                    )}
                  >
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>

                  <div className="flex flex-col gap-0.5 min-w-[80px]">
                    <span
                      className={cn(
                        'text-sm font-semibold transition-colors duration-200 leading-none',
                        isActive ? 'text-white' : 'text-white/60 group-hover:text-white/60',
                      )}
                    >
                      <span className="hidden sm:block">{day.label}</span>
                      <span className="sm:hidden">{day.shortLabel}</span>
                    </span>
                    {count > 0 && (
                      <span
                        className={cn(
                          'text-[11px] leading-none transition-colors duration-200',
                          isActive ? 'text-primary' : 'text-white/20 group-hover:text-white/40',
                        )}
                      >
                        {count} аниме
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-w-0">
            {getAnimeForDay(currentDay).length === 0 ? (
              <div className="flex items-center justify-center py-24 rounded-2xl border border-white/5 bg-white/[0.02]">
                <p className="text-white/25 text-base">Нет запланированных эпизодов</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                {getAnimeForDay(currentDay).map((item: any) => (
                  <AnimeCard key={item.release.alias} anime={item.release} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
