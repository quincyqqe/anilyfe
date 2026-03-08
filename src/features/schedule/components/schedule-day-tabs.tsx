'use client';

import { daysOfWeek } from '@/shared/constants';
import { cn } from '@/lib/utils/cn';
import type { ScheduleItem } from '@/features/schedule/types/schedule';

interface Props {
  currentDay: string;
  onDayChange: (id: string) => void;
  data: ScheduleItem[];
}

export function ScheduleDayTabs({ currentDay, onDayChange, data }: Props) {
  const countByDay = daysOfWeek.reduce<Record<string, number>>((acc, day) => {
    acc[day.id] = data.filter(
      (item) => item.release.publish_day?.value === day.value && item.next_release_episode_number,
    ).length;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(countByDay), 1);

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Bar chart */}
      <div className="flex items-end justify-between gap-2 h-20 mb-3 px-1">
        {daysOfWeek.map((day) => {
          const count = countByDay[day.id] ?? 0;
          const heightPercent = (count / maxCount) * 100;
          const isActive = day.id === currentDay;

          return (
            <button
              key={day.id}
              onClick={() => onDayChange(day.id)}
              className="flex-1 flex flex-col items-center gap-1.5 group"
            >
              {/* Count */}
              <span
                className={cn(
                  'text-[11px] font-medium transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-white/20 group-hover:text-white/50',
                )}
              >
                {count > 0 ? count : ''}
              </span>

              {/* Bar */}
              <div className="w-full flex items-end justify-center" style={{ height: '52px' }}>
                <div
                  className={cn(
                    'w-full rounded-t-md transition-all duration-300',
                    isActive
                      ? 'bg-primary shadow-[0_0_12px_rgba(var(--primary-rgb),0.5)]'
                      : 'bg-white/8 group-hover:bg-white/15',
                  )}
                  style={{
                    height: count > 0 ? `${Math.max(heightPercent, 8)}%` : '4px',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Day labels */}
      <div className="flex items-center justify-between gap-2 px-1">
        {daysOfWeek.map((day) => {
          const isActive = day.id === currentDay;
          return (
            <button
              key={day.id}
              onClick={() => onDayChange(day.id)}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              {/* Dot indicator */}
              <div
                className={cn(
                  'w-1 h-1 rounded-full transition-all duration-200',
                  isActive ? 'bg-primary scale-125' : 'bg-white/20 group-hover:bg-white/40',
                )}
              />

              <span
                className={cn(
                  'text-xs font-semibold transition-colors duration-200 hidden sm:block',
                  isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60',
                )}
              >
                {day.label}
              </span>
              <span
                className={cn(
                  'text-xs font-semibold transition-colors duration-200 sm:hidden',
                  isActive ? 'text-white' : 'text-white/30 group-hover:text-white/60',
                )}
              >
                {day.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
