import { notFound } from 'next/navigation';
import { InterceptedPostModalClient } from './InterceptedPostModalClient';
import { fetchMainPageData } from '@/entities/post/api/postApi';

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function InterceptedPostModal({ params }: Props) {
  const resolvedParams = await params;
  const postId = resolvedParams.postId;

  const data = await fetchMainPageData(100);

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
