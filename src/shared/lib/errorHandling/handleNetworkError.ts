import { AppDispatch } from '@/shared/types/lib/appState.types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { changeError } from '@/shared/api/baseSlice';
import { BaseResponseError } from '@/shared/types';

const defaultGlobalErrorMessage =
  'Oops! Something went wrong. See error in browser console';

export function handleNetworkError({
  error,
  dispatch,
  handle400Error,
  handle429Error,
  handle401Error,
  handle403Error,
  handle500Error,
  handleUnknownError,
}: {
  error: unknown;
  dispatch: AppDispatch;
  handle400Error?: (error: BaseResponseError) => void;
  handle429Error?: () => void;
  handle401Error?: () => void;
  handle403Error?: (error: BaseResponseError) => void;
  handle500Error?: () => void;
  handleUnknownError?: (error: unknown) => void;
}) {
  console.error('handleNetworkError', error);
  const fetchError = error as FetchBaseQueryError;

  if ('status' in fetchError) {
    if (fetchError.status === 400) {
      const baseResponseError = fetchError.data as BaseResponseError;
      const firstMessage =
        baseResponseError.errorsMessages?.[0]?.message ??
        defaultGlobalErrorMessage;
      dispatch(changeError({ error: firstMessage }));
      handle400Error?.(baseResponseError);
      return;
    } else if (fetchError.status === 429) {
      const baseResponseError = fetchError.data as BaseResponseError;
      const message =
        baseResponseError.errorsMessages?.[0]?.message ?? 'Too many requests';
      dispatch(changeError({ error: message }));
      handle429Error?.();
    } else if (fetchError.status === 401) {
      dispatch(changeError({ error: 'Unauthorized' }));
      handle401Error?.();
    } else if (fetchError.status === 403) {
      const baseResponseError = fetchError.data as BaseResponseError;
      const message =
        baseResponseError.errorsMessages?.[0]?.message ?? 'Forbidden access';
      dispatch(changeError({ error: message }));
      handle403Error?.(baseResponseError);
    } else if (fetchError.status === 500) {
      dispatch(changeError({ error: 'Internal server error' }));
      handle500Error?.();
    } else {
      dispatch(
        changeError({
          error: `Oops! Something went wrong. Error status: ${fetchError.status}`,
        }),
      );
      handleUnknownError?.(error);
    }
  } else {
    dispatch(
      changeError({
        error: 'Oops! Something went wrong. See error in browser console',
      }),
    );
    handleUnknownError?.(error);
  }
}
