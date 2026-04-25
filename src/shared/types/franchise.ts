import { Release } from './anime';

export interface FranchiseImage {
  preview: string;
  thumbnail: string;
  optimized: Record<string, string>;
}

export interface FranchiseRelease {
  id: string;
  sort_order: number;
  release_id: number;
  franchise_id: string;
  release: Release;
}

export interface FranchiseItem {
  id: string;
  name: string;
  name_english: string;
  first_year: number;
  last_year: number;
  image: FranchiseImage;
  rating: number | null;
  total_duration: string;
  total_duration_in_seconds: number;
  total_episodes: number;
  total_releases: number;
  franchise_releases?: FranchiseRelease[];
}

export interface FranchiseDetails extends FranchiseItem {
  franchise_releases: FranchiseRelease[];
}
