import { ProfileHeader } from '@/features/profile/components/profile-header';
import { AnimeList } from '@/features/profile/components/anime-list/anime-list';
import { getCurrentUser, getProfileWithAnimeByUsername } from '@/lib/db/queries';
import { buildMetadata } from '@/lib/utils/metadata';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return buildMetadata({
    title: `${username} — профиль`,
    description: `Список аниме и статистика пользователя ${username}`,
    path: `/user/${username}`,
    robots: {
      index: false,
      follow: true,
    },
  });
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
    <main>
      <ProfileHeader profile={profile} isOwner={isOwner} />
      <AnimeList animeList={profile.user_anime_list ?? []} isOwner={isOwner} />
    </main>
  );
};

export default UserProfilePage;
