"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User } from "lucide-react";
import { siteConfig } from "@/config/site.config";
import Image from "@/components/ui/image";
import type { AuthUserWithProfile } from "@/lib/db/queries";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import SearchModal from "../footer/modals/search-modal";

interface NavigationProps {
  user: AuthUserWithProfile | null;
  onSearchClick?: () => void;
}

export function Navigation({ user, onSearchClick }: NavigationProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);


  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchModalOpen(true);
    window.addEventListener("open-search-modal", handleOpenSearch);

   
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /Mac|iPhone|iPad|iPod/i.test(
        navigator.platform ?? navigator.userAgent,
      );
      if (
        ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) &&
        (e.key === "k" || e.key === "/")
      ) {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("open-search-modal", handleOpenSearch);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const username = user?.profile?.username ?? null;
  const avatarUrl = user?.profile?.avatar_url ?? null;
  const fallbackEmail = user?.authUser.email ?? null;

  const profileHref = user
    ? username
      ? `/user/${username}`
      : "/user"
    : "/login";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pointer-events-none">
        <motion.div
          className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between overflow-hidden backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
          initial={{ y: -100, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            marginTop: isScrolled ? "12px" : "20px",
            paddingTop: isScrolled ? "10px" : "16px",
            paddingBottom: isScrolled ? "10px" : "16px",
            paddingLeft: isScrolled ? "16px" : "24px",
            paddingRight: isScrolled ? "16px" : "24px",
            borderRadius: isScrolled ? "24px" : "16px",
            backgroundColor: isScrolled
              ? "rgba(9, 9, 11, 0.85)"
              : "rgba(9, 9, 11, 0.4)",
            borderColor: isScrolled
              ? "rgba(255, 255, 255, 0.12)"
              : "rgba(255, 255, 255, 0.05)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1], // Custom easing for "premium" feel
            y: { type: "spring", stiffness: 400, damping: 30 },
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group transition-transform active:scale-95"
          >
            <span className="sr-only">На главную AniLyfe</span>
            <span className="text-sm font-semibold tracking-[0.16em] uppercase text-zinc-200 transition-colors group-hover:text-white">
              AniLyfe
            </span>
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] items-center font-bold uppercase tracking-[0.18em] text-zinc-50 bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm rounded-full transition-all group-hover:bg-primary/30 group-hover:shadow-[0_0_12px_rgba(0,0,0,0.5)] group-hover:shadow-primary/40">
              Beta
            </span>
          </Link>

          {/* Nav */}
          <nav
            className="hidden items-center gap-6 text-xs md:flex"
            aria-label="Основная навигация"
          >
            {siteConfig.navItems.map((item) => {
              const cleanedHref = item.href.split("?")[0];
              const isActive =
                cleanedHref === "/"
                  ? pathname === "/"
                  : pathname.startsWith(cleanedHref);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="relative group py-1 transition-colors duration-200"
                >
                  <span
                    className={`relative z-10 transition-colors duration-300 font-medium tracking-wide ${isActive ? "text-zinc-50" : "text-zinc-400 group-hover:text-zinc-200"}`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] rounded-full bg-zinc-400"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
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
                setIsSearchModalOpen(true);
              }}
              aria-label="Открыть поиск"
              className="group relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-sm transition-all hover:bg-white/15 hover:border-white/20 hover:text-zinc-50 hover:shadow-[0_0_16px_rgba(255,255,255,0.05)] active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <Search className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
            </button>

            <Link
              href={profileHref}
              aria-label={username ?? fallbackEmail ?? "Профиль"}
              className="group relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-zinc-900/80 transition-all hover:border-white/40 hover:shadow-[0_0_16px_rgba(255,255,255,0.1)] active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={username ?? fallbackEmail ?? "Аватар"}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <User className="h-4 w-4 text-zinc-300 relative z-10 transition-transform duration-300 group-hover:scale-110" />
              )}
            </Link>
          </div>
        </motion.div>
      </header>

      <SearchModal
        isSearchModalOpen={isSearchModalOpen}
        toggleSearchModal={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}
