'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, CalendarDays, Search, User, LogIn } from 'lucide-react';

import type { AuthUserWithProfile } from '@/lib/db/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { HeaderLogoIcon } from '../header-logo';
import { useHeaderUser } from '../hooks/use-header-user';

interface MobileNavProps {
  user: AuthUserWithProfile | null;
  onOpenSearch: () => void;
  isSearchOpen?: boolean;
}

export function MobileNav({ user, onOpenSearch, isSearchOpen = false }: MobileNavProps) {
  const pathname = usePathname();
  const { avatarUrl, displayName, profileHref, fallbackLetters } = useHeaderUser(user);

  const isCatalogActive = pathname.startsWith('/catalog');
  const isScheduleActive = pathname.startsWith('/schedule');
  const isHomeActive = pathname === '/';
  const isProfileActive = user
    ? pathname.startsWith('/user') || pathname.startsWith('/watchlist')
    : pathname === '/login';

  return (
    <nav
      aria-label="Мобильная навигация"
      className="fixed inset-x-0 bottom-0 z-50 select-none border-t border-white/10 bg-zinc-950/90 backdrop-blur-sm md:hidden pb-[max(0.6rem,env(safe-area-inset-bottom,0px))]"
    >
      <div className="mx-auto grid grid-cols-5 items-center justify-items-center px-1 pt-2">
        <Link
          href="/catalog"
          className={`relative flex w-full flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 ${
            isCatalogActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isCatalogActive && (
              <span className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-sm" />
            )}
            <LayoutGrid
              className={`size-5 transition-transform duration-200 ${
                isCatalogActive ? 'scale-110 text-white stroke-[2.2]' : ''
              }`}
            />
          </div>
          <span className="text-[10px] font-medium tracking-tight">Каталог</span>
        </Link>

        <Link
          href="/schedule"
          className={`relative flex w-full flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 ${
            isScheduleActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isScheduleActive && (
              <span className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-sm" />
            )}
            <CalendarDays
              className={`size-5 transition-transform duration-200 ${
                isScheduleActive ? 'scale-110 text-white stroke-[2.2]' : ''
              }`}
            />
          </div>
          <span className="text-[10px] font-medium tracking-tight">Расписание</span>
        </Link>

        <Link
          href="/"
          aria-label="Главная"
          className="relative -mt-4 flex flex-col items-center justify-center"
        >
          <div
            className={`flex size-12 items-center justify-center rounded-2xl border transition-all duration-300 ${
              isHomeActive
                ? 'border-white/30 bg-zinc-800 text-white shadow-[0_0_16px_rgba(255,255,255,0.15)]'
                : 'border-white/10 bg-zinc-900/90 text-zinc-400 hover:text-white'
            }`}
          >
            <HeaderLogoIcon
              className={`size-6 transition-colors duration-200 ${
                isHomeActive ? 'text-white' : 'text-zinc-400'
              }`}
            />
          </div>
          <span
            className={`mt-1 text-[10px] font-medium tracking-tight ${
              isHomeActive ? 'text-white' : 'text-zinc-400'
            }`}
          >
            Главная
          </span>
        </Link>

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Поиск"
          className={`relative flex w-full flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 ${
            isSearchOpen ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isSearchOpen && (
              <span className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-sm" />
            )}
            <Search
              className={`size-5 transition-transform duration-200 ${
                isSearchOpen ? 'scale-110 text-white stroke-[2.2]' : ''
              }`}
            />
          </div>
          <span className="text-[10px] font-medium tracking-tight">Поиск</span>
        </button>

        <Link
          href={profileHref}
          aria-label={displayName}
          className={`relative flex w-full flex-col items-center justify-center gap-1 py-1 transition-colors duration-200 ${
            isProfileActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {isProfileActive && (
              <span className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-sm" />
            )}
            {user ? (
              <Avatar
                className={`size-5.5 rounded-full border transition-colors ${
                  isProfileActive ? 'border-white/80 ring-1 ring-white/30' : 'border-white/20'
                }`}
              >
                {avatarUrl && (
                  <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
                )}
                <AvatarFallback className="bg-white/10 text-[9px] font-semibold text-zinc-200">
                  {fallbackLetters}
                </AvatarFallback>
              </Avatar>
            ) : (
              <LogIn
                className={`size-5 transition-transform duration-200 ${
                  isProfileActive ? 'scale-110 text-white stroke-[2.2]' : ''
                }`}
              />
            )}
          </div>
          <span className="max-w-[54px] truncate text-[10px] font-medium tracking-tight">
            {user ? displayName : 'Войти'}
          </span>
        </Link>
      </div>
    </nav>
  );
}
