export type BaseResponseError = {
  errorsMessages: {
    message: string;
    field?: string;
  }[];
};
