import { fetchMainPageData } from '@/features/posts/api/postApi';
import { MainPageClientWrapper } from '@/pages_fsd/main/MainPageClientWrapper';

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchMainPageData(4);

  return (
    <MainPageClientWrapper
      serverPosts={data?.posts?.items || []}
      serverUsersCount={data?.allRegisteredUsersCount || 0}
    />
  );
}
