import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import moment from 'moment';
import { useSelector } from 'react-redux';
import {
	useDisLikePostMutation,
	useGetAPostMutation,
	useLikePostMutation,
} from '../store/postApiSlice';
import socket from '../utils/socket';
import { useNavigation } from '@react-navigation/native';

const Post = ({ item, numbOfLines }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const [post, setPost] = useState(item);

	const liked = post?.metaData?.likes?.includes(userInfo?._id);
	const disliked = post?.metaData?.dislikes?.includes(userInfo?._id);

	const date = new Date(post?.createdAt);
	const createdAt = moment(date).fromNow(true);

	const navigation = useNavigation();

	const [likePost] = useLikePostMutation();
	const [dislikePost] = useDisLikePostMutation();
	const [getAPost] = useGetAPostMutation();

	const handleLikePosts = async () => {
		try {
			const body = {
				userId: userInfo?._id,
			};
			const id = item?._id;
			const res = await likePost({ id, body }).unwrap();
			setPost(res); // Assuming the response data is in the 'data' property
			socket.emit('liked', id);
		} catch (error) {
			console.log(error);
		}
	};
	const handleDisLikePosts = async () => {
		try {
			const body = {
				userId: userInfo?._id,
			};
			const id = item?._id;
			const res = await dislikePost({ id, body }).unwrap();
			setPost(res); // Assuming the response data is in the 'data' property
			socket.emit('disliked', id);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		socket.on('liked', async (id) => {
			if (id === post?._id) {
				//console.log('liked');
				const res = await getAPost(id).unwrap();

				setPost(res);
			}
		});
		socket.on('disliked', async (id) => {
			if (id === post?._id) {
				//console.log('disliked');
				const res = await getAPost(id).unwrap();

				setPost(res);
			}
		});
		socket.on('add-comment', async (id) => {
			if (id === post?._id) {
				//console.log('disliked');
				const res = await getAPost(id).unwrap();

				setPost(res);
			}
		});
		return () => {
			socket.off('liked');
			socket.off('disliked');
			socket.off('add-comment');
		};
	}, [socket]);
	return (
		<View style={styles.post}>
			<View style={styles.header}>
				<View style={styles.avatarContainer}>
					<Avatar.Image
						size={25}
						source={{ uri: post?.createdBy?.avatar }}
					/>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							textAlign: 'center',

							flex: 1,
						}}
					>
						<View
							style={{
								width: 140,
							}}
						>
							<Text
								style={styles.userName}
								numberOfLines={1}
								ellipsizeMode='tail'
							>
								{post?.createdBy?.userName}
							</Text>
						</View>

						{userInfo?.verified && (
							<MaterialCommunityIcons
								name='check-decagram'
								size={15}
								color={Colors.liked}
							/>
						)}
					</View>
					<Text style={styles.time}>{createdAt}</Text>
				</View>
				<View style={styles.menu}>
					<MaterialCommunityIcons
						name='dots-vertical'
						color={Colors.greyScale500}
						size={25}
					/>
				</View>
			</View>
			<View style={styles.body}>
				<Text style={styles.title}>{post?.title}</Text>
				{post?.body?.text && (
					<Text style={styles.bodyText} numberOfLines={numbOfLines || 4}>
						{post?.body?.text}
					</Text>
				)}
			</View>
			<View style={styles.footer}>
				<MaterialCommunityIcons
					name={liked && !disliked ? 'thumb-up' : 'thumb-up-outline'}
					size={25}
					color={liked ? Colors.liked : Colors.greyScale500}
					onPress={handleLikePosts}
				/>
				<Text style={styles.footerText}>
					{post?.metaData?.likes?.length || '0'}
				</Text>
				<MaterialCommunityIcons
					name={disliked && !liked ? 'thumb-down' : 'thumb-down-outline'}
					size={25}
					color={Colors.greyScale500}
					onPress={handleDisLikePosts}
				/>
				<Text style={styles.footerText}>
					{post?.metaData?.dislikes?.length || '0'}
				</Text>
				<MaterialCommunityIcons
					name='comment-outline'
					size={25}
					color={Colors.greyScale500}
					onPress={() =>
						navigation.navigate('PostDetailsScreen', { post })
					}
				/>
				<Text style={styles.footerText}>
					{post.metaData.comments.length || '0'}
				</Text>

				<MaterialCommunityIcons
					name='share-outline'
					size={35}
					color={Colors.greyScale500}
				/>
				<Text style={styles.footerText}>
					{post?.metaData?.shares?.length || '0'}
				</Text>
			</View>
		</View>
	);
};

export default Post;

const styles = StyleSheet.create({
	post: {
		marginVertical: 2,
		width: '100%',
		alignSelf: 'center',
		overflow: 'hidden',
		backgroundColor: Colors.dark1,
		paddingHorizontal: 15,
		elevation: 2,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		paddingTop: 5,

		marginBottom: 5,
	},
	menu: {
		margin: 0,
	},
	avatarContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	userName: {
		fontSize: 14,
		marginRight: 8,
		marginLeft: 5,
		color: Colors.greyScale500,
		fontFamily: 'REGULAR',
	},
	time: { fontFamily: 'REGULAR', fontSize: 12, color: Colors.greyScale500 },
	body: {},
	title: {
		fontSize: 18,
		fontFamily: 'SEMI_BOLD',
		color: Colors.white,
	},
	bodyText: {
		fontSize: 14,
		fontFamily: 'MEDIUM',
		color: Colors.greyScale500,
	},
	footer: {
		width: '80%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',

		marginBottom: 5,
	},
	footerText: {
		color: Colors.greyScale500,
	},
});
