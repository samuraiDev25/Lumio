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
        providesTags: ['Profile'],
      }),
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
  }),
});
export const {
  useFillProfileMutation,
  useGetProfileQuery,
  useUploadAvatarMutation,
  useDeleteAvatarMutation,
} = profileApi;
