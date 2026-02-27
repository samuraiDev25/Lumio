'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
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
import { Controller, useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { AvatarUploader } from '@/pages_fsd/profile';
import { useGetUserProfileQuery } from '@/entities/profile/api/profileApi';

const COUNTRIES = [
  'Belarus',
  'Germany',
  'France',
  'Russia',
  'Italy',
  'Spain',
  'Ukraine',
  'Poland',
  'Netherlands',
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Japan',
];

const CITIES = [
  'Minsk',
  'Berlin',
  'Paris',
  'Moscow',
  'Rome',
  'Madrid',
  'Kyiv',
  'Warsaw',
  'Amsterdam',
  'London',
  'New York',
  'Toronto',
  'Sydney',
  'Tokyo',
];

const ABOUT_ME_MAX = 200;

export function GeneralInformation() {
  const { userId } = useParams<{ userId: string }>();
  const { data: profile } = useGetProfileQuery(userId);
  console.log('userId type:', typeof userId, 'value:', userId);
  const [fillProfile] = useFillProfileMutation();
  const { data: profile } = useGetUserProfileQuery(userId, {
    skip: !userId,
  });
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
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

  const normalizeDateString = useCallback(
    (value: string | null | undefined) => {
      if (!value) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
      if (!match) return value;
      const [, day, month, year] = match;
      return `${year}-${month}-${day}`;
    },
    [],
  );

  const parseDateString = useCallback(
    (value: string | null | undefined) => {
      const normalized = normalizeDateString(value);
      if (!normalized) return undefined;
      const date = new Date(normalized);
      if (Number.isNaN(date.getTime())) return undefined;
      return date;
    },
    [normalizeDateString],
  );

  useEffect(() => {
    if (!profile) return;
    reset({
      username: profile.username ?? '',
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dateOfBirth: normalizeDateString(profile.dateOfBirth),
      country: profile.country ?? '',
      city: profile.city ?? '',
      aboutMe: profile.aboutMe ?? '',
    });
  }, [profile, reset, normalizeDateString]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setAvatarSrc(event.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

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
    [userId, fillProfile, dispatch, setError, normalizeDateString],
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
            <div className={s.formGroup}>
              {/*<label className={s.label} htmlFor="dateOfBirth">*/}
              {/*  Date of birth*/}
              {/*</label>*/}
              <DatePicker mode={'multiple'} />
            </div>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => {
                const selectedDate = parseDateString(field.value);
                return (
                  <DatePicker
                    labelTitle={'Date of birth'}
                    mode={'multiple'}
                    allowPastDates
                    className={s.formGroup}
                    captionLayout="dropdown"
                    startMonth={new Date(1950, 0, 1)}
                    endMonth={new Date(2026, 11, 1)}
                    reverseYears
                    value={selectedDate}
                    onChangeAction={(date) => {
                      if (!date) {
                        field.onChange('');
                        return;
                      }
                      const iso = date.toISOString().slice(0, 10);
                      field.onChange(iso);
                    }}
                  />
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
                    <option value="Сountry" disabled>
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
            <div className={s.formGroup}>
              <label className={s.label} htmlFor="aboutMe">
                About Me
              </label>
              <textarea
                id="aboutMe"
                placeholder="Text-area"
                maxLength={ABOUT_ME_MAX}
                {...register('aboutMe')}
                className={`${s.textarea} ${errors.aboutMe ? s.invalid : ''}`}
              />
              {errors.aboutMe && (
                <span className={`${s.errorMsg} ${s.show}`}>
                  {errors.aboutMe.message}
                </span>
              )}
            </div>
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
