export type ErrorMessage = {
  message: string;
  field: string;
};

export type BaseResponseError = {
  statusCode: number;
  messages: ErrorMessage[] | string;
  error: string;
};
