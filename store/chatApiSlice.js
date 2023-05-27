import apiSlice from './apiSlice';

const CHAT_URL = '/chats';

const chatApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUserChats: builder.mutation({
			query: (uid) => ({
				url: `${CHAT_URL}/${uid}`,
				method: 'GET',
			}),
		}),
		getChatMessages: builder.mutation({
			query: (cid) => ({
				url: `${CHAT_URL}/messages/${cid}`,
				method: 'GET',
			}),
		}),
		getChatLastMessage: builder.mutation({
			query: (cid) => ({
				url: `${CHAT_URL}/messages/last/${cid}`,
				method: 'GET',
			}),
		}),
		sendMessages: builder.mutation({
			query: ({ chatId, body }) => ({
				url: `${CHAT_URL}/messages/send/${chatId}`,
				method: 'POST',
				body: body,
			}),
		}),
		createChat: builder.mutation({
			query: (data) => ({
				url: `${CHAT_URL}/create`,
				method: 'POST',
				body: data,
			}),
		}),
	}),
	overrideExisting: true,
});

export const {
	useGetUserChatsMutation,
	useGetChatMessagesMutation,
	useSendMessagesMutation,
	useCreateChatMutation,
	useGetChatLastMessageMutation,
} = chatApiSlice;
export default chatApiSlice;
