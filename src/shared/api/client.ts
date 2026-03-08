export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(errorData)}`);
  }

  return res.json() as Promise<T>;
}
