import type { AuthUserWithProfile } from '@/lib/db/queries';

export interface UserDisplay {
  isAuthenticated: boolean;
  displayName: string;
  avatarUrl: string | null;
  profileHref: string;
  fallbackLetters: string;
}

const GUEST_DISPLAY: UserDisplay = {
  isAuthenticated: false,
  displayName: 'Войти',
  avatarUrl: null,
  profileHref: '/login',
  fallbackLetters: '',
};

export function getUserDisplay(user: AuthUserWithProfile | null): UserDisplay {
  if (!user) return GUEST_DISPLAY;

  const username = user.profile?.username?.trim() || null;
  const avatarUrl = user.profile?.avatar_url?.trim() || null;
  const emailPrefix = user.authUser.email?.split('@')[0]?.trim() || null;

  const displayName = username ?? emailPrefix ?? 'Пользователь';
  const profileHref = username ? `/user/${encodeURIComponent(username)}` : '/user';
  const fallbackLetters = Array.from(displayName).slice(0, 2).join('').toUpperCase();

  return {
    isAuthenticated: true,
    displayName,
    avatarUrl,
    profileHref,
    fallbackLetters,
  };
}