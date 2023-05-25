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
		updateUserProfile: (state, action) => {
			state.userInfo.avatar = action.payload;
		},
		updateUserBio: (state, action) => {
			state.userInfo.bio = action.payload;
		},
		updateFollowing: (state, action) => {
			const index = state.userInfo.profileData.following.findIndex(
				(u) => u.toString() === action.payload.toString()
			);
			if (index > -1) {
				state.userInfo.profileData.following.splice(index, 0);
			} else {
				state.userInfo.profileData.following.unshift(action.payload);
			}
		},
	},
});

export const {
	setCredentials,
	setDidTryAutoLogin,
	clearCredentials,
	updateUserProfile,
	updateUserBio,
	updateFollowing,
} = authSlice.actions;

export default authSlice.reducer;
