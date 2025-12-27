export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
};

export type MeResponse = {
  userId: string;
  userName: string;
  email: string;
  isBlocked: boolean;
};

export type RegistrationArgs = {
  userName: string;
  email: string;
  password: string;
  baseUrl: string;
};

export type RegistrationConfirmationArgs = {
  confirmationCode: string;
};

export type RegistrationEmailResendingArgs = {
  email: string;
  baseUrl: string;
};

export type CreateNewPasswordRequest = {
  newPassword: string;
  recoveryCode: string;
};
