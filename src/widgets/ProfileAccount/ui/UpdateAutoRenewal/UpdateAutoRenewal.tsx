'use client'

import { useEffect, useState } from 'react';
import { Checkbox } from '@/shared/ui';
import { toast } from 'react-toastify';
import { useMeQuery } from '@/features/auth/api/authApi';
import { useGetProfileQuery } from '@/pages_fsd/profile/api/profileApi';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';
import { useUpdateAutoRenewalMutation } from '@/features/payments/api/paymentsApi';

type Props = {
  autoRenewal: boolean;
  onAutoRenewalChangeAction?: (
    autoRenewal: boolean,
  ) => void;
};

export const UpdateAutoRenewal = ({
  autoRenewal,
  onAutoRenewalChangeAction,
}: Props) => {
  const [isAutoRenewal, setIsAutoRenewal] = useState(autoRenewal);
  const [updateAutoRenewal, { isLoading }] = useUpdateAutoRenewalMutation();

  const dispatch = useAppDispatch();

  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const userId = Number(me?.userId);

  const { data: profile } = useGetProfileQuery(userId!, {
    skip: !userId || isMeLoading,
    refetchOnMountOrArgChange: false,
  });

  useEffect(() => {
    setIsAutoRenewal(autoRenewal);
  }, [autoRenewal]);

  const handleToggleAutoRenewal = async (checked: boolean) => {
    if (!profile?.id) {
      toast.error('Profile not found');
      return;
    }

    const newValue = checked;
    const previousValue = isAutoRenewal;

    setIsAutoRenewal(newValue);

    try {
      await updateAutoRenewal({
        profileId: String(profile?.id),
        autoRenewal: newValue,
    }).unwrap();

    toast.success('Auto-renewal updated');

    onAutoRenewalChangeAction?.(newValue);
    } catch (error) {
      setIsAutoRenewal(previousValue);

    handleNetworkError({
        error,
        dispatch,
        handle400Error: () => {
          toast.error('Invalid auto-renewal request. Please try again.');
        },
        handle401Error: () => {
          toast.error('You are not authorized.');
        },
        handle429Error: () => {
          toast.error('Too many requests.');
        },
        handle500Error: () => {
          toast.error('Server error. Please try again later.');
        },
        handleUnknownError: () => {
          toast.error('An unexpected error occurred.');
        },
    });
    }
  };

  return (
    <Checkbox
      checked={isAutoRenewal}
      onChangeAction={handleToggleAutoRenewal}
      label="Auto-Renewal"
      disabled={isLoading}
    />
  );
}