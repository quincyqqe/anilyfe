import { updateAnimeProgress } from '@/lib/db/actions/anime-list';
import { NextResponse } from 'next/server';

interface ProgressRequest {
  animeSlug?: unknown;
  currentEpisode?: unknown;
  episodeProgress?: unknown;
  episodeDuration?: unknown;
}

function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export async function POST(request: Request) {
  let body: ProgressRequest;

  try {
    body = (await request.json()) as ProgressRequest;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const animeSlug = typeof body.animeSlug === 'string' ? body.animeSlug.trim() : '';
  const currentEpisode = body.currentEpisode;
  const episodeProgress = body.episodeProgress;
  const episodeDuration = body.episodeDuration;

  if (
    !animeSlug ||
    animeSlug.length > 160 ||
    !isValidNumber(currentEpisode) ||
    !Number.isInteger(currentEpisode) ||
    currentEpisode < 1 ||
    currentEpisode > 100_000 ||
    !isValidNumber(episodeProgress) ||
    episodeProgress < 0 ||
    episodeProgress > 10_000_000 ||
    !isValidNumber(episodeDuration) ||
    episodeDuration < 0 ||
    episodeDuration > 10_000_000
  ) {
    return NextResponse.json({ error: 'Invalid progress payload' }, { status: 400 });
  }

  const result = await updateAnimeProgress(
    animeSlug,
    currentEpisode,
    Math.round(episodeProgress),
    Math.round(episodeDuration),
  );

  if (result.error === 'Unauthorized') {
    return NextResponse.json(result, { status: 401 });
  }

  if (result.error) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
