import { notFound } from 'next/navigation';
import { InterceptedPostModalClient } from './InterceptedPostModalClient';
import { fetchMainPageData } from '@/entities/post/api/postApi';

type Props = {
  params: Promise<{ postId: string }>;
  searchParams?: Promise<{
    from?: 'main' | 'profile';
    profileId?: string;
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

  const profileIdCurrent = Number(profileId);

  // const post = await fetchProfilePostSSR(profileIdCurrent, postId);
  const data = await fetchMainPageData(100);
  const post = data.posts.items.find((p) => p.id.toString() === postId);

  if (!post) notFound();

  return (
    <InterceptedPostModalClient
      post={post}
      from={from}
      profileId={profileIdCurrent}
    />
  );
}
