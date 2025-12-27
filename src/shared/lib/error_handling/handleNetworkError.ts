import { AppDispatch } from '@/shared/types/lib/appState.types';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { changeError } from '@/shared/api/base-slice';
import { BaseResponseError } from '@/shared/types';

const defaultGlobalErrorMessage =
  'Oops! Something went wrong. See error in browser console';

export function handleNetworkError({
  error,
  dispatch,
  handle400Error,
  handle429Error,
  handle401Error,
  handleUnknownError,
}: {
  error: unknown;
  dispatch: AppDispatch;
  handle400Error?: (error: BaseResponseError) => void;
  handle429Error?: () => void;
  handle401Error?: () => void;
  handleUnknownError?: (error: unknown) => void;
}) {
  console.error('handleNetworkError', error);
  const fetchError = error as FetchBaseQueryError;

  if ('status' in fetchError) {
    if (fetchError.status === 400) {
      const baseResponseError = fetchError.data as BaseResponseError;

      let message: string = defaultGlobalErrorMessage;

      if (typeof baseResponseError.messages === 'string') {
        message = baseResponseError.messages;
      } else if (baseResponseError.messages.length > 0) {
        message = baseResponseError.messages[0].message;
      } else if (baseResponseError.error) {
        message = baseResponseError.error;
      }

      message = message ?? defaultGlobalErrorMessage;

      dispatch(changeError({ error: message }));
      handle400Error?.(baseResponseError);
    } else if (fetchError.status === 429) {
      dispatch(
        changeError({
          error: 'More than 5 attempts from one IP-address during 10 seconds',
        }),
      );
      handle429Error?.();
    } else if (fetchError.status === 401) {
      dispatch(changeError({ error: 'Unauthorized' }));
      handle401Error?.();
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
