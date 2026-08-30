export type AniListAnimeStatus =
  'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

export interface AniListExternalLink {
  id: number;
  url: string;
  site: string;
  type: string | null;
  language: string | null;
  color: string | null;
  icon: string | null;
}

export interface AniListTrailer {
  id: string;
  site: string;
  thumbnail: string | null;
}

export interface AniListNextAiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface AniListAnime {
  id: number;

  averageScore: number | null;
  favourites: number;

  bannerImage: string | null;

  trailer: AniListTrailer | null;

  nextAiringEpisode: AniListNextAiringEpisode | null;

  status: AniListAnimeStatus;

  externalLinks: AniListExternalLink[];
}

export interface AniListAnimeRecord {
  id: number;

  anime_id: number;
  anilist_id: number;

  average_score: number | null;
  favourites: number;

  banner_image: string | null;

  trailer: AniListTrailer | null;

  next_airing_episode: AniListNextAiringEpisode | null;

  status: AniListAnimeStatus;

  external_links: AniListExternalLink[];

  last_synced_at: string;

  created_at: string;
  updated_at: string;
}
