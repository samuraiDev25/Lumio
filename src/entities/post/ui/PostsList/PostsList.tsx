'use client';
import Image from 'next/image';
import { Post } from '@/entities/post/model/types/postApi.types';

type Props = {
  posts: Post[];
};
export default function PostsList({ posts }: Props) {
  return (
    <div>
      {posts?.map((post) => (
        <div key={post.id} className="post-card">
          <Image
            src={post.postFiles?.[0]?.url || '/User03.png'}
            alt="Post preview"
            width={200}
            height={200}
          />
        </div>
      ))}
    </div>
  );
}
