import { baseApi } from '@/shared/api';
import { GeneralInformationSchema } from '@/pages_fsd/profile/modal/validation';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profile.types';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, number>({
      query: (userId) => ({
        url: `/api/v1/profile/${userId}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, userId) => [
        { type: 'Profile', id: userId },
      ],
    }),
    fillProfile: builder.mutation<
      void,
      { userId: string; data: GeneralInformationSchema }
    >({
      query: ({ userId, data }) => ({
        url: `/api/v1/profile/fill/${userId}`,
        method: 'PUT',
        body: {
          dateOfBirth: data.dateOfBirth || null,
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          country: data.country || null,
          city: data.city || null,
          aboutMe: data.aboutMe || null,
        },
      }),
    }),
  }),
});
export const { useFillProfileMutation, useGetUserProfileQuery } = profileApi;
