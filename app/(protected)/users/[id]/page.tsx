'use client';

import { UserProfilePage } from '@/pages_fsd/profile/UserProfilePage';

export default function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  return <UserProfilePage userId={params.id} />;
}

