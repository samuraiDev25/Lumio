import { fetchMainPageData } from '@/entities/post/api/postApi';
import { MainPage } from '@/widgets/mainContent/ui/MainContent';

export const revalidate = 60;

export default async function HomePage() {
  const data = await fetchMainPageData(4);

  return (
    <MainPage
      serverPosts={data?.posts?.items || []}
      serverUsersCount={data?.allRegisteredUsersCount || 0}
    />
  );
}
