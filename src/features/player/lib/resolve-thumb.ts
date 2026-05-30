import type { AnimeEpisode } from '@/shared/types/anime';

/**
 * Resolves the thumbnail/poster URL for a given anime episode robustly.
 * Handles both full absolute URLs and relative paths.
 */
export function resolveThumb(episode: AnimeEpisode): string | undefined {
  const src = episode.preview?.optimized?.src || episode.preview?.src;
  if (!src) return undefined;
  if (src.startsWith('http://') || src.startsWith('https://')) return src;

  const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || '';
  // Ensure exactly one slash between baseUrl and relative path
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const normalizedSrc = src.startsWith('/') ? src.slice(1) : src;

  return `${normalizedBase}${normalizedSrc}`;
}
