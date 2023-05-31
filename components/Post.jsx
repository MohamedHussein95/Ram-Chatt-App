import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
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

const Post = ({ item, numbOfLines, poststyle, menuVisible = true }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const [post, setPost] = useState(item);
	const [active, setActive] = useState(false);
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
				userName: userInfo?.userName,
			};
			const id = item?._id;
			const res = await likePost({ id, body }).unwrap();
			setPost(res); // Assuming the response data is in the 'data' property

			socket.emit('liked', res);
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
			setPost(res);
			socket.emit('disliked', res);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		const handleLiked = async (res) => {
			if (res._id === post?._id) {
				setPost(res);
			}
		};

		const handleDisliked = async (res) => {
			if (res._id === post?._id) {
				setPost(res);
			}
		};

		const handleAddComment = async (res) => {
			if (res._id === post?._id) {
				setPost(res);
			}
		};
		const handleUserActive = async (id) => {
			if (id === post?.createdBy._id) {
				setActive(true);
			}
		};
		const handleUserInactive = async (id) => {
			if (id === post?.createdBy._id) {
				setActive(false);
			}
		};

		socket.on('liked', handleLiked);
		socket.on('disliked', handleDisliked);
		socket.on('add-comment', handleAddComment);
		socket.on('user-active', handleUserActive);
		socket.on('user-inactive', handleUserInactive);

		return () => {
			socket.off('liked', handleLiked);
			socket.off('disliked', handleDisliked);
			socket.off('add-comment', handleAddComment);
			socket.off('user-active', handleUserActive);
			socket.off('user-inactive', handleUserInactive);
		};
	}, [socket]);

	return (
		<View style={styles.post}>
			<View style={styles.header}>
				<View>
					<Avatar.Image
						size={30}
						source={{ uri: post?.createdBy?.avatar }}
					/>
					{active && (
						<View
							style={{
								width: 10,
								height: 10,
								backgroundColor: Colors.success,
								position: 'absolute',
								right: 0,
								top: 0,
								borderRadius: 50,
							}}
						/>
					)}
				</View>

				<View
					style={{
						...styles.nameContainer,
						...poststyle?.nameContainer,
					}}
				>
					<View
						style={{
							...{
								flexDirection: 'row',
								gap: -6,
								alignItems: 'center',
							},
							...poststyle?.fullNameContainer,
						}}
					>
						<Text
							style={styles.fullName}
							numberOfLines={1}
							ellipsizeMode='tail'
						>
							{post?.createdBy?.fullName}
						</Text>

						{post.createdBy?.verified && (
							<MaterialCommunityIcons
								name='check-decagram'
								size={15}
								color={Colors.liked}
								style={{ marginLeft: 8 }}
							/>
						)}
					</View>
					<View
						style={{
							...{
								justifyContent: 'center',
								alignItems: 'center',
								width: 80,
							},
							...poststyle?.userNameContainer,
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
				</View>
				<View
					style={{
						...{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'center',
							marginLeft: -5,
						},
						...poststyle?.timeContainer,
					}}
				>
					<Text style={styles.bullet}>•</Text>
					<Text style={styles.time}>{createdAt}</Text>
				</View>

				{menuVisible && (
					<View style={styles.menu}>
						<MaterialCommunityIcons
							name='dots-vertical'
							color={Colors.greyScale500}
							size={25}
						/>
					</View>
				)}
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
					{post.metaData.dislikes.length || '0'}
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
					{post.metaData.shares?.length || '0'}
				</Text>
			</View>
		</View>
	);
};

export default memo(Post);

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
		paddingTop: 5,
		marginBottom: 5,
	},
	bullet: { color: Colors.greyScale500, fontFamily: 'REGULAR' },
	userDetails: {
		flexDirection: 'row',
		alignItems: 'center',
		textAlign: 'center',
		flex: 1,
	},
	nameContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	menu: {
		position: 'absolute',
		right: 0,
	},
	avatarContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	fullName: {
		fontSize: 12,

		marginLeft: 5,
		marginTop: 1.5,
		color: Colors.white,
		fontFamily: 'MEDIUM',
	},
	userName: {
		fontSize: 12,
		marginBottom: 3,
		marginLeft: 1,
		color: Colors.greyScale500,
		fontFamily: 'REGULAR',
	},
	time: { color: Colors.greyScale500, fontFamily: 'REGULAR', fontSize: 10 },
	body: {},
	title: {
		fontSize: 18,
		fontFamily: 'SEMI_BOLD',
		color: Colors.white,
	},
	bodyText: {
		fontSize: 14,
		fontFamily: 'REGULAR',
		color: Colors.greyScale200,
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
