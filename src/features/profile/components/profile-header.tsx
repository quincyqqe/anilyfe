import { Profile } from '@/features/profile/types/profile';
import Image from 'next/image';
import { ProfileOwnerActions } from './profile-owner.action';

interface Props {
  profile: Profile;
  isOwner: boolean;
}

export function ProfileHeader({ profile, isOwner }: Props) {
  const createdAt = new Date(profile.created_at).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-start gap-6 pb-8 border-b border-zinc-800">
      <div className="w-24 h-24 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-3xl font-semibold text-zinc-400 shrink-0 overflow-hidden">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={profile.username}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          profile.username[0]?.toUpperCase()
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-zinc-50">{profile.username}</h1>

          {isOwner ? <ProfileOwnerActions /> : null}
        </div>

        {profile.bio ? <p className="text-sm text-zinc-400 max-w-lg">{profile.bio}</p> : null}

        <p className="text-xs text-zinc-600">На сайте с {createdAt}</p>
      </div>
    </div>
  );
}
