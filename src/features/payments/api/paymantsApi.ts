import { baseApi } from "@/shared/api";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updatingPayment: builder.mutation<void, {profileId: string, autoRenewal: boolean}>({
        query: ({profileId, autoRenewal}) => ({
            url: '/api/v1/payments/autorenewal',
            method: 'POST',
            body: {profileId, autoRenewal},
        }),
        }),
  }),
});


export const {useUpdatingPaymentMutation} = paymentsApi