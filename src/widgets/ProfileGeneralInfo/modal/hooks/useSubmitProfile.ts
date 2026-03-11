import { toast } from 'react-toastify';
import { useCallback } from 'react';
import {
  useFillProfileMutation,
  useUpdateProfileMutation,
} from '@/pages_fsd/profile/api/profileApi';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';
import { normalizeDateString } from '@/widgets/ProfileGeneralInfo/modal/utils/dateOfBirthUtil';
import { GeneralInformationSchema } from '@/pages_fsd/profile/modal/validation';
import { UseFormSetError } from 'react-hook-form';

type Props = {
  userId: number | null;
  profile: { id?: number } | undefined;
  setError: UseFormSetError<GeneralInformationSchema>;
};

export function useSubmitProfile({ userId, profile, setError }: Props) {
  const [fillProfile] = useFillProfileMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const dispatch = useAppDispatch();

  const onSubmit = useCallback(
    async (data: GeneralInformationSchema) => {
      if (!userId) {
        toast.error('User not authenticated');
        return;
      }

      try {
        const normalizedDate = normalizeDateString(data.dateOfBirth);
        const hasProfile = Boolean(profile?.id);

        const profileData = {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: normalizedDate || null,
          country: data.country || null,
          city: data.city || null,
          aboutMe: data.aboutMe || null,
        };

        if (hasProfile) {
          await updateProfile({
            userId,
            data: profileData,
          }).unwrap();

          toast.success(' Your settings are saved! ');
        } else {
          await fillProfile({
            userId,
            data: profileData,
          }).unwrap();

          toast.success('Profile created successfully');
        }
      } catch (error) {
        handleNetworkError({
          error,
          dispatch,
          handle400Error: (error) => {
            error.errorsMessages?.forEach((m) => {
              if (m.field) {
                setError(m.field as keyof GeneralInformationSchema, {
                  type: 'server',
                  message: m.message,
                });
              }
            });

            toast.error(
              error.errorsMessages?.[0]?.message ??
                'Validation error or business rule violation',
            );
          },
          handle401Error: () => {
            toast.error('Unauthorized');
          },
          handle403Error: (err) => {
            toast.error(err.errorsMessages?.[0]?.message ?? 'Forbidden');
          },
          handle500Error: () => {
            toast.error('Internal server error');
          },
          handleUnknownError: () => {
            toast.error('Error! Server is not available!');
          },
        });
      }
    },
    [userId, profile, fillProfile, updateProfile, dispatch, setError],
  );

  return onSubmit;
}
