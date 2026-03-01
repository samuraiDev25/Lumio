'use client';

import { Post } from '@/entities/post/model/types/postApi.types';
import { PostModalClient } from '@/entities/post/ui/PostModal/PostModalClient';

type Props = {
  post: Post;
};

export function PostWithHydration({ post }: Props) {
  return (
    <PostModalClient post={post} />
  );
}
