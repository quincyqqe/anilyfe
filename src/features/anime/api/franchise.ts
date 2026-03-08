import { ENDPOINTS } from '../../../shared/constants/endpoints';
import { safeFetch } from '../../../shared/api/client';
import { FranchiseItem } from '../../../shared/types/franchise';

export async function fetchFranchise(code: string): Promise<FranchiseItem | null> {
  try {
    const data = await safeFetch<FranchiseItem[]>(ENDPOINTS.franchise(code));

    return data[0] ?? null;
  } catch {
    return null;
  }
}
