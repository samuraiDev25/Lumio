import { baseApi } from '@/shared/api';
import { GeneralInformationSchema } from '@/pages_fsd/profile/modal/validation';
import { UserProfile } from '@/pages_fsd/profile/modal/types/profileApi.types';

export type UpdateProfileRequest = {
  firstName: string;
  lastName: string;
  dateOfBirth: string | null;
  country: string | null;
  city: string | null;
  aboutMe: string | null;
};

export type UpdateProfileResponse = UserProfile;

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
        providesTags: ['Profile'],
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Profile', id: userId },
      ],
    }),
    getProfile: builder.query<UserProfile, string>({
      query: (userId) => `/api/v1/profile/${userId}`,
      providesTags: ['Profile'],
    }),
    uploadAvatar: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: `/api/v1/profile/avatar`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Profile'],
    }),
    deleteAvatar: builder.mutation<void, void>({
      query: () => ({
        url: `/api/v1/profile/avatar`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<
      UpdateProfileResponse,
      { userId: string; data: UpdateProfileRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/api/v1/profile/${userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: 'Profile', id: userId },
      ],
    }),
  }),
});
export const {
  useFillProfileMutation,
  useGetProfileQuery,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
  useUpdateProfileMutation,
  useGetUserProfileQuery,
} = profileApi;
