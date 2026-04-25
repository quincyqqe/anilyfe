import { safeFetch } from '@/shared/api/client';
import { ENDPOINTS } from '@/shared/constants/endpoints';
import { FranchiseDetails, FranchiseItem } from '@/shared/types/franchise';

export async function fetchRandomFranchises(): Promise<FranchiseItem[]> {
  try {
    const data = await safeFetch<FranchiseItem[]>(ENDPOINTS.franchisesRandom);

    return data ?? [];
  } catch {
    return [];
  }
}

export async function fetchFranchiseDetails(id: string): Promise<FranchiseDetails | null> {
  try {
    const data = await safeFetch<FranchiseDetails>(ENDPOINTS.franchiseById(id));

    return data ?? null;
  } catch {
    return null;
  }
}
