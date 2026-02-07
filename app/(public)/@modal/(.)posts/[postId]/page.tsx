import { notFound } from 'next/navigation';
import { InterceptedPostModalClient } from './InterceptedPostModalClient';
import { fetchMainPageData } from '@/features/posts/api/postApi';

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function InterceptedPostModal({ params }: Props) {
  const resolvedParams = await params;
  const postId = resolvedParams.postId;

  if (!postId) {
    notFound();
  }
  const data = await fetchMainPageData(4);

  if (!Array.isArray(data?.posts?.items)) {
    notFound();
  }

  const post = data.posts.items.find((post) => {
    return post.id.toString() === postId;
  });

  if (!post) {
    notFound();
  }

  return <InterceptedPostModalClient post={post} />;
}
