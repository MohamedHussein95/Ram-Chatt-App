import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './apiSlice';
import authSlice from './authSlice';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import chatSlice from './chatSlice';

const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authSlice,
		chat: chatSlice,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
	devTools: true,
});

setupListeners(store.dispatch);

export default store;
