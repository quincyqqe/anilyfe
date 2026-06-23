import { Profile } from '@/features/profile/types/profile';
import Image from 'next/image';
import { CalendarDays } from 'lucide-react';
import { ProfileOwnerActions } from './profile-owner.action';

interface Props {
  profile: Profile;
  isOwner: boolean;
}

export function ProfileHeader({ profile, isOwner }: Props) {
  const createdAt = new Date(profile.created_at).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
  });

  const initials = profile.username.slice(0, 2).toUpperCase();

  return (
    <div className="relative mb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative flex items-center justify-center gap-10">
        <div className="relative shrink-0 self-start">
          <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-primary/60 via-accent/40 to-primary/20 p-[2px]">
            <div className="h-full w-full rounded-full bg-background" />
          </div>
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-white/10 bg-zinc-900">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.username}
                fill
                className="object-cover"
                sizes="112px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-white/60">
                {initials}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {profile.username}
              </h1>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>На сайте с {createdAt}</span>
              </div>
            </div>

            {isOwner ? <ProfileOwnerActions /> : null}
          </div>

          {profile.bio ? (
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {profile.bio}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-8 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-white/10" />
    </div>
  );
}
