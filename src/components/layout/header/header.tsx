'use client';

import { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import Link from 'next/link';

import type { AuthUserWithProfile } from '@/lib/db/queries';

import { getUserDisplay } from './hooks/get-user-display';
import { HeaderLogo } from './header-logo';
import { useHeaderScroll } from './hooks/use-header-scroll';
import { DesktopNav } from './navigation/desktop-nav';
import { MobileNav } from './navigation/mobile-nav';
import { SearchModal } from './search/search-modal';
import { useSearchModal } from './search/use-search-modal';

interface HeaderProps {
  user: AuthUserWithProfile | null;
}

export function Header({ user }: HeaderProps) {
  const searchModal = useSearchModal();
  const { isScrolled, isHidden } = useHeaderScroll();
  const headerHidden = isHidden && !searchModal.isOpen;

  const { isAuthenticated, displayName, avatarUrl, profileHref, fallbackLetters } =
    getUserDisplay(user);

  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    setAvatarFailed(false);
  }, [avatarUrl]);

  const showAvatar = Boolean(avatarUrl && !avatarFailed);

  return (
    <>
      <header
        inert={headerHidden || undefined}
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-4 select-none transition-transform duration-300 will-change-transform motion-reduce:transition-none md:block ${
          headerHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div
          className={`pointer-events-auto mx-auto flex items-center justify-between rounded-xl border border-white/[0.06] bg-zinc-950/60 backdrop-blur-sm transition-[max-width,margin,padding] duration-300 motion-reduce:transition-none ${
            isScrolled ? 'mt-3 max-w-5xl px-4 py-2.5' : 'mt-5 max-w-6xl px-6 py-3.5'
          }`}
        >
          <HeaderLogo />

          <DesktopNav />

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={searchModal.open}
              aria-label="Открыть поиск"
              aria-expanded={searchModal.isOpen}
              aria-haspopup="dialog"
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <Search className="size-4" strokeWidth={2} aria-hidden="true" />
            </button>

            <Link
              href={profileHref}
              aria-label={isAuthenticated ? `Мой профиль (${displayName})` : 'Войти'}
              className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-0.5 pr-1 pl-3 outline-none transition-colors duration-200 hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <span className="max-w-28 truncate text-sm font-medium text-zinc-100">
                {displayName}
              </span>

              <span
                aria-hidden="true"
                className="relative block size-8 shrink-0 rounded-full bg-white/10 p-0.5 transition-colors duration-200 group-hover:bg-white/20"
              >
                <span className="absolute inset-0.5 flex items-center justify-center overflow-hidden rounded-full bg-zinc-950 text-[10px] font-semibold text-zinc-300">
                  {isAuthenticated ? fallbackLetters : <User className="size-3.5 text-zinc-400" />}
                </span>

                {showAvatar && (
                  <img
                    src={avatarUrl!}
                    alt=""
                    decoding="async"
                    onError={() => setAvatarFailed(true)}
                    className="absolute inset-0.5 size-[calc(100%-4px)] rounded-full object-cover"
                  />
                )}
              </span>
            </Link>
          </div>
        </div>
      </header>

      <MobileNav user={user} onOpenSearch={searchModal.open} isSearchOpen={searchModal.isOpen} />

      {searchModal.isOpen && (
        <SearchModal isSearchModalOpen toggleSearchModal={searchModal.close} />
      )}
    </>
  );
}
