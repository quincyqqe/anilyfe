export const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

export function getFranchiseImage(franchise: any) {
  return (
    franchise.image?.optimized?.preview ??
    franchise.image?.preview ??
    franchise.image?.optimized?.thumbnail ??
    franchise.image?.thumbnail ??
    null
  );
}

export function formatYearRange(franchise: any) {
  return franchise.first_year === franchise.last_year
    ? `${franchise.first_year}`
    : `${franchise.first_year} - ${franchise.last_year}`;
}

export function getReleasePoster(release: any) {
  return (
    release.poster?.optimized?.src ??
    release.poster?.src ??
    release.poster?.optimized?.thumbnail ??
    release.poster?.thumbnail ??
    null
  );
}

export function getReleaseMeta(release: any) {
  return [
    release.year ? `${release.year}` : null,
    release.season?.description ?? null,
    release.type?.description ?? null,
    release.episodes_total ? `${release.episodes_total} эп.` : null,
    release.age_rating?.label ?? null,
  ].filter(Boolean);
}
