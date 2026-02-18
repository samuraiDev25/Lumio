import { UserProfilePage } from '@/pages_fsd/profile';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function ProfilePage({ params }: Props) {
  const { userId } = await params;

  return <UserProfilePage userId={userId} />;
}
