import { notFound } from 'next/navigation';
import { PostPageClient } from './PostPageClient';
import { fetchProfilePostSSR } from '@/pages_fsd/profile/api/ssr';
import { fetchMainPageData } from '@/entities/post/api/postApi';

type Props = {
  params: Promise<{ postId: string }>;
  searchParams?: Promise<{
    from?: 'main' | 'profile';
    profileId?: string;
  }>;
};

export default async function PostPage({ params, searchParams }: Props) {
  const resoledPostId = await params;
  const currentProfileId = await searchParams;
  const postId = resoledPostId.postId;
  const profileId = Number(currentProfileId?.profileId);
  const from = currentProfileId?.from;

  if (!postId) notFound();

  if (profileId) {
    const post = await fetchProfilePostSSR(profileId, postId);
    if (!post) notFound();
    console.log('9999999999999999999');
    return <PostPageClient post={post} profileId={profileId} from={from} />;
  }

  // if (!Array.isArray(data?.posts?.items)) notFound();

  const data = await fetchMainPageData(100);
  const post = data.posts.items.find((p) => p.id.toString() === postId);
  if (!post) notFound();

  return (
    <PostPageClient post={post} from={from ?? 'main'} profileId={profileId} />
  );
}
