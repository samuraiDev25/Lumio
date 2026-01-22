import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: {
    userId: string;
    username: string;
    email: string;
  } | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    setUser: (
      state,
      action: PayloadAction<{
        userId: string;
        username: string;
        email: string;
      }>,
    ) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('accessToken');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCredentials, setUser, logout, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;
