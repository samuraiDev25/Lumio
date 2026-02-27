import { baseApi } from '@/shared/api';
import { GeneralInformationSchema } from '@/pages_fsd/profile/modal/validation';

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
    }),
  }),
});
export const { useFillProfileMutation } = profileApi;
