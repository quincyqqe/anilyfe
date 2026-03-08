import 'server-only';
import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '@/features/profile/types/profile';

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

export const getProfileByUserId = cache(async (userId: string): Promise<Profile | null> => {
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
          current_episode,
          episode_progress,
          episode_duration,
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

export const getUserAnimeEntry = cache(async (slug: string): Promise<any | null> => {
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
  return data ?? null;
});

export const getUserAnimeList = cache(async (): Promise<any[]> => {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from('user_anime_list').select('*').eq('user_id', user.id);
  if (error) return [];
  return data ?? [];
});
