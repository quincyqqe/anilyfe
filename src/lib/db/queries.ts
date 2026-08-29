import 'server-only';
import { cache } from 'react';
import type { UserAnimeEntry } from '@/features/profile/types/profile';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/features/profile/types/profile';
import type { AniListAnimeRecord } from '@/shared/types/anilist';

export type AuthUserWithProfile = {
  authUser: User;
  profile: Profile | null;
};

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
});

const getProfileByUserId = cache(async (userId: string): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  return data;
});

export const getCurrentUserWithProfile = cache(async (): Promise<AuthUserWithProfile | null> => {
  const authUser = await getCurrentUser();
  if (!authUser) return null;
  const profile = await getProfileByUserId(authUser.id);
  return { authUser, profile };
});

export const getProfileWithAnimeByUsername = cache(
  async (username: string): Promise<Profile | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .select(
        `
        *,
        user_anime_list (
          id,
          user_id,
          anime_slug,
          anime_name,
          anime_poster,
          status,
          total_episodes,
          current_episode,
          episode_progress,
          episode_duration,
          is_favourite,
          created_at,
          updated_at
        )
      `,
      )
      .eq('username', username)
      .maybeSingle();
    if (error) return null;
    return data as Profile;
  },
);

export const getUserAnimeEntry = cache(async (slug: string): Promise<UserAnimeEntry | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_anime_list')
    .select('*')
    .eq('user_id', user.id)
    .eq('anime_slug', slug)
    .maybeSingle();
  if (error) return null;
  return (data as UserAnimeEntry | null) ?? null;
});

export async function getAnimeAniList(animeId: number): Promise<AniListAnimeRecord | null> {
  const { data, error } = await supabaseAdmin
    .from('anime_anilist')
    .select('*')
    .eq('anime_id', animeId)
    .maybeSingle();

  if (error) {
    console.error('[AniList DB] Failed to get record:', error);
    return null;
  }

  return data as AniListAnimeRecord | null;
}

export async function upsertAnimeAniList(
  data: Omit<AniListAnimeRecord, 'id' | 'created_at' | 'updated_at'>,
): Promise<AniListAnimeRecord | null> {
  const { data: row, error } = await supabaseAdmin
    .from('anime_anilist')
    .upsert(data, {
      onConflict: 'anime_id',
    })
    .select('*')
    .single();

  if (error) {
    console.error('[AniList DB] Failed to save record:', error);
    return null;
  }

  return row as AniListAnimeRecord;
}
