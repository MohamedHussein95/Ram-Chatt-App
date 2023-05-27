import apiSlice from './apiSlice';

const POST_URL = '/posts';

const postApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAllPosts: builder.mutation({
			query: () => ({
				url: `${POST_URL}/`,
				method: 'GET',
			}),
		}),
		getAPost: builder.mutation({
			query: (id) => ({
				url: `${POST_URL}/post/${id}`,
				method: 'GET',
			}),
		}),
		getUserPosts: builder.mutation({
			query: (uid) => ({
				url: `${POST_URL}/${uid}`,
				method: 'GET',
			}),
		}),

		createPost: builder.mutation({
			query: (data) => ({
				url: `${POST_URL}/create`,
				method: 'POST',
				body: data,
			}),
		}),
		deletePost: builder.mutation({
			query: (id) => ({
				url: `${POST_URL}/delete/${id}`,
				method: 'DELETE',
			}),
		}),
		likePost: builder.mutation({
			query: ({ id, body }) => ({
				url: `${POST_URL}/likes/${id}`,
				method: 'PUT',
				body: body,
			}),
		}),
		disLikePost: builder.mutation({
			query: ({ id, body }) => ({
				url: `${POST_URL}/dislikes/${id}`,
				method: 'PUT',
				body: body,
			}),
		}),
		getComments: builder.mutation({
			query: (id) => ({
				url: `${POST_URL}/comments/${id}`,
				method: 'GET',
			}),
		}),
		addComment: builder.mutation({
			query: ({ id, body }) => ({
				url: `${POST_URL}/comments/add/${id}`,
				method: 'POST',
				body: body,
			}),
		}),
	}),
	overrideExisting: true,
});

export const {
	useGetAllPostsMutation,
	useGetUserPostsMutation,
	useCreatePostMutation,
	useDeletePostMutation,
	useLikePostMutation,
	useDisLikePostMutation,
	useAddCommentMutation,
	useGetAPostMutation,
	useGetCommentsMutation,
} = postApiSlice;
export default postApiSlice;
