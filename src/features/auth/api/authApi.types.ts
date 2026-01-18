export type AuthResponse = {
  accessToken: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type MeResponse = {
  userId: string;
  username: string;
  email: string;
};
export type RefreshTokenResponse = {
  accessToken: string;
};
export type InputRegistrationDto = {
  username: string;
  email: string;
  password: string;
};

export type ServerErrorRegistration = {
  errorsMessages: {
    message: string;
    field?: string;
  }[];
};

export type RecoveryPasswordRequest = {
  email: string;
  recaptchaToken: string;
  baseUrl: string;
};

export type CreateNewPasswordRequest = {
  newPassword: string;
  recoveryCode: string;
};

export type RegistrationConfirmationInputDto = { confirmCode: string };
export type RegistrationConfirmationErrorResponse = {
  errorsMessages: { message: string; field?: string }[];
};
