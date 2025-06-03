 import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    login: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.login = true;
      state.error = null;
      localStorage.setItem("token", action.payload);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.login = false;
      state.error = action.payload;  
    },
    logout: (state) => {
      state.login = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, setError } = AuthSlice.actions;
export default AuthSlice.reducer;
