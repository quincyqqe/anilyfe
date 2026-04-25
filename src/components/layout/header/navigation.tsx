'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, User } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

import { siteConfig } from '@/config/site.config';
import Image from '@/components/ui/image';
import type { AuthUserWithProfile } from '@/lib/db/queries';

import SearchModal from './modals/search-modal';
import { useSearchModal } from './hooks/use-search-modal';
import { MobileMenu } from './mobile-menu';
import { useIsMobile } from './hooks/use-mobile';

interface NavigationProps {
  user: AuthUserWithProfile | null;
  onSearchClick?: () => void;
}

const headerVariants = {
  top: {
    opacity: 1,
    scale: 1,
    marginTop: 20,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    borderRadius: 16,
    backgroundColor: 'rgba(9, 9, 11, 0.4)',
  },
  scrolled: {
    opacity: 1,
    scale: 1,
    marginTop: 12,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
  },
};
function isActiveLink(pathname: string, href: string) {
  const clean = href.split('?')[0];

  if (clean === '/') return pathname === '/';

  return pathname.startsWith(clean);
}

export function Navigation({ user, onSearchClick }: NavigationProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isMobile = useIsMobile();
  const searchModal = useSearchModal();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const shouldScroll = latest > 50;
    setIsScrolled((prev) => (prev !== shouldScroll ? shouldScroll : prev));
  });

  const username = user?.profile?.username ?? null;
  const avatarUrl = user?.profile?.avatar_url ?? null;
  const fallbackEmail = user?.authUser.email ?? null;

  const profileHref = user ? (username ? `/user/${username}` : '/user') : '/login';

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pointer-events-none">
        <motion.div
          className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between overflow-hidden backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.7)] border"
          initial={{ opacity: 0, borderColor: 'rgba(255,255,255,0.05)' }}
          animate={isScrolled ? 'scrolled' : 'top'}
          transition={{
            opacity: { duration: 0.5 },
            default: {
              duration: 0.45,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          variants={headerVariants}
        >
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <span className="sr-only">На главную AniLyfe</span>

            <span className="text-sm font-semibold tracking-[0.16em] uppercase text-zinc-200 transition-colors group-hover:text-white">
              AniLyfe
            </span>
          </Link>

          <nav
            className="hidden items-center gap-6 text-xs md:flex"
            aria-label="Основная навигация"
          >
            {siteConfig.navItems.map((item) => {
              const isActive = isActiveLink(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className="relative group py-1 transition-colors duration-200"
                >
                  <span
                    className={`relative z-10 transition-colors duration-300 font-medium tracking-wide ${
                      isActive ? 'text-zinc-50' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full bg-zinc-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onSearchClick) onSearchClick();
                searchModal.open();
              }}
              aria-label="Открыть поиск"
              className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/20 hover:text-zinc-50 hover:shadow-[0_0_16px_rgba(255,255,255,0.05)] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <Search className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            </button>

            <Link
              href={profileHref}
              aria-label={username ?? fallbackEmail ?? 'Профиль'}
              className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-zinc-900/80 transition-all hover:border-white/40 hover:shadow-[0_0_16px_rgba(255,255,255,0.1)] active:scale-95"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={username ?? fallbackEmail ?? 'Аватар'}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <User className="h-4 w-4 text-zinc-300 relative z-10 transition-transform duration-300 group-hover:scale-110" />
              )}
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </header>

      <SearchModal isSearchModalOpen={searchModal.isOpen} toggleSearchModal={searchModal.close} />

      {isMobile && (
        <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} pathname={pathname} />
      )}
    </>
  );
}
