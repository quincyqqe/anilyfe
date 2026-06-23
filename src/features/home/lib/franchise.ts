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
