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
