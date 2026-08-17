'use client';

import { Search } from 'lucide-react';

import type { AuthUserWithProfile } from '@/lib/db/queries';

import { HeaderLogo } from './header-logo';
import { HeaderUserMenu } from './header-user-menu';
import { DesktopNav } from './navigation/desktop-nav';
import { MobileNav } from './navigation/mobile-nav';
import { SearchModal } from './search/search-modal';
import { useSearchModal } from './search/use-search-modal';
import { useHeaderScroll } from './hooks/use-header-scroll';

interface HeaderProps {
  user: AuthUserWithProfile | null;
}

export function Header({ user }: HeaderProps) {
  const searchModal = useSearchModal();
  const isScrolled = useHeaderScroll();

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-4 select-none md:block">
        <div
          className={[
            'pointer-events-auto mx-auto flex items-center justify-between border border-white/[0.06] bg-zinc-950/70 backdrop-blur-md transition-all duration-300',
            isScrolled
              ? 'mt-3 max-w-5xl rounded-[24px] px-4 py-2.5'
              : 'mt-5 max-w-6xl rounded-2xl px-6 py-4',
          ].join(' ')}
        >
          <HeaderLogo />

          <DesktopNav />

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={searchModal.open}
              aria-label="Открыть поиск"
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition-colors duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              <Search className="size-4" strokeWidth={2} />
            </button>

            <HeaderUserMenu user={user} />
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
