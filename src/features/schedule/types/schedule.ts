export interface ScheduleItem {
  next_release_episode_number: number | null;
  release: {
    alias: string;
    name: { main: string; english: string | null };
    year: number;
    poster: { optimized: { src: string } };
    age_rating: { label: string; is_adult: boolean } | null;
    type: { value: string; description: string };
    genres: { id: number; name: string }[];
    publish_day: { value: number; description: string };
    is_in_production: boolean;
    episodes_total: number | null;
  };
}
