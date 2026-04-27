'use client';

import { Post } from '@/entities/post/model/types/postApi.types';
import s from './PostGrid.module.scss';
import Image from 'next/image';
import Link from 'next/link';

type PostGridProps = {
  posts: Post[];
  profileId?: number;
  from?: 'main' | 'profile';
  returnTo?: string;
};

export function PostGrid({
  posts,
  profileId,
  from = 'profile',
  returnTo,
}: PostGridProps) {
  return (
    <div className={s.postGrid}>
      {posts.map((post) => {
        const searchParams = new URLSearchParams();

        if (from === 'profile' && profileId) {
          searchParams.set('from', 'profile');
          searchParams.set('profileId', String(profileId));
        } else {
          searchParams.set('from', 'main');
        }

        if (returnTo) {
          searchParams.set('returnTo', returnTo);
        }

        const href = `/posts/${post.id}?${searchParams.toString()}`;

        return (
          <div key={post.id} className={s.postItem}>
            {post.postFiles && post.postFiles.length > 0 && (
              <div className={s.postImageContainer}>
                <Link
                  href={href}
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
        );
      })}
    </div>
  );
}
