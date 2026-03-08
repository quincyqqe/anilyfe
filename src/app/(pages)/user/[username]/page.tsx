import AnimeSection from '@/features/profile/components/anime-section';
import { ProfileHeader } from '@/features/profile/components/profile-header';
import { getCurrentUser, getProfileWithAnimeByUsername } from '@/lib/db/queries';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ username: string }>;
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
    <div className="container mx-auto px-4 pt-32 ">
      <ProfileHeader profile={profile} isOwner={isOwner} />
      <AnimeSection profile={profile} />
    </div>
  );
};

export default UserProfilePage;
