import { notFound } from 'next/navigation';
import { PostPageClient } from './PostPageClient';
import { fetchMainPageData } from '@/entities/post/api/postApi';

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function PostPage({ params }: Props) {
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

  return <PostPageClient post={post} />;
}