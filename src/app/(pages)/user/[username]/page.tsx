import AnimeSection from '@/features/profile/components/anime-section';
import { ProfileHeader } from '@/features/profile/components/profile-header';
import { getCurrentUser, getProfileWithAnimeByUsername } from '@/lib/db/queries';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} — профиль`,
    description: `Список аниме и статистика пользователя ${username}`,
  };
}

const UserProfilePage = async ({ params }: Props) => {
  const { username } = await params;

  const [profile, user] = await Promise.all([
    getProfileWithAnimeByUsername(username),
    getCurrentUser(),
  ]);

  if (!profile) {
    return notFound();
  }

  const isOwner = user?.id === profile.id;

  return (
    <div className="container mx-auto px-4 pt-28 md:pt-32">
      <ProfileHeader profile={profile} isOwner={isOwner} />
      <AnimeSection profile={profile} />
    </div>
  );
};

export default UserProfilePage;
