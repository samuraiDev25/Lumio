import { notFound } from 'next/navigation';
import { PostPageClient } from './PostPageClient';
import {
  fetchProfilePostSSR,
  fetchUserProfileSSR,
} from '@/pages_fsd/profile/api/ssr';
import { fetchMainPageData } from '@/entities/post/api/postApi';

type Props = {
  params: Promise<{ postId: string }>;
  searchParams?: {
    profileId?: string;
    from?: 'main' | 'profile';
  };
};

export default async function PostPage({ params, searchParams }: Props) {
  const resoledPostId = await params;
  const postId = resoledPostId.postId;

  if (!postId) notFound();

  const from = searchParams?.from;

  const profileIdRaw = searchParams?.profileId;
  const profileId = profileIdRaw ? Number(profileIdRaw) : NaN;

  if (Number.isFinite(profileId)) {
    const post = await fetchProfilePostSSR(profileId, postId);
    if (!post) notFound();
    const profile = await fetchUserProfileSSR(post.userId);

    return (
      <PostPageClient
        post={post}
        profile={profile}
        profileId={searchParams?.profileId}
        from={from}
      />
    );
  }

  const data = await fetchMainPageData(100);

  if (!Array.isArray(data?.posts?.items)) notFound();

  const post = data.posts.items.find((p) => p.id.toString() === postId);
  if (!post) notFound();
  const profile = await fetchUserProfileSSR(post.userId);

  return (
    <PostPageClient
      post={post}
      profile={profile}
      from={from ?? 'main'}
      profileId={searchParams?.profileId}
    />
  );
}
