import { Ionicons } from '@expo/vector-icons';
import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react';
import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
	Bubble,
	Composer,
	GiftedChat,
	InputToolbar,
	Send,
} from 'react-native-gifted-chat';
import { Appbar, Avatar } from 'react-native-paper';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import backgroundImage from '../assets/images/background/wallpaper4.jpg';
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

	const [chatMessages, setChatMessages] = useState([]);

	const [typing, setTyping] = useState(false);

	const [visible, setVisible] = useState(true);

	const { userInfo } = useSelector((state) => state.auth);

	const [getChatMessages] = useGetChatMessagesMutation();
	const [sendMessages] = useSendMessagesMutation();
	const [createChat] = useCreateChatMutation();

	const hideModal = () => setVisible(false);

	//listen for new Chat
	useEffect(() => {
		socket.on('new-message', async (id, message) => {
			if (cId === id) {
				// Update the chatMessages array by appending the new message
				setChatMessages((previousMessages) => [
					...previousMessages,
					message,
				]);
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
		return () => {
			socket.off('new-message');
			socket.emit('not-typing', cId);
		};
	}, [socket]);

	//send message
	const onSend = useCallback(async (messages = []) => {
		try {
			const { text, createdAt } = messages[0];
			const body = {
				sender: userInfo?._id,
				content: text,
				createdAt,
				userName: userInfo?.userName,
			};

			// Update the chatMessages array by appending the new message
			setChatMessages((previousMessages) => [
				...previousMessages,
				messages[0],
			]);
			if (cId) {
				await sendMessages({
					chatId: cId,
					body,
				}).unwrap();

				socket.emit('new-message', cId, messages[0]);
			} else {
				const newBody = {
					users: [userInfo._id, sender?._id],
					messages: [body],
				};
				const res = await createChat(newBody).unwrap();
				setCId(res._id);
				socket.emit('new-chat', sender.id);
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

	//get messages on first render
	useEffect(() => {
		if (cId) {
			getMessages().catch((err) => console.log(err));
		}
	}, [cId]);

	return (
		<View style={styles.screen}>
			<Appbar.Header style={styles.header}>
				<Appbar.BackAction
					onPress={() => navigation.pop()}
					color={Colors.white}
				/>
				<Avatar.Image
					source={{ uri: sender?.avatar }}
					size={40}
					style={{ marginRight: 10 }}
				/>

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
						<TouchableOpacity style={styles.newChatModal}>
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
					</View>
				)}
				<GiftedChat
					messages={chatMessages}
					inverted={true}
					onSend={(messages) => onSend(messages)}
					user={{
						_id: userInfo?._id,
						name: userInfo?.lastName,
						avatar: userInfo?.avatar,
					}}
					isTyping={typing}
					onInputTextChanged={() => {
						socket.emit('typing', cId);
					}}
					renderInputToolbar={(props) => customInputToolbar(props)}
					renderSystemMessage={(props) => customSystemMessage(props)}
					renderAvatarOnTop
					renderUsernameOnMessage
					alignTop
					renderSend={(props) => (
						<Send {...props}>
							<Ionicons name='send' size={26} color={Colors.white} />
						</Send>
					)}
					renderBubble={(props) => (
						<Bubble
							{...props}
							wrapperStyle={{
								left: {
									backgroundColor: Colors.greyScale700,
								},
								right: {
									backgroundColor: Colors.primary,
								},
							}}
							textStyle={{
								left: {
									color: Colors.white,
								},
								right: {
									color: Colors.white,
								},
							}}
						/>
					)}
				/>
			</ImageBackground>
		</View>
	);
};

const customInputToolbar = (props) => {
	return (
		<InputToolbar
			{...props}
			primaryStyle={{ alignItems: 'center' }}
			containerStyle={{
				backgroundColor: Colors.primary,
				borderTopColor: Colors.primary600,
				borderTopWidth: 1,
				padding: 8,
			}}
			accessoryStyle={{
				display: 'flex',
				alignItems: 'center',
				marginLeft: 8,
			}}
			renderComposer={() => (
				<Composer
					{...props}
					textInputStyle={{ color: Colors.white }} // Set the desired text color here
					multiline={true}
					keyboardAppearance='dark'
					textInputProps={{
						...props.textInputProps,
						autoCapitalize: 'sentences', // Set the desired autoCapitalize value here
					}}
				/>
			)}
			// renderAccessory={() => (
			// 	<View
			// 		style={{
			// 			backgroundColor: 'red',
			// 			width: '100%',
			// 			justifyContent: 'space-between',
			// 			flexDirection: 'row',
			// 		}}
			// 	>
			// 		<IconButton
			// 			icon='microphone'
			// 			onPress={() => {
			// 				// Handle microphone button press
			// 			}}
			// 			size={24}
			// 			color={Colors.white}
			// 		/>
			// 		<IconButton
			// 			icon={({ size, color }) => (
			// 				<Ionicons name='happy-outline' size={size} color={color} />
			// 			)}
			// 			onPress={() => {
			// 				// Handle emoji button press
			// 			}}
			// 			size={24}
			// 			color={Colors.white}
			// 		/>
			// 		<IconButton
			// 			icon={({ size, color }) => (
			// 				<Ionicons
			// 					name='images-outline'
			// 					size={size}
			// 					color={Colors.white}
			// 				/>
			// 			)}
			// 			onPress={() => {
			// 				// Handle gallery button press
			// 			}}
			// 			size={24}
			// 			color={Colors.white}
			// 		/>
			// 	</View>
			// )}
		/>
	);
};
const customSystemMessage = () => {
	return (
		<View style={styles.ChatMessageSytemMessageContainer}>
			<Icon name='lock' color='#9d9d9d' size={16} />
			<Text style={styles.ChatMessageSystemMessageText}>
				Messages are end-to-end encrypted. Not even Ramchatt can see them
			</Text>
		</View>
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
