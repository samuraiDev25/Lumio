import { baseApi } from '@/shared/api';
import { GeneralInformationSchema } from '@/pages_fsd/profile/modal/validation';
import { UserProfile } from '@/entities/profile/modal/types/profileApi.types';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Profile', id: userId },
      ],
    }),
    getUserProfile: builder.query<UserProfile, string>({
      query: (userId) => ({
        url: `/api/v1/profile/${userId}`,
        method: 'GET',
      }),
      providesTags: (result, error, userId) => [
        { type: 'Profile', id: userId },
      ],
    }),
  }),
});
export const { useFillProfileMutation, useGetUserProfileQuery } = profileApi;
