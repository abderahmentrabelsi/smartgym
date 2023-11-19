import { createSlice } from "@reduxjs/toolkit";

const initialState = {
 isAuthenticated: false,
 authUser: null,
};

const appSlice = createSlice({
 name: "app",
 initialState,
 reducers: {
  setIsAuthenticated: (state, action) => {
   state.isAuthenticated = action.payload;
  },
  setAuthUser: (state, action) => {
   state.authUser = action.payload;
  },
 },
});

export const { setIsAuthenticated, setAuthUser } = appSlice.actions;
export default appSlice.reducer;
