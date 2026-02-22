'use client';

import { ChangeEvent, useCallback, useRef, useState } from 'react';
import s from './GeneralInformation.module.scss';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GeneralInformationSchema,
  generalInformationSchema,
} from '@/pages_fsd/profile/modal/validation';
import { ImageOutline } from '@/shared/ui/icons';
import { toast } from 'react-toastify';
import { Button, DatePicker, TextField } from '@/shared/ui';
import { useFillProfileMutation } from '@/pages_fsd/profile/api/profileApi';
import { handleNetworkError } from '@/shared/lib';
import { useAppDispatch } from '@/shared/hooks';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';

const COUNTRIES = [
  'Belarus',
  'Germany',
  'France',
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const { userId } = useParams<{ userId: string }>();
  console.log('userId type:', typeof userId, 'value:', userId);
  const [fillProfile] = useFillProfileMutation();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
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
        await fillProfile({ userId, data }).unwrap();
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
    [userId, fillProfile, dispatch, setError],
  );

  return (
    <>
      <div className={s.content}>
        <div className={s.profileLayout}>
          <div className={s.avatarSection}>
            <div className={s.avatarWrap} onClick={handleAvatarClick}>
              {avatarSrc ? (
                <img
                  className={s.avatarImg}
                  src={avatarSrc}
                  alt="avatar"
                  style={{ display: 'block' }}
                />
              ) : (
                <ImageOutline />
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <Button
              variant={'outline'}
              size={'lg'}
              type="button"
              className={s.btnPhoto}
              onClick={handleAvatarClick}
            >
              Select Profile Photo
            </Button>
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
