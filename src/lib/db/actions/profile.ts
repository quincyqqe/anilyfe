'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const imageUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (!value) return true;

      try {
        const url = new URL(value);

        return url.protocol === 'https:' || url.protocol === 'http:';
      } catch {
        return false;
      }
    },
    'Некорректный URL изображения',
  );

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Никнейм должен содержать минимум 3 символа')
    .max(32, 'Никнейм не может быть длиннее 32 символов')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Никнейм может содержать только латинские буквы, цифры, _ и -',
    ),

  bio: z
    .string()
    .trim()
    .max(160, 'Bio не может быть длиннее 160 символов'),

  avatarUrl: imageUrlSchema,
  backgroundUrl: imageUrlSchema,
});

export type UpdateProfileInput = z.infer<typeof profileSchema>;

export async function updateProfile(input: UpdateProfileInput) {
  const parsed = profileSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Некорректные данные',
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      error: 'Необходимо войти в аккаунт',
    };
  }

  const { username, bio, avatarUrl, backgroundUrl } = parsed.data;

  const { data: currentProfile, error: profileError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !currentProfile) {
    return {
      success: false,
      error: 'Профиль не найден',
    };
  }

  if (username !== currentProfile.username) {
    const { data: existingProfile, error: usernameError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user.id)
      .maybeSingle();

    if (usernameError) {
      return {
        success: false,
        error: 'Не удалось проверить никнейм',
      };
    }

    if (existingProfile) {
      return {
        success: false,
        error: 'Этот никнейм уже занят',
      };
    }
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      username,
      bio: bio || null,
      avatar_url: avatarUrl || null,
      background_url: backgroundUrl || null,
    })
    .eq('id', user.id);

  if (updateError) {
    console.error('[Profile] Failed to update:', updateError);

    if (updateError.code === '23505') {
      return {
        success: false,
        error: 'Этот никнейм уже занят',
      };
    }

    return {
      success: false,
      error: 'Не удалось сохранить профиль',
    };
  }

  revalidatePath(`/user/${currentProfile.username}`);
  revalidatePath(`/user/${username}`);

  return {
    success: true,
    username,
  };
}
