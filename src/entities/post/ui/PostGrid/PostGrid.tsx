'use client';

import { Post } from '@/entities/post/model/types/postApi.types';
import s from './PostGrid.module.scss';
import Image from 'next/image';
import Link from 'next/link';

type PostGridProps = {
  posts: Post[];
};

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className={s.postGrid}>
      {posts.map((post) => (
        <div key={post.id} className={s.postItem}>
          {post.postFiles && post.postFiles.length > 0 && (
            <div className={s.postImageContainer}>
              <Link
                key={post.id}
                href={`/profile/${post.userId}?postId=${post.id}`}
                scroll={false}
                style={{ textDecoration: 'none' }}
              >
                <Image
                  src={post.postFiles[0].url}
                  alt={post.description || 'Post image'}
                  fill
                  className={s.postImage}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>

              {post.postFiles.length > 1 && (
                <div className={s.multipleImagesBadge}>
                  <span>{post.postFiles.length}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
