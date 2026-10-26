import { SchedulePage } from '@/features/schedule';
import { fetchSchedule } from '@/features/schedule/api/schedule';
import { buildMetadata } from '@/lib/utils/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = buildMetadata({
  title: 'Расписание выхода серий',
  description:
    'Актуальное расписание выхода новых серий аниме по дням недели. Следите за онгоингами и не пропускайте премьеры на AniLyfe.',
  path: '/schedule',
});

export default async function Page() {
  const data = await fetchSchedule('week');
  return <SchedulePage schedule={data} />;
}
