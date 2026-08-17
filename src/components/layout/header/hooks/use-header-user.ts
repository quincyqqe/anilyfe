import type { AuthUserWithProfile } from '@/lib/db/queries';

export function useHeaderUser(user: AuthUserWithProfile | null) {
  if (!user) {
    return {
      user: null,
      displayName: 'Войти',
      avatarUrl: null,
      profileHref: '/login',
      fallbackLetters: '',
      email: null,
      handleSignOut: () => {},
    };
  }

  const username = user.profile?.username ?? null;
  const avatarUrl = user.profile?.avatar_url ?? null;
  const email = user.authUser.email ?? null;

  const displayName = username || (email ? email.split('@')[0] : 'Пользователь');
  const profileHref = username ? `/user/${username}` : '/user';
  const fallbackLetters = displayName.slice(0, 2).toUpperCase();

  const handleSignOut = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/auth/signout';
    document.body.appendChild(form);
    form.submit();
  };

  return {
    user,
    displayName,
    avatarUrl,
    profileHref,
    fallbackLetters,
    email,
    handleSignOut,
  };
}