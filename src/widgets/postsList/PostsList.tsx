'use client';
import Image from 'next/image';
import { PostModal } from '@/widgets/postModal/ui/PostModal';
import { Post } from '@/features/posts/api/postApi.types';

type Props = {
  posts: Post[];
};
export default function PostsList({ posts }: Props) {
  return (
    <div>
      {posts.map((post) => (
        <PostModal
          key={post.id}
          post={post}
          userName="Test User"
          avatarUrl="/User03.png"
        >
          <div className="post-card">
            <Image
              src={post.postFiles?.[0]?.url}
              alt="Post preview"
              width={200}
              height={200}
            />
          </div>
        </PostModal>
      ))}
    </div>
  );
}
