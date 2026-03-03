export type Nullable<T> = T | null;

export type InputFillProfileDto = {
  dateOfBirth: Nullable<string>;
  country: Nullable<string>;
  city: Nullable<string>;
  aboutMe: Nullable<string>;
  firstName: string;
  lastName: string;
};

export type UserProfile = {
  id: number;
  username: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  dateOfBirth: Nullable<string>;
  country: Nullable<string>;
  city: Nullable<string>;
  aboutMe: Nullable<string>;
  avatarUrl: Nullable<string>;
};
