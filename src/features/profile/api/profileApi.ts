import { baseApi } from '@/shared/api/baseApi';
import { UserProfile } from '@/features/profile/api/profileApi.types';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<UserProfile, string>({
      query: (userId) => ({
        url: `/api/v1/profile/${userId}`,
      }),
      providesTags: (result, error, userId) => [
        { type: 'Profile', id: userId },
      ],
    }),
  }),
});

export const { useGetUserProfileQuery } = profileApi;

