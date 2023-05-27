import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../constants/Colors';
import Post from '../components/Post';
import { FlatList } from 'react-native-gesture-handler';
import Comment from '../components/Comment';
import {
	useAddCommentMutation,
	useGetCommentsMutation,
} from '../store/postApiSlice';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import socket from '../utils/socket';

const PostDetailsScreen = ({ route, navigation }) => {
	const { post } = route.params;
	const { userInfo } = useSelector((state) => state.auth);
	const [comments, setComments] = useState({});
	const [comment, setComment] = useState('');
	const [updatedPost, setUpdatedPost] = useState(post);
	const [refreshing, setRefreshing] = useState(false);
	const [getComments] = useGetCommentsMutation();
	const [addComment] = useAddCommentMutation();
	const getAllComments = async () => {
		try {
			const id = post?._id;
			const res = await getComments(id).unwrap();
			setComments(res);
		} catch (error) {
			console.log(error);
		}
	};
	const handleAddComment = async () => {
		try {
			setComment('');
			const body = {
				userId: userInfo?._id,
				body: comment,
			};
			const id = post?._id;
			const res = await addComment({ id, body }).unwrap();
			setUpdatedPost(res);
			socket.emit('add-comment', id);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		//get comments
		getAllComments().catch((err) => console.log(err));
	}, [route, navigation, post, updatedPost]);
	useEffect(() => {
		socket.on('add-comment', async (id) => {
			if (id === post?._id) {
				const res = await getComments(id).unwrap();

				setComments(res);
			}
		});
		return () => {
			socket.off('add-comment');
		};
	}, [socket, post, updatedPost]);
	return (
		<View style={styles.screen}>
			<Appbar.Header style={styles.header}>
				<Appbar.BackAction
					onPress={() => navigation.pop()}
					color={Colors.white}
				/>

				<Appbar.Action
					icon='dots-vertical'
					onPress={() => {}}
					color={Colors.white}
					size={30}
				/>
			</Appbar.Header>

			<FlatList
				onRefresh={getAllComments}
				refreshing={refreshing}
				ListHeaderComponent={
					<Post
						item={updatedPost}
						style={styles.post}
						numbOfLines={1000}
					/>
				}
				data={Object.values(comments)}
				keyExtractor={(item) => item._id}
				renderItem={({ item }) => <Comment item={item} />}
				style={{ flex: 1 }}
				ListEmptyComponent={
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<View
							style={{
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							<Text style={styles.noComments}>
								Be the first to comment
							</Text>
						</View>
					</View>
				}
			/>

			<View style={styles.footer}>
				<TextInput
					style={styles.input}
					placeholder='Add a comment'
					placeholderTextColor={Colors.primary400}
					value={comment}
					onChangeText={(text) => setComment(text)}
					autoCapitalize='sentences'
					autoComplete='name'
				/>
				{comment.trim().length > 0 && (
					<MaterialCommunityIcons
						name='send'
						size={20}
						color={Colors.primary400}
						onPress={handleAddComment}
					/>
				)}
			</View>
		</View>
	);
};

export default PostDetailsScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.dark2,
	},
	header: {
		backgroundColor: Colors.primary,
		justifyContent: 'space-between',
	},
	post: {},
	footer: {
		backgroundColor: Colors.primary,
		padding: 10,
		elevation: 2,
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	input: {
		flex: 1,
		color: Colors.white,
		fontFamily: 'MEDIUM',
	},
	noComments: {
		fontSize: 18,
		fontFamily: 'REGULAR',
		color: Colors.greyScale600,
		textAlign: 'center',
		marginTop: 30,
	},
});
