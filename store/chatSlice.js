import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	chats: {},
	messages: [],
};

const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setUserChats: (state, action) => {
			state.chats = action.payload;
		},
		setChatMessages: (state, action) => {
			state.messages.unshift(action.payload);
		},
	},
});

export const { setUserChats, setChatMessages } = chatSlice.actions;

export default chatSlice.reducer;
