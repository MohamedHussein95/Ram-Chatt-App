import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
	didTryAutoLogin: false, //to conditionally render stacks
	userInfo: null,
	isAuth: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setCredentials: (state, action) => {
			try {
				const { user } = action.payload;
				if (user) {
					state.userInfo = user;
					state.isAuth = true;
					AsyncStorage.setItem('userId', user._id);
				}
			} catch (error) {
				console.error(error);
			}
		},
		setDidTryAutoLogin: (state) => {
			state.didTryAutoLogin = true;
		},
		clearCredentials: (state) => {
			state.userInfo = null;
			state.isAuth = null;
			AsyncStorage.removeItem('userId');
		},
	},
});

export const { setCredentials, setDidTryAutoLogin, clearCredentials } =
	authSlice.actions;

export default authSlice.reducer;
