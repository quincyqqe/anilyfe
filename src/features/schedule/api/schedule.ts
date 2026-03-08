import { ENDPOINTS } from '@/shared/constants/endpoints';
import { ScheduleItem } from '@/features/schedule/types/schedule';
import { safeFetch } from '@/shared/api/client';

export async function fetchSchedule(date: string): Promise<ScheduleItem[]> {
  try {
    const data = await safeFetch<ScheduleItem[]>(ENDPOINTS.schedule(date));

    return (data ?? []).filter((schedule) => schedule.release !== null);
  } catch {
    return [];
  }
}
