import { notFound } from 'next/navigation';
import { UserProfilePage } from '@/pages_fsd/profile/ui/UserProfilePage/UserProfilePage';
import { fetchPostById } from '@/entities/post/api/postApi';
import { PostWithHydration } from '../../posts/[postId]/PostWithHydration';

type Props = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ postId?: string }>;
};

export default async function ProfilePage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { userId } = resolvedParams;
  const { postId } = resolvedSearchParams;

  if (!userId) {
    notFound();
  }

  try {
    // SSR: Загружаем данные профиля
    const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
    const res = await fetch(`${baseUrl}api/v1/profile/${userId}`, {
      next: { revalidate: 60 },
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch profile');
    }
    
    const profile = await res.json();
    
    // Если есть postId в URL, рендерим профиль с модальным окном поста
    if (postId) {
      try {
        // Загружаем пост на сервере для SSR
        const post = await fetchPostById(postId);

        if (!post) {
          notFound();
        }

        return (
          <>
            <UserProfilePage 
              userId={userId} 
              initialProfile={profile}
              initialPostId={postId}
            />
            <PostWithHydration post={post} />
          </>
        );
      } catch (error) {
        console.error('Error fetching post for SSR:', error);
        // При ошибке API создаем заглушку с реалистичными данными
        const fallbackPost = {
          id: parseInt(postId),
          description: 'This post is temporarily unavailable. Please try again later.',
          createdAt: new Date().toISOString(),
          userId: parseInt(userId),
          userName: 'User',
          avatarUrl: '/User 03.jpg',
          postFiles: [
            {
              id: 1,
              url: '/122.jpg',
              postId: parseInt(postId),
            }
          ],
        };
        
        return (
          <>
            <UserProfilePage 
              userId={userId} 
              initialProfile={profile}
              initialPostId={postId}
            />
            <PostWithHydration post={fallbackPost} />
          </>
        );
      }
    }

    // Если нет postId, рендерим обычную страницу профиля
    return (
      <UserProfilePage 
        userId={userId} 
        initialProfile={profile}
        initialPostId={postId}
      />
    );
  } catch (error) {
    console.error('Error fetching profile:', error);
    notFound();
  }
}