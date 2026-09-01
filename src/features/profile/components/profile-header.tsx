import Image from 'next/image';
import { CalendarDays, Crown } from 'lucide-react';

import { Profile } from '@/features/profile/types/profile';
import { ProfileOwnerActions } from './profile-owner.action';
import ShaderDemo_ATC from '@/components/effects/shader-atc';

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
  const avatar = profile.avatar_url;
  const background = profile.background_url;

  return (
    <section className="relative mb-12 min-h-[30rem] overflow-hidden md:min-h-[34rem]">
      <div
        className="absolute inset-0 -z-10 overflow-hidden bg-background"
        style={{
          maskImage: 'linear-gradient(to top, transparent 0%, black 55%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 55%)',
        }}
      >
        {background ? (
          <Image
            src={background}
            alt=""
            fill
            loading="eager"
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          <ShaderDemo_ATC />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="flex min-h-[30rem] flex-col justify-end px-4 pb-8 md:min-h-[34rem] md:px-12 md:pb-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex shrink-0 flex-col items-center gap-2 sm:items-start">
              {profile.is_admin && (
                <div className="flex h-7 w-24 items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-background/40 px-3 shadow-lg shadow-black/10 sm:w-28 md:w-36">
                  <Crown className="size-3 shrink-0 fill-primary text-primary" />

                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-primary">
                    Creator
                  </span>
                </div>
              )}

              <div className="relative size-24 overflow-hidden rounded-[1.5rem] bg-muted shadow-xl shadow-white/10 sm:size-28 md:size-36 md:rounded-[1.75rem]">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={profile.username}
                    fill
                    priority
                    sizes="(max-width: 639px) 96px, (max-width: 767px) 112px, 144px"
                    className="object-cover"
                    id='profile-avatar'
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-primary/15 text-2xl font-black text-primary md:text-3xl">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 pb-1 text-center sm:text-left">
              <h1 className="truncate text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl" id='profile-username'>
                {profile.username}
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mx-0 md:text-base">
                {profile.bio || 'Этот профиль ещё не написал свою историю.'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:justify-start">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-3.5" />
                  На сайте с {createdAt}
                </span>
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="shrink-0 self-stretch md:self-auto">
              <ProfileOwnerActions
                username={profile.username}
                bio={profile.bio}
                avatarUrl={profile.avatar_url}
                backgroundUrl={profile.background_url}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
