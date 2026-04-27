import { notFound } from 'next/navigation';
import { InterceptedPostModalClient } from './InterceptedPostModalClient';
import { fetchMainPageData } from '@/entities/post/api/postApi';
import { fetchUserProfileSSR } from '@/pages_fsd/profile/api/ssr';

type Props = {
  params: Promise<{ postId: string }>;
  searchParams?: Promise<{
    from?: 'main' | 'profile';
    profileId?: string;
    returnTo?: string;
  }>;
};

export default async function InterceptedPostModal({
  params,
  searchParams,
}: Props) {
  const resolvedParams = await params;
  const currentProfileId = await searchParams;
  const postId = resolvedParams.postId;
  const profileId = currentProfileId?.profileId;
  const from = currentProfileId?.from;
  const returnTo = currentProfileId?.returnTo;

  const profileIdCurrent = Number(profileId);

  // const post = await fetchProfilePostSSR(profileIdCurrent, postId);
  const data = await fetchMainPageData(1, 100);
  const post = data.posts.items.find((p) => p.id.toString() === postId);

  if (!post) notFound();
  const profile = await fetchUserProfileSSR(post.userId);

  return (
    <InterceptedPostModalClient
      post={post}
      profile={profile}
      from={from}
      profileId={profileIdCurrent}
      returnTo={returnTo}
    />
  );
}
