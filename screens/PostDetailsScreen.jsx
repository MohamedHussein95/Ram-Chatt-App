import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
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
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import socket from '../utils/socket';
import ProfileSetting from '../components/ProfileSetting';

const PostDetailsScreen = ({ route, navigation }) => {
	const { post } = route.params;
	const { userInfo } = useSelector((state) => state.auth);
	const [comments, setComments] = useState({});
	const [comment, setComment] = useState('');
	const [updatedPost, setUpdatedPost] = useState(post);
	const [refreshing, setRefreshing] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [state, setState] = useState();
	const fileUri = 'exp://192.168.0.102:19000';

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
				console.log('yes-c');
				setComments(res);
			}
		});
		return () => {
			socket.off('add-comment');
		};
	}, [socket, post, updatedPost]);
	const postStyle = {
		nameContainer: {
			flexDirection: 'column',
			alignItems: 'flex-start',
			height: 40,
			gap: -5,
			marginLeft: 4,
		},
		userNameContainer: {
			width: '100%',

			marginLeft: 0,
			alignItems: 'flex-start',
		},
		fullNameContainer: {},
		timeContainer: {
			alignSelf: 'flex-end',

			marginLeft: -10,
		},
	};
	const handleShare = async () => {
		try {
			const postUrl = 'https://example.com/post'; // Replace with the actual URL of the post

			await Sharing.shareAsync(postUrl);
		} catch (error) {
			console.log('Error sharing post:', error);
		}
	};

	return (
		<View style={styles.screen}>
			<Appbar.Header style={styles.header}>
				<Appbar.BackAction
					onPress={() => navigation.pop()}
					color={Colors.white}
				/>

				<Appbar.Action
					icon='dots-vertical'
					onPress={() => setModalVisible(true)}
					color={Colors.white}
					size={30}
				/>
				<Modal
					visible={modalVisible}
					onRequestClose={() => {
						setModalVisible(!modalVisible);
					}}
					transparent
				>
					<View
						style={{
							position: 'absolute',
							right: 30,
							top: 20,
							width: '40%',
							backgroundColor: Colors.dark3,
							shadowColor: '#000',
							shadowOffset: {
								width: 0,
								height: 2,
							},
							shadowOpacity: 0.25,
							shadowRadius: 4,
							elevation: 5,
						}}
					>
						<View style={styles.modalView}>
							<ProfileSetting
								title={'Share'}
								icon={'share-outline'}
								IconPack={MaterialCommunityIcons}
								onPress={handleShare}
								color={Colors.white}
								size={25}
								styleTitle={{ fontSize: 16 }}
							/>

							<ProfileSetting
								title={'Report'}
								icon={'flag-outline'}
								IconPack={MaterialCommunityIcons}
								onPress={() => {}}
								color={Colors.white}
								size={25}
								styleTitle={{ fontSize: 16 }}
							/>
						</View>
					</View>
				</Modal>
			</Appbar.Header>

			<FlatList
				onRefresh={getAllComments}
				refreshing={refreshing}
				ListHeaderComponent={
					<Post
						item={updatedPost}
						style={styles.headerPostStyle}
						numbOfLines={0}
						poststyle={postStyle}
						menuVisible={false}
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
	headerPostStyle: {},
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
