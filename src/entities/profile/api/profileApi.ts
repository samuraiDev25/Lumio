import { baseApi } from '@/shared/api/baseApi';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

export const { useGetUserProfileQuery } = profileApi;
