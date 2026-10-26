export interface AnimeArtItem {
  url: string;
  artist_name: string;
  artist_href: string;
  source_url: string;
  tag?: string;
}

export const FALLBACK_ANIME_ARTS: AnimeArtItem[] = [
  {
    artist_name: 'モ誰',
    artist_href: 'https://www.pixiv.net/en/users/1878082',
    source_url: 'https://www.pixiv.net/en/artworks/99202504',
    url: 'https://nekos.best/api/v2/waifu/8bbfee9a-1c6b-4c7f-98e1-750c990b6b7d.png',
    tag: 'Cyberpunk Shaman',
  },
  {
    artist_name: 'ROiNA',
    artist_href: 'https://www.pixiv.net/en/users/40428837',
    source_url: 'https://www.pixiv.net/en/artworks/96756930',
    url: 'https://nekos.best/api/v2/waifu/4c8069b5-0c20-4824-9c91-afa889328c8f.png',
    tag: 'Starlight Guardian',
  },
  {
    artist_name: 'ほうき星',
    artist_href: 'https://www.pixiv.net/en/users/70050825',
    source_url: 'https://www.pixiv.net/en/artworks/97512754',
    url: 'https://nekos.best/api/v2/waifu/61abb3e8-9dbf-4616-b2ff-190a1f57d46e.png',
    tag: 'Midnight Shinobi',
  },
  {
    artist_name: 'momoco_haru',
    artist_href: 'https://twitter.com/momoco_haru',
    source_url: 'https://twitter.com/momoco_haru/status/2045445642483564658',
    url: 'https://nekos.best/api/v2/waifu/831b6863-afb1-4075-865f-b41879ce70b3.png',
    tag: 'Neon Maiden',
  },
  {
    artist_name: 'Swon',
    artist_href: 'https://www.pixiv.net/en/users/35286171',
    source_url: 'https://www.pixiv.net/en/artworks/95647751',
    url: 'https://nekos.best/api/v2/waifu/f3bdbd63-0ae5-4545-a516-fefee29c7554.png',
    tag: 'Ethereal Soul',
  },
];

export async function fetchRandomAnimeArt(
  category: 'waifu' | 'kitsune' | 'neko' = 'waifu',
): Promise<AnimeArtItem> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`https://nekos.best/api/v2/${category}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API returned ${res.status}`);
    }

    const data = await res.json();
    const result = data?.results?.[0];

    if (!result?.url) {
      throw new Error('No URL in response');
    }

    return {
      url: result.url,
      artist_name: result.artist_name || 'Anime Artist',
      artist_href: result.artist_href || 'https://nekos.best',
      source_url: result.source_url || result.url,
      tag: result.anime_name || 'AniLyfe Art',
    };
  } catch {
    const randomIndex = Math.floor(Math.random() * FALLBACK_ANIME_ARTS.length);
    return FALLBACK_ANIME_ARTS[randomIndex];
  }
}
