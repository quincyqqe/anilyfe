export async function fetchYouTube(query: string) {
  const url = new URL('https://www.googleapis.com/youtube/v3/search');

  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', '5');
  url.searchParams.set('q', query);
  url.searchParams.set('key', process.env.YOUTUBE_API_KEY!);

  url.searchParams.set('regionCode', 'JP');
  url.searchParams.set('relevanceLanguage', 'ja');

  url.searchParams.set('order', 'viewCount');

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) return null;

  console.log(`youtube api response:`, res);

  const data = await res.json();

  console.log(`youtube api response:`, data);

  const items = data.items ?? [];

  return items[0] ?? null;
}
