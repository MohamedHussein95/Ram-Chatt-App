import React, {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';
import {
	FlatList,
	ImageBackground,
	StyleSheet,
	TextInput,
	View,
} from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch, useSelector } from 'react-redux';
import { Appbar, Avatar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import {
	useCreateChatMutation,
	useGetChatMessagesMutation,
	useSendMessagesMutation,
} from '../store/chatApiSlice';
import Colors from '../constants/Colors';
import Message from '../components/Message';

import backgroundImage from '../assets/images/background/wallpaper8.jpg';
const ChatScreen = ({ route, navigation }) => {
	const { sender, chatId } = route.params;
	const { userInfo } = useSelector((state) => state.auth);
	const { bottom } = useSafeAreaInsets();
	const [getChatMessages] = useGetChatMessagesMutation();
	const dispatch = useDispatch();
	const [cId, setCId] = useState(chatId);
	const [refreshing, setRefreshing] = useState(false);
	const [chatMessages, setChatMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [textInputHeight, setTextInputHeight] = useState(80);
	const textInputRef = useRef(null);

	const [sendMessages] = useSendMessagesMutation();
	const [createChat] = useCreateChatMutation();

	const getMessages = useCallback(async () => {
		try {
			setRefreshing(true);
			if (cId) {
				const res = await getChatMessages(chatId).unwrap();
				setChatMessages(res);
			}
			setRefreshing(false);
		} catch (error) {
			setRefreshing(false);
			console.log(error);
			Toast.show({
				type: 'error',
				text2: `${error?.data?.message || error.error}`,
				position: 'bottom',
			});
		}
	}, [cId, chatId, getChatMessages]);

	const sendMessage = async () => {
		try {
			setMessage('');

			const body = {
				sender: userInfo?._id,
				content: message,
			};
			if (cId) {
				await sendMessages({
					chatId: cId,
					body,
				}).unwrap();
			} else {
				//create the chat and update the cId
				const newBody = {
					users: [userInfo._id, recipient],
					messages: [body],
				};
				const res = await createChat(newBody).unwrap();

				setCId(res._id);
			}
		} catch (error) {
			console.log(error);
			Toast.show({
				type: 'error',
				text2: `${error?.data?.message || error.error}`,
				position: 'top',
			});
		}
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: sender?.fullName,
		});
	}, [navigation, route]);

	useEffect(() => {
		if (cId) {
			getMessages()
				.then(() => console.log('fetched messages'))
				.catch((err) => console.log(err));
		}
	}, [cId, chatId, dispatch, getMessages]);

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

			{!chatId && (
				<Message
					text='This is a new chat. Say hi!'
					type='system'
					item={null}
				/>
			)}
			<ImageBackground
				source={backgroundImage}
				style={styles.backgroundImage}
			>
				<FlatList
					onRefresh={getMessages}
					refreshing={refreshing}
					data={chatMessages}
					renderItem={({ item }) => <Message item={item} />}
					keyExtractor={(item) => item._id}
					style={{ flex: 1 }}
					contentContainerStyle={{
						justifyContent: 'center',
					}}
				/>
			</ImageBackground>

			<View>
				<Appbar
					style={[
						styles.bottom,
						{
							height: textInputHeight + bottom + 40,
						},
					]}
					safeAreaInsets={{ bottom }}
				>
					<View style={styles.inputContainer}>
						<Appbar.Action
							icon='emoticon'
							onPress={() => {}}
							color={Colors.white}
							size={30}
						/>

						<TextInput
							ref={textInputRef}
							style={[styles.textBox, { height: textInputHeight }]}
							placeholder='Send a message'
							placeholderTextColor={Colors.greyScale700}
							cursorColor={Colors.white}
							autoCapitalize='words'
							autoComplete='name'
							autoCorrect
							autoFocus
							multiline={true}
							onChangeText={(text) => setMessage(text)}
							value={message}
							onContentSizeChange={(e) => {
								const { height } = e.nativeEvent.contentSize;
								setTextInputHeight(height > 40 ? height : 40);
							}}
						/>

						{message.trim().length === 0 ? (
							<>
								<Appbar.Action
									icon='file'
									onPress={() => {}}
									color={Colors.white}
									size={25}
								/>
								<Appbar.Action
									icon='microphone'
									onPress={() => {}}
									color={Colors.white}
									size={25}
								/>
							</>
						) : (
							<Appbar.Action
								icon='send'
								onPress={sendMessage}
								color={Colors.white}
								size={25}
							/>
						)}
					</View>
				</Appbar>
			</View>
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
});
