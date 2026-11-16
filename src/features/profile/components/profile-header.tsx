import Image from 'next/image';
import { CalendarDays, Crown, Star } from 'lucide-react';

import { Profile } from '@/features/profile/types/profile';
import { getAnimeProgress, getStatusCounts } from '../model/anime-list/helpers';
import { ProfileOwnerActions } from './profile-owner.action';
import ShaderDemo_ATC from '@/components/effects/shader-atc';

interface Props {
  profile: Profile;
  isOwner: boolean;
}

function pluralRu(count: number, forms: [string, string, string]): string {
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return forms[2];

  const mod10 = count % 10;
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];

  return forms[2];
}

export function ProfileHeader({ profile, isOwner }: Props) {
  const createdAt = new Date(profile.created_at).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
  });

  const initials = profile.username.slice(0, 2).toUpperCase();
  const avatar = profile.avatar_url;
  const background = profile.background_url;

  const animeList = profile.user_anime_list ?? [];
  const counts = getStatusCounts(animeList);
  const episodesWatched = animeList.reduce(
    (sum, anime) => sum + getAnimeProgress(anime).currentEpisode,
    0,
  );
  const scored = animeList.filter((anime) => (anime.score ?? 0) > 0);
  const meanScore =
    scored.length > 0
      ? (scored.reduce((sum, anime) => sum + (anime.score ?? 0), 0) / scored.length).toFixed(1)
      : null;

  return (
    <section className="relative">
      <div
        className="absolute inset-0 -z-10 overflow-hidden bg-background"
        style={{
          maskImage: 'linear-gradient(to top, transparent 0%, black 60%)',
          WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 60%)',
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

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="container mx-auto flex min-h-[24rem] flex-col justify-end px-4 pb-7 pt-28 sm:px-6 md:min-h-[27rem]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
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

              <div className="relative size-24 overflow-hidden rounded-[1.5rem] bg-muted shadow-xl shadow-white/10 ring-1 ring-white/15 sm:size-28 md:size-36 md:rounded-[1.75rem]">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={profile.username}
                    fill
                    priority
                    sizes="(max-width: 639px) 96px, (max-width: 767px) 112px, 144px"
                    className="object-cover"
                    id="profile-avatar"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-primary/15 text-2xl font-black text-primary md:text-3xl">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0 pb-0.5 text-center sm:text-left">
              <h1
                className="truncate text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
                id="profile-username"
              >
                {profile.username}
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:mx-0 md:text-base">
                {profile.bio || 'Этот профиль ещё не написал свою историю.'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground sm:justify-start">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  На сайте с {createdAt}
                </span>

                {counts.all > 0 && (
                  <>
                    <span className="inline-flex items-center gap-1.5 border-l border-white/[0.08] pl-4">
                      <span className="font-semibold tabular-nums text-foreground">
                        {counts.all}
                      </span>
                      {pluralRu(counts.all, ['тайтл', 'тайтла', 'тайтлов'])}
                    </span>

                    <span className="inline-flex items-center gap-1.5 border-l border-white/[0.08] pl-4">
                      <span className="font-semibold tabular-nums text-foreground">
                        {episodesWatched}
                      </span>
                      {pluralRu(episodesWatched, ['эпизод', 'эпизода', 'эпизодов'])}
                    </span>
                  </>
                )}

                {meanScore && (
                  <span className="inline-flex items-center gap-1.5 border-l border-white/[0.08] pl-4">
                    <Star className="size-3.5" />
                    <span className="font-semibold tabular-nums text-foreground">{meanScore}</span>
                    оценка
                  </span>
                )}
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="shrink-0 max-sm:self-center md:self-auto">
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
