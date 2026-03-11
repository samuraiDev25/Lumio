'use client';

import { useEffect } from 'react';
import s from './GeneralInformation.module.scss';
import { Button, TextField } from '@/shared/ui';
import { useGetProfileQuery } from '@/pages_fsd/profile/api/profileApi';
import { CITIES, COUNTRIES } from '@/pages_fsd/profile/modal/constants';
import { AvatarUploader } from '@/pages_fsd/profile';
import { TextAreaSection } from '@/widgets/ProfileGeneralInfo/ui/TextAreaSection/TextAreaSection';
import { useMeQuery } from '@/features/auth/api/authApi';
import { useSubmitProfile } from '@/widgets/ProfileGeneralInfo/modal/hooks/useSubmitProfile';
import { useGeneralInformationForm } from '@/widgets/ProfileGeneralInfo/modal/hooks/useGeneralInformationForm';
import { DateOfBirthField } from '@/widgets/ProfileGeneralInfo/ui/DateOfBirthField/DateOfBirthField';
import { mapProfileToForm } from '@/widgets/ProfileGeneralInfo/modal/utils/mapProfileToForm';
import { SelectField } from '@/widgets/ProfileGeneralInfo/ui/SelectField/SelectField';

export function GeneralInformation() {
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const userId = me?.userId ? Number(me.userId) : null;
  const { data: profile } = useGetProfileQuery(userId!, {
    skip: !userId || isMeLoading,
    refetchOnMountOrArgChange: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    trigger,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useGeneralInformationForm();

  useEffect(() => {
    if (profile) {
      reset(mapProfileToForm(profile));
    }
  }, [profile, reset]);

  const onSubmit = useSubmitProfile({
    userId,
    profile,
    setError,
  });

  return (
    <>
      <div className={s.content}>
        <div className={s.profileLayout}>
          <div className={s.avatarSection}>
            <AvatarUploader currentAvatar={profile?.avatarUrl} />
          </div>
          <form
            className={s.formSection}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className={s.formGroup}>
              <TextField
                label={'Username'}
                id="username"
                required
                placeholder="Username"
                {...register('username')}
                errorMessage={errors.username?.message}
              />
            </div>
            <div className={s.formGroup}>
              <TextField
                label={'First Name'}
                id="firstName"
                required
                placeholder="First name"
                {...register('firstName')}
                errorMessage={errors.firstName?.message}
              />
            </div>
            <div className={s.formGroup}>
              <TextField
                label={'Last Name'}
                id="lastName"
                required
                placeholder="Last name"
                {...register('lastName')}
                errorMessage={errors.lastName?.message}
              />
            </div>
            <DateOfBirthField
              control={control}
              errors={errors}
              trigger={trigger}
            />
            <div className={s.formRow}>
              <SelectField
                name="country"
                label="Select your country"
                placeholder="Country"
                options={COUNTRIES}
                register={register}
              />

              <SelectField
                name="city"
                label="Select your city"
                placeholder="City"
                options={CITIES}
                register={register}
              />
            </div>
            <TextAreaSection control={control} errors={errors} />
          </form>
        </div>
      </div>
      <footer className={s.pageFooter}>
        <Button
          variant={'primary'}
          size={'md'}
          className={s.btnSave}
          disabled={!isValid || isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </footer>
    </>
  );
}
