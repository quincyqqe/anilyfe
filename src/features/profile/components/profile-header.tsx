import { Profile } from '@/features/profile/types/profile';
import Image from 'next/image';
import { CalendarDays, Film, Heart, Play, Sparkles } from 'lucide-react';
import { ProfileOwnerActions } from './profile-owner.action';

interface Props { profile: Profile; isOwner: boolean; }

export function ProfileHeader({ profile, isOwner }: Props) {
  const list = profile.user_anime_list ?? [];
  const createdAt = new Date(profile.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' });
  const initials = profile.username.slice(0, 2).toUpperCase();
  const stats = [
    { label: 'В коллекции', value: list.length, icon: Film },
    { label: 'Смотрю', value: list.filter((item) => item.status === 'watching').length, icon: Play },
    { label: 'Завершено', value: list.filter((item) => item.status === 'completed').length, icon: Sparkles },
    { label: 'Избранное', value: list.filter((item) => item.is_favourite).length, icon: Heart },
  ];

  return (
    <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-card/60 shadow-2xl shadow-black/20">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,oklch(0.75_0.16_55/.16),transparent_32%),radial-gradient(circle_at_90%_20%,oklch(0.65_0.12_195/.12),transparent_28%)]" />
      <div className="relative h-28 border-b border-white/8 bg-[linear-gradient(115deg,transparent_20%,oklch(1_0_0/.04)_20.5%,transparent_21%),linear-gradient(65deg,transparent_55%,oklch(1_0_0/.035)_55.5%,transparent_56%)] md:h-40" />
      <div className="relative flex flex-col gap-6 px-5 pb-5 md:px-8 md:pb-7">
        <div className="-mt-14 flex flex-col gap-5 md:-mt-16 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="relative size-28 shrink-0 overflow-hidden rounded-3xl border-4 border-card bg-muted shadow-xl md:size-32">
              {profile.avatar_url ? <Image src={profile.avatar_url} alt={profile.username} fill className="object-cover" sizes="128px" priority /> : <div className="flex size-full items-center justify-center text-3xl font-black text-primary">{initials}</div>}
              <span aria-label="Активен" className="absolute bottom-2 right-2 size-3 rounded-full border-2 border-card bg-emerald-400" />
            </div>
            <div className="flex min-w-0 flex-col gap-2 pb-1">
              <div className="flex items-center gap-2"><span className="rounded-full bg-primary/15 px-2 py-1 font-mono text-[9px] font-bold uppercase tracking-widest text-primary">profile / 01</span></div>
              <h1 className="truncate text-2xl font-bold tracking-tight text-foreground md:text-4xl">{profile.username}</h1>
            </div>
          </div>
          {isOwner && <ProfileOwnerActions username={profile.username} bio={profile.bio} avatarUrl={profile.avatar_url} />}
        </div>
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl"><p className="text-sm leading-6 text-muted-foreground">{profile.bio || 'Этот профиль ещё не написал свою историю.'}</p><div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-3.5" /><span>На сайте с {createdAt}</span></div></div>
          <div className="grid grid-cols-4 gap-1 rounded-2xl border border-white/8 bg-background/35 p-1 md:min-w-[390px]">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="flex flex-col gap-1 rounded-xl px-2 py-3 text-center"><Icon className="mx-auto size-3.5 text-primary/80" /><strong className="font-mono text-lg leading-none text-foreground">{value}</strong><span className="text-[9px] leading-3 text-muted-foreground">{label}</span></div>)}</div>
        </div>
      </div>
    </section>
  );
}
