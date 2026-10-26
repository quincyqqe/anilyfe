'use client';

import { useRouter } from 'next/navigation';
import { Bookmark, LogIn, LogOut, User } from 'lucide-react';
import Link from 'next/link';

import type { AuthUserWithProfile } from '@/lib/db/queries';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useHeaderUser } from './hooks/use-header-user';

interface HeaderUserMenuProps {
  user: AuthUserWithProfile | null;
}

export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const router = useRouter();
  const { displayName, avatarUrl, profileHref, fallbackLetters, email, handleSignOut } =
    useHeaderUser(user);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-xs font-medium text-zinc-300 transition-colors duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <LogIn className="size-4 text-zinc-400" />
        <span>Войти</span>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={displayName}
        className="group relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 outline-none transition-colors duration-200 hover:border-white/25 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/30 data-[state=open]:border-white/30 data-[state=open]:bg-white/10"
      >
        <Avatar className="size-full rounded-xl bg-zinc-900">
          {avatarUrl ? (
            <AvatarImage
              src={avatarUrl}
              alt={displayName}
              className="object-cover transition-opacity duration-300"
            />
          ) : null}
          <AvatarFallback className="rounded-xl bg-white/5 text-[11px] font-semibold text-zinc-300">
            {fallbackLetters || <User className="size-4 text-zinc-400" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <div className="px-2 py-2.5">
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8 shrink-0 bg-zinc-900">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={displayName} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-white/10 text-[10px] font-medium text-zinc-300">
                {fallbackLetters}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-foreground">{displayName}</p>
              {email && (
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{email}</p>
              )}
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(profileHref)}>
          <User />
          <span>Мой профиль</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled onClick={() => router.push('/watchlist')}>
          <Bookmark />
          <span className="text-muted-foreground font-medium">Soon</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
