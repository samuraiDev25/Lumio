import { MainPageClientWrapper } from '@/pages_fsd/main/MainPageClientWrapper';
import { fetchMainPageData } from '@/entities/post/api/postApi';

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
