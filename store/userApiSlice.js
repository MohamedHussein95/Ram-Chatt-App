import apiSlice from './apiSlice';

const USERS_URL = '/users';

const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/register`,
				method: 'POST',
				body: data,
			}),
		}),
		registerForPushToken: builder.mutation({
			query: ({ id, tokenData }) => ({
				url: `${USERS_URL}/pushToken/${id}`,
				method: 'POST',
				body: tokenData,
			}),
		}),
		login: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/login`,
				method: 'POST',
				body: data,
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: `${USERS_URL}/logout`,
				method: 'POST',
			}),
		}),
		getUserInfo: builder.mutation({
			query: (id) => ({
				url: `${USERS_URL}/profile/${id}`,
				method: 'GET',
				timeout: 5000,
			}),
		}),
		searchUser: builder.mutation({
			query: ({ Id, user }) => ({
				url: `${USERS_URL}/search`,
				method: 'GET',
				params: {
					Id,
					user,
				},
			}),
		}),
		uploadProfile: builder.mutation({
			query: ({ id, file }) => ({
				url: `${USERS_URL}/upload_profile/${id}`,
				method: 'PUT',
				body: file,
			}),
		}),

		updateBio: builder.mutation({
			query: ({ id, body }) => ({
				url: `${USERS_URL}/bio/${id}`,
				method: 'PUT',
				body: body,
			}),
		}),
		getOtherUserProfile: builder.mutation({
			query: (id) => ({
				url: `${USERS_URL}/profile/user/${id}`,
				method: 'GET',
			}),
		}),
		followUser: builder.mutation({
			query: ({ id, body }) => ({
				url: `${USERS_URL}/follow/${id}`,
				method: 'PUT',
				body: body,
			}),
		}),
	}),
	overrideExisting: true,
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useGetUserInfoMutation,
	useSearchUserMutation,
	useLogoutMutation,
	useUploadProfileMutation,
	useUpdateBioMutation,
	useGetOtherUserProfileMutation,
	useFollowUserMutation,
	useRegisterForPushTokenMutation,
} = usersApiSlice;
export default usersApiSlice;
