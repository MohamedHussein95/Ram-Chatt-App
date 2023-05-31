import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Constants from 'expo-constants';

const baseQuery = fetchBaseQuery({
	baseUrl: Constants.manifest?.extra?.backendHost,
});

const apiSlice = createApi({
	reducerPath: 'apiSlice',
	baseQuery,
	tagTypes: ['User', 'Chat', 'Post'],
	endpoints: (builder) => ({}),
});

export default apiSlice;
