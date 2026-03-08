import { ENDPOINTS } from '@/shared/constants/endpoints';
import { safeFetch } from '@/shared/api/client';
import { Promotion } from '@/features/home/types/promotion';

export async function fetchPromotions(): Promise<Promotion[]> {
  try {
    const data = await safeFetch<Promotion[]>(ENDPOINTS.promotions, {
      next: { revalidate: 86400 },
    });

    return data.filter((promo) => promo.release !== null);
  } catch {
    return [];
  }
}
