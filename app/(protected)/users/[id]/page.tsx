import { notFound } from 'next/navigation';
import { UserProfileAddFollow } from '@/pages_fsd/profile';
import {
  fetchProfilePostSSR,
  fetchUserPostsSSR,
  fetchUserProfileSSR,
} from '@/pages_fsd/profile/api/ssr';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ postId?: string }>;
};

export default async function UserPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { postId } = await searchParams;
  const profileId = Number(id);

  if (!Number.isFinite(profileId)) notFound();

  const profile = await fetchUserProfileSSR(profileId);
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
    <UserProfileAddFollow
      userId={profileId}
      initialProfile={profile}
      initialPosts={posts}
      initialPost={initialPost}
    />
  );
}
