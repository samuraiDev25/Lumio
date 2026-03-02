import { notFound } from 'next/navigation';
import { UserProfileClientShell } from '@/pages_fsd/profile';
import {
  fetchUserPostsSSR,
  fetchUserProfileSSR,
} from '@/pages_fsd/profile/api/ssr';

type Props = {
  params: Promise<{ userId: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;

  const profile = await fetchUserProfileSSR(Number(userId));
  if (userId) {
  }
  // if (!profile) notFound();
  const posts = await fetchUserPostsSSR(Number(userId), {
    pageNumber: 1,
    pageSize: 8,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  return (
    <UserProfileClientShell
      userId={Number(userId)}
      initialProfile={profile}
      initialPosts={posts}
    />
  );
}
