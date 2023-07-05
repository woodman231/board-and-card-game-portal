import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: '/',
});

const baseQueryWithRetry = retry(baseQuery, { maxRetries: 3 });

export const api = createApi({
    baseQuery: baseQueryWithRetry,
    reducerPath: 'splitApi',
    tagTypes: ['auth'],
    endpoints: () => ({})
});
