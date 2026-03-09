import { notFound } from 'next/navigation';
import { UserProfileClientShell } from '@/pages_fsd/profile';
import {
  fetchProfilePostSSR,
  fetchUserPostsSSR,
  fetchUserProfileSSR,
} from '@/pages_fsd/profile/api/ssr';

type Props = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ postId?: string }>;
};

export default async function ProfilePage({ params, searchParams }: Props) {
  const { userId } = await params;
  const { postId } = await searchParams;
  const profileId = Number(userId);
  if (!Number.isFinite(profileId)) notFound();

  const profile = await fetchUserProfileSSR(profileId);
  if (!profile) notFound();

  const posts = await fetchUserPostsSSR(profileId, {
    pageNumber: 1,
    pageSize: 8,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  const initialPost = postId
    ? await fetchProfilePostSSR(profileId, postId)
    : null;

  return (
    <UserProfileClientShell
      userId={profileId}
      initialProfile={profile}
      initialPosts={posts}
      initialPost={initialPost}
    />
  );
}
