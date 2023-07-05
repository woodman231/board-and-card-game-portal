import {api} from '../../../store/api';
import type { Profile } from 'passport-github';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserData: builder.query<Profile, void>({
            query: () => '/auth/me',
            providesTags: ['auth']
        })
    })
});

export const { useGetUserDataQuery } = authApi;
