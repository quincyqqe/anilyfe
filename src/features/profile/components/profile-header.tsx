import { Profile } from '@/features/profile/types/profile';
import Image from 'next/image';
import { CalendarDays, Eye, Radio, Sparkles } from 'lucide-react';
import { ProfileOwnerActions } from './profile-owner.action';

interface Props {
  profile: Profile;
  isOwner: boolean;
}

export function ProfileHeader({ profile, isOwner }: Props) {
  const list = profile.user_anime_list ?? [];
  const createdAt = new Date(profile.created_at).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
  });
  const initials = profile.username.slice(0, 2).toUpperCase();
  const watching = list.filter((item) => item.status === 'watching').length;
  const avatar = profile.avatar_url;

  return (
    <section className="group relative mb-10 min-h-[30rem] overflow-hidden rounded-[2rem] border border-white/10 bg-card shadow-2xl shadow-black/30 md:min-h-[34rem]">
      <div className="absolute inset-0 bg-background">
        {avatar ? (
          <Image
            src={avatar}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1120px"
            className="scale-110 object-cover opacity-35 blur-2xl transition-transform duration-1000 group-hover:scale-[1.14]"
            aria-hidden
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,oklch(0.08_0.02_260/.28)_32%,oklch(0.08_0.02_260/.97)_88%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_22%,oklch(0.72_0.14_55/.22),transparent_32%),radial-gradient(ellipse_at_84%_30%,oklch(0.65_0.12_195/.16),transparent_30%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(oklch(1_0_0/.08)_1px,transparent_1px),linear-gradient(90deg,oklch(1_0_0/.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative flex min-h-[30rem] flex-col justify-between p-5 md:min-h-[34rem] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-background/35 px-3 py-2 backdrop-blur-xl">
            <Radio className="size-3.5 text-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/80">personal space</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-background/35 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur-xl sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_oklch(0.8_0.18_150)]" />
            online now
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
          <div className="flex min-w-0 flex-col gap-5 md:max-w-2xl md:flex-row md:items-end">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-[1.75rem] border-4 border-background/80 bg-muted shadow-2xl shadow-black/40 md:size-36">
              {avatar ? (
                <Image src={avatar} alt={profile.username} fill className="object-cover" sizes="144px" priority />
              ) : (
                <div className="flex size-full items-center justify-center bg-primary/15 text-3xl font-black text-primary">{initials}</div>
              )}
              <span aria-label="Активен" className="absolute bottom-2 right-2 size-3.5 rounded-full border-2 border-background bg-emerald-400" />
            </div>
            <div className="min-w-0 pb-1">
              <p className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
                <Sparkles className="size-3.5" />
                watcher profile
              </p>
              <h1 className="truncate text-4xl font-bold tracking-tight text-foreground md:text-6xl">{profile.username}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
                {profile.bio || 'Этот профиль ещё не написал свою историю.'}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-2"><CalendarDays className="size-3.5" />На сайте с {createdAt}</span>
                <span className="flex items-center gap-2"><Eye className="size-3.5 text-primary" />{watching} сейчас смотрит</span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 md:items-end">
            {isOwner && <ProfileOwnerActions username={profile.username} bio={profile.bio} avatarUrl={profile.avatar_url} />}
          </div>
        </div>
      </div>
    </section>
  );
}
