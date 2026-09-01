export type WatchStatus = 'watching' | 'completed' | 'on_hold' | 'dropped' | 'planned';

export interface UserAnimeEntry {
  id: string;
  user_id: string;
  anime_name: string;
  anime_poster: string;
  anime_slug: string;
  status: WatchStatus;
  score: number | null;
  total_episodes: number | null;
  episodes_watched: number | null;
  current_episode: number | null;
  episode_duration: number | null;
  episode_progress: number | null;
  is_favourite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  background_url: string | null;
  is_admin: boolean;
  created_at: string;

  user_anime_list?: UserAnimeEntry[];
}
