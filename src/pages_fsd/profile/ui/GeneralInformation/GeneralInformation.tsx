'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import s from './GeneralInformation.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GeneralInformationSchema,
  generalInformationSchema,
} from '@/pages_fsd/profile/modal/validation';
import { toast } from 'react-toastify';
import { Button, DatePicker, TextField } from '@/shared/ui';
import {
  useFillProfileMutation,
  useGetProfileQuery,
} from '@/pages_fsd/profile/api/profileApi';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useParams, usePathname } from 'next/navigation';
import { AUTH_ROUTES } from '@/shared/lib/routes';
import Link from 'next/link';
import { CITIES, COUNTRIES } from '@/pages_fsd/profile/modal/constants';
import { AvatarUploader } from '@/pages_fsd/profile';
import {
  normalizeDateString,
  parseDateString,
} from '@/pages_fsd/profile/modal/utils/dateOfBirthUtil';
import { TextAreaSection } from '@/pages_fsd/profile/ui/GeneralInformation/TextAreaSection/TextAreaSection';

export function GeneralInformation() {
  const [isDraftInitialized, setIsDraftInitialized] = useState(false);
  const hasDraftRef = useRef(false);
  const { userId } = useParams<{ userId: string }>();
  const { data: profile } = useGetProfileQuery(userId);
  const pathname = usePathname();
  const draftStorageKey = `general-information-draft:${userId ?? 'unknown'}`;
  const privacyPolicyHref = `${AUTH_ROUTES.PRIVACY_POLICY}?returnTo=${encodeURIComponent(pathname)}`;
  const [fillProfile] = useFillProfileMutation();

  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<GeneralInformationSchema>({
    resolver: zodResolver(generalInformationSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      country: '',
      city: '',
      aboutMe: '',
    },
  });
  const values = useWatch({ control });

  useEffect(() => {
    const rawDraft = sessionStorage.getItem(draftStorageKey);
    if (!rawDraft) {
      setIsDraftInitialized(true);
      return;
    }

    try {
      const parsedDraft = JSON.parse(
        rawDraft,
      ) as Partial<GeneralInformationSchema>;
      hasDraftRef.current = true;
      reset({
        username: parsedDraft.username ?? '',
        firstName: parsedDraft.firstName ?? '',
        lastName: parsedDraft.lastName ?? '',
        dateOfBirth: parsedDraft.dateOfBirth ?? '',
        country: parsedDraft.country ?? '',
        city: parsedDraft.city ?? '',
        aboutMe: parsedDraft.aboutMe ?? '',
      });
    } catch {
      sessionStorage.removeItem(draftStorageKey);
    } finally {
      setIsDraftInitialized(true);
    }
  }, [draftStorageKey, reset]);

  useEffect(() => {
    if (!profile || !isDraftInitialized || hasDraftRef.current) return;
    reset({
      username: profile.username ?? '',
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dateOfBirth: normalizeDateString(profile.dateOfBirth),
      country: profile.country ?? '',
      city: profile.city ?? '',
      aboutMe: profile.aboutMe ?? '',
    });
  }, [profile, reset, isDraftInitialized]);

  useEffect(() => {
    if (!isDraftInitialized) return;
    sessionStorage.setItem(draftStorageKey, JSON.stringify(values));
  }, [values, draftStorageKey, isDraftInitialized]);

  const onSubmit = useCallback(
    async (data: GeneralInformationSchema) => {
      try {
        const normalizedDate = normalizeDateString(data.dateOfBirth);
        await fillProfile({
          userId,
          data: {
            ...data,
            dateOfBirth: normalizedDate || null,
          },
        }).unwrap();
        sessionStorage.removeItem(draftStorageKey);
        hasDraftRef.current = false;
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
    [userId, fillProfile, dispatch, setError, draftStorageKey],
  );

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
              <label className={s.label} htmlFor="firstName">
                Username<span className={s.req}>*</span>
              </label>
              <TextField
                id="username"
                required
                placeholder="Username"
                {...register('username')}
                errorMessage={errors.username?.message}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="firstName">
                First Name<span className={s.req}>*</span>
              </label>
              <TextField
                id="firstName"
                required
                placeholder="First name"
                {...register('firstName')}
                errorMessage={errors.firstName?.message}
              />
            </div>
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="lastName">
                Last Name<span className={s.req}>*</span>
              </label>
              <TextField
                id="lastName"
                required
                placeholder="Last name"
                {...register('lastName')}
                errorMessage={errors.lastName?.message}
              />
            </div>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => {
                const selectedDate = parseDateString(field.value);
                return (
                  <>
                    <DatePicker
                      className={s.formGroup}
                      labelTitle={'Date of birth'}
                      mode={'multiple'}
                      allowPastDates
                      captionLayout="dropdown"
                      startMonth={new Date(1950, 0, 1)}
                      endMonth={new Date(2026, 11, 1)}
                      reverseYears
                      value={selectedDate}
                      onChangeAction={async (date) => {
                        if (!date) {
                          field.onChange('');
                          // чтобы ошибка ушла сразу
                          await trigger('dateOfBirth');
                          return;
                        }

                        const iso = date.toISOString().slice(0, 10);
                        field.onChange(iso);

                        // чтобы ошибка/валидность обновилась сразу после выбора
                        await trigger('dateOfBirth');
                      }}
                      errorMessage={errors.dateOfBirth?.message}
                      errorNode={
                        <>
                          {errors.dateOfBirth?.message}{' '}
                          <Link
                            href={privacyPolicyHref}
                            className={s.privacyLink}
                          >
                            Privacy Policy
                          </Link>
                        </>
                      }
                    />
                  </>
                );
              }}
            />

            <div className={s.formRow}>
              <div className={s.formGroup}>
                <label className={s.label} htmlFor="country">
                  Select your country
                </label>
                <div className={s.selectWrap}>
                  <select
                    id="country"
                    {...register('country')}
                    className={s.select}
                  >
                    <option value="" disabled>
                      Country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={s.formGroup}>
                <label className={s.label} htmlFor="city">
                  Select your city
                </label>
                <div className={s.selectWrap}>
                  <select
                    id="city"
                    {...register('city')}
                    className={s.select}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      City
                    </option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
          Save Changes
        </Button>
      </footer>
    </>
  );
}
