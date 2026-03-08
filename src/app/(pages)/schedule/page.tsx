import { SchedulePage } from '@/features/schedule';
import { fetchSchedule } from '@/features/schedule/api/schedule';

export default async function Page() {
  const data = await fetchSchedule('week');
  return <SchedulePage schedule={data} />;
}
