import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: 'http://192.168.0.102:5000' });

const apiSlice = createApi({
	reducerPath: 'apiSlice',
	baseQuery,
	tagTypes: ['User', 'Chat'],
	endpoints: (builder) => ({}),
});

export default apiSlice;
