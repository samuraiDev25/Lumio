import { fetchMainPageData } from '@/entities/post/api/postApi';
import { fetchUserProfileSSR } from '@/pages_fsd/profile/api/ssr';
import type { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';
import { MainPage } from '@/widgets/mainContent/ui/MainContent';

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchMainPageData(4);
  const posts = data?.posts?.items || [];

  const uniqueUserIds = Array.from(new Set(posts.map((post) => post.userId)));

  const profileByUserId: Record<number, UserProfile | null> =
    Object.fromEntries(
      await Promise.all(
        uniqueUserIds.map(async (userId) => [
          userId,
          await fetchUserProfileSSR(userId),
        ]),
      ),
    );

  return (
    <MainPage
      serverPosts={posts}
      serverUsersCount={data?.allRegisteredUsersCount || 0}
      profileByUserId={profileByUserId}
    />
  );
}
