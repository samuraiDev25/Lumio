import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { LocaleType } from '@/shared/types';

export const baseSlice = createSlice({
  name: 'baseSlice',
  initialState: {
    notificationStatus: false,
    error: null as string | null,
    locale: 'en' as LocaleType,
    isLoading: false,
  },
  reducers: (create) => ({
    changeNewMessage: create.reducer<{ notificationStatus: boolean }>(
      (state, action) => {
        state.notificationStatus = action.payload.notificationStatus;
      },
    ),
    changeError: create.reducer<{ error: string }>((state, action) => {
      state.error = action.payload.error;
    }),
    changeLocale: create.reducer<{ locale: LocaleType }>((state, action) => {
      state.locale = action.payload.locale;
    }),
  }),
  extraReducers: (builder) => {
    builder.addMatcher(isPending, (state) => {
      state.isLoading = true;
    });
    builder.addMatcher(isFulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addMatcher(isRejected, (state) => {
      state.isLoading = false;
    });
  },
  selectors: {
    selectNotificationStatus: (state) => state.notificationStatus,
    selectError: (state) => state.error,
    selectLocale: (state) => state.locale,
    selectIsLoading: (state) => state.isLoading,
  },
});

export const {
  selectNotificationStatus,
  selectError,
  selectLocale,
  selectIsLoading,
} = baseSlice.selectors;
export const baseReducer = baseSlice.reducer;
export const { changeNewMessage, changeError, changeLocale } =
  baseSlice.actions;
