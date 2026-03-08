export type WatchStatus = 'watching' | 'planned' | 'completed' | 'on_hold' | 'dropped';

export interface UserAnimeListEntry {
  id: string;
  user_id: string;
  anime_slug: string;
  anime_name: string;
  anime_poster: string;
  status: WatchStatus;
  is_favourite: boolean;
  created_at: string;
  updated_at: string;
}
