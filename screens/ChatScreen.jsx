import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import {
	FlatList,
	Image,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import backgroundImage from '../assets/images/background/wallpaper4.jpg';
import Bubble from '../components/Bubble';
import ChatInput from '../components/ChatInput';
import Colors from '../constants/Colors';
import {
	useCreateChatMutation,
	useGetChatMessagesMutation,
	useSendMessagesMutation,
} from '../store/chatApiSlice';
import socket from '../utils/socket';

const ChatScreen = ({ route, navigation }) => {
	const { sender, chatId } = route.params;
	const [cId, setCId] = useState(chatId);
	const [refreshing, setRefreshing] = useState(false);
	const [chatMessages, setChatMessages] = useState([]);
	const [active, setActive] = useState(false);
	const [typing, setTyping] = useState(false);

	const [visible, setVisible] = useState(true);

	const { userInfo } = useSelector((state) => state.auth);

	const flatListRef = useRef(null);
	const viewableItemsChanged = useRef(({ viewableItems }) => {
		// handle changes to viewable items
		viewableItems.forEach((viewableItem) => {
			const { item, isViewable } = viewableItem;
			if (isViewable) {
				// Access the viewed item and emit the event

				socket.emit('message-viewed', item._id, item.user._id);
			}
		});
	});

	const [getChatMessages] = useGetChatMessagesMutation();
	const [sendMessages] = useSendMessagesMutation();
	const [createChat] = useCreateChatMutation();

	const hideModal = () => setVisible(false);

	//listen for new Chat
	useEffect(() => {
		socket.on('new-message', async (uid, cid, message) => {
			if (cId === cid) {
				// Update the chatMessages array by appending the new message
				setChatMessages((previousMessages) => [
					...previousMessages,
					message,
				]);
				flatListRef.current.scrollToEnd();
			}
		});
		socket.on('typing', async (id) => {
			if (cId === id) {
				// Update the typing
				setTyping(true);
			}
		});
		socket.on('not-typing', async (id) => {
			if (cId === id) {
				// Update the typing
				setTyping(false);
			}
		});
		socket.on('user-active', async (id) => {
			if (id === sender._id) {
				setActive(true);
			}
		});
		socket.on('user-inactive', async (id) => {
			if (id === sender._id) {
				setActive(false);
			}
		});
		return () => {
			socket.off('new-message');
			socket.off('user-active');
			socket.off('user-inactive');
			socket.emit('not-typing', cId);
		};
	}, [socket]);

	//send message
	const handleSendMessage = useCallback(async (text) => {
		try {
			const message = {
				_id: Math.random() * 1000,
				text,
				createdAt: new Date(),
				user: {
					_id: userInfo?._id,
					name: userInfo?.lastName,
					avatar: userInfo?.avatar,
				},
				delivered: true,
			};
			// Update the chatMessages array by appending the new message
			setChatMessages((previousMessages) => [...previousMessages, message]);
			const body = {
				sender: userInfo?._id,
				content: text,
				createdAt: new Date(),
				userName: userInfo?.userName,
			};
			if (cId) {
				await sendMessages({
					chatId: cId,
					body,
				}).unwrap();

				socket.emit('new-message', sender?._id, cId, message);
			} else {
				const newBody = {
					users: [userInfo._id, sender?._id],
					messages: [body],
				};

				const res = await createChat(newBody).unwrap();
				setCId(res._id);
				socket.emit('new-chat', sender?._id, userInfo._id);
			}
		} catch (error) {
			console.log(error);
			Toast.show({
				type: 'error',
				text2: `${error?.data?.message || error.error}`,
				position: 'top',
			});
		}
	}, []);

	//set the header title
	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: sender?.fullName,
		});
	}, [navigation, route]);

	//get messages function
	const getMessages = useCallback(async () => {
		try {
			const res = await getChatMessages(cId).unwrap();

			setChatMessages(res);
		} catch (error) {
			console.log(error);
		}
	}, []);

	// get messages on first render
	useEffect(() => {
		if (cId) {
			console.log(cId);
			getMessages();
		}
	}, [cId]);
	useEffect(() => {
		if (typing) {
			setChatMessages([
				...chatMessages,
				{
					id: '5464664565654',
					text: 'typing...',
					createdAt: null,
					user: null,
				},
			]);
		} else {
			const index = chatMessages.findIndex((m) => m._id === '5464664565654');
			const updatedChatMessages = [...chatMessages];
			setChatMessages(updatedChatMessages.splice(index, 0));
		}
	}, [typing]);
	return (
		<KeyboardAvoidingView
			style={styles.screen}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			keyboardVerticalOffset={100}
		>
			<View style={styles.screen}>
				<Appbar.Header style={styles.header}>
					<Appbar.BackAction
						onPress={() => navigation.pop()}
						color={Colors.white}
					/>
					<View>
						<Avatar.Image
							source={{ uri: sender?.avatar }}
							size={40}
							style={{ marginRight: 10 }}
						/>
						{active && (
							<View
								style={{
									width: 10,
									height: 10,
									backgroundColor: Colors.success,
									position: 'absolute',
									right: 10,
									top: 0,
									borderRadius: 50,
								}}
							/>
						)}
					</View>

					<Appbar.Content
						title={sender?.fullName}
						color={Colors.white}
						onPress={() =>
							navigation.navigate('UserDetailsScreen', { sender })
						}
					/>

					<Appbar.Action
						icon='dots-vertical'
						onPress={() => {}}
						color={Colors.white}
						size={30}
					/>
				</Appbar.Header>

				<ImageBackground
					source={backgroundImage}
					style={styles.backgroundImage}
				>
					{!cId && (
						<View style={styles.containerStyle}>
							<ScrollView
								style={{ flex: 1 }}
								refreshControl={
									<RefreshControl
										refreshing={refreshing}
										onRefresh={getChatMessages}
									/>
								}
							>
								<TouchableOpacity
									style={styles.newChatModal}
									onPress={() => handleSendMessage('Hey 👋')}
									activeOpacity={0.7}
								>
									<Text
										style={{
											color: Colors.white,
											fontFamily: 'BOLD',
											marginVertical: 15,
										}}
									>
										No messages here yet...
									</Text>
									<Text
										style={{
											color: Colors.white,
											fontFamily: 'REGULAR',
											marginVertical: 15,
											textAlign: 'center',
										}}
									>
										Send a message or tap the greeting below
									</Text>
									<Image
										source={require('../assets/images/gifs/waving_hand.gif')}
										resizeMode='contain'
									/>
								</TouchableOpacity>
							</ScrollView>
						</View>
					)}
					<FlatList
						ref={flatListRef}
						onRefresh={getChatMessages}
						refreshing={refreshing}
						data={chatMessages}
						renderItem={({ item }) => <Bubble key={item} item={item} />}
						keyExtractor={(item) => item._id}
						style={{ flex: 1 }}
						contentContainerStyle={{
							justifyContent: 'center',
						}}
						onViewableItemsChanged={viewableItemsChanged.current}
						viewabilityConfig={{ itemVisiblePercentThreshold: 50 }} // adjust threshold as needed
					/>
					<ChatInput onPress={(text) => handleSendMessage(text)} />
				</ImageBackground>
			</View>
		</KeyboardAvoidingView>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	header: {
		backgroundColor: Colors.primary,
	},
	bottom: {
		backgroundColor: Colors.primary,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		padding: 15,
		elevation: 2,
	},
	inputContainer: {
		flexDirection: 'row',
		paddingVertical: 8,
		justifyContent: 'space-between',
		width: '100%',
		alignItems: 'center',
		height: 'auto',
	},
	textBox: {
		flex: 1,
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: Colors.white,
		fontFamily: 'REGULAR',
		fontSize: 16,
		letterSpacing: 0.5,
		height: 'auto',
	},
	backgroundImage: {
		flex: 1,
		resizeMode: 'cover',
	},
	disclaimer: {
		textAlign: 'center',
		color: Colors.greyScale600,
	},
	containerStyle: {
		backgroundColor: Colors.primary,
		opacity: 0.8,
		overflow: 'hidden',
		width: '60%',
		alignSelf: 'center',
		borderRadius: 10,
		height: '40%',
		position: 'absolute',
		top: 100,
		bottom: 100,
		marginTop: 20,
	},
	newChatModal: {
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
});
