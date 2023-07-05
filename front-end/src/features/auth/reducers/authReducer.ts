import { createSlice } from "@reduxjs/toolkit";
import { authApi } from '../services/authService';
import type { PayloadAction } from "@reduxjs/toolkit/dist/createAction";
import type { Profile } from 'passport-github';

interface AuthState {
    user: Profile | null;
    isLoggedIn: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoggedIn: false
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(authApi.endpoints.getUserData.matchFulfilled, (state, action: PayloadAction<Profile>) => {
                state.user = action.payload;
                state.isLoggedIn = true;
            })
            .addMatcher(authApi.endpoints.getUserData.matchRejected, (state) => {
                state.user = null;
                state.isLoggedIn = false;
            })
    }    
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn;
