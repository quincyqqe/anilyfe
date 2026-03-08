export interface Anime {
  id: number;
  type: {
    value: string;
    description: string;
  };
  year: number;
  name: {
    main: string;
    english: string;
    alternative: string | null;
  };
  alias: string;
  season: {
    value: string | null;
    description: string | null;
  };

  release: Release;

  poster: {
    src: string;
    thumbnail: string;
    optimized: {
      src: string;
      thumbnail: string;
    };
  };
  fresh_at: string | null;
  created_at: string | null;
  updated_at: string;
  age_rating: {
    value: string;
    label: string;
    is_adult: boolean;
    description: string;
  };
  publish_day: {
    value: number;
    description: string;
  };
  description: string;
  episodes_total: number | null;
  external_player: string | null;
  is_in_production: boolean;
  is_blocked_by_geo: boolean;
  episodes_are_unknown: boolean;
  is_blocked_by_copyrights: boolean;
  added_in_users_favorites: number;
  added_in_watching_collection: number;
  added_in_planned_collection: number;
  added_in_watched_collection: number;
  added_in_postponed_collection: number;
  added_in_abandoned_collection: number;
  average_duration_of_episode: number;

  episodes: AnimeEpisode[];
  sponsor: null;
  latest_episode?: {
    ordinal: number;
  };
  genres: {
    id: number;
    value: string;
    label: string;
    name: string;
  }[];

  members: {
    id: number;
    nickname: string;
    role: {
      value: string;
      description: string;
    };
  }[];
}

export interface Release {
  id: number;
  type: {
    value: string;
    description: string;
  };
  year: number;
  name: {
    main: string;
    english: string;
    alternative: string | null;
  };
  alias: string;
  season: {
    value: string | null;
    description: string | null;
  };
  poster: {
    src: string;
    thumbnail: string;
    optimized: {
      src: string;
      thumbnail: string;
    };
  };
  fresh_at: string | null;
  created_at: string | null;
  updated_at: string;
  age_rating: {
    value: string;
    label: string;
    is_adult: boolean;
    description: string;
  };
  publish_day: {
    value: number;
    description: string;
  };
  description: string;
  episodes_total: number | null;
  external_player: string | null;
  is_in_production: boolean;
  is_blocked_by_geo: boolean;
  episodes_are_unknown: boolean;
  is_blocked_by_copyrights: boolean;
  added_in_users_favorites: number;
  added_in_watching_collection: number;
  added_in_planned_collection: number;
  added_in_watched_collection: number;
  added_in_postponed_collection: number;
  added_in_abandoned_collection: number;
  average_duration_of_episode: number;

  episodes: AnimeEpisode[];
  sponsor: null;
  latest_episode?: {
    ordinal: number;
  };
  genres: {
    id: number;
    value: string;
    label: string;
    name: string;
  }[];

  members: {
    id: number;
    nickname: string;
    role: {
      value: string;
      description: string;
    };
  }[];
}

export interface AnimeEpisode {
  id: string;
  name: string | null;
  ordinal: number;
  opening: {
    stop: number | null;
    start: number | null;
  };
  ending: {
    stop: number | null;
    start: number | null;
  };
  preview: {
    src: string | null;
    thumbnail: string | null;
    optimized: {
      src: string | null;
      thumbnail: string | null;
    };
  };
  hls_480: string;
  hls_720: string;
  hls_1080: string | null;
  duration: number;
  rutube_id: string | null;
  youtube_id: string | null;
  updated_at: string;
  sort_order: number;
  name_english: string | null;
  episode: number;
}
