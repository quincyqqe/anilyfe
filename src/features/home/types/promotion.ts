import { Anime } from '@/shared/types/anime';

export interface Promotion {
  id: string;
  url: string | null;
  url_label?: string | null;
  image: {
    preview: string;
    thumbnail: string;
    optimized: {
      preview: string;
      thumbnail: string;
    };
  };
  title?: string | null;
  description: string;
  is_ad?: boolean;
  ad_erid?: string | null;
  ad_origin?: string | null;
  has_overlay?: boolean;
  release: Anime;
}
