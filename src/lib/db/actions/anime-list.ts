'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { WatchStatus } from '@/shared/types/user-anime-list';

async function getAuthedSupabase() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return { supabase, user: data.user };
}

export async function upsertAnimeStatus(
  animeSlug: string,
  animeName: string,
  animePoster: string,
  status: WatchStatus,
) {
  const ctx = await getAuthedSupabase();
  if (!ctx) return { error: 'Unauthorized' };

  const { supabase, user } = ctx;
  const { error } = await supabase.from('user_anime_list').upsert(
    {
      user_id: user.id,
      anime_slug: animeSlug,
      anime_name: animeName,
      anime_poster: animePoster,
      status,
    },
    { onConflict: 'user_id,anime_slug' },
  );

  if (error) return { error: error.message };
  revalidatePath(`/anime/${animeSlug}`);
  return { success: true };
}

export async function removeAnimeEntry(animeSlug: string) {
  const ctx = await getAuthedSupabase();
  if (!ctx) return { error: 'Unauthorized' };

  const { supabase, user } = ctx;
  const { error } = await supabase
    .from('user_anime_list')
    .delete()
    .eq('user_id', user.id)
    .eq('anime_slug', animeSlug);

  if (error) return { error: error.message };
  revalidatePath(`/anime/${animeSlug}`);
  return { success: true };
}

export async function updateAnimeProgress(
  animeSlug: string,
  currentEpisode: number,
  episodeProgress: number,
  episodeDuration: number,
) {
  const ctx = await getAuthedSupabase();
  if (!ctx) return { error: 'Unauthorized' };

  const { supabase, user } = ctx;
  const { error } = await supabase
    .from('user_anime_list')
    .update({
      current_episode: currentEpisode,
      episode_progress: episodeProgress,
      episode_duration: episodeDuration,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('anime_slug', animeSlug);

  if (error) return { error: error.message };
  return { success: true };
}
