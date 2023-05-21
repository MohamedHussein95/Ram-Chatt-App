import apiSlice from './apiSlice';

const USERS_URL = '/api/users';

const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/register`,
				method: 'POST',
				body: data,
			}),
		}),
		login: builder.mutation({
			query: (data) => ({
				url: `${USERS_URL}/login`,
				method: 'POST',
				body: data,
			}),
		}),
		getUserInfo: builder.mutation({
			query: (id) => ({
				url: `${USERS_URL}/profile/${id}`,
				method: 'GET',
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
	}),
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useGetUserInfoMutation,
	useSearchUserMutation,
} = usersApiSlice;
export default usersApiSlice;
