import React, { useEffect, useLayoutEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useDispatch, useSelector } from 'react-redux';

import { useGetChatMessagesMutation } from '../store/chatApiSlice';
import Message from '../components/Message';
import SendMessageInput from '../components/SendMessageInput';
const ChatScreen = ({ route, navigation }) => {
	const { sender, chatId } = route.params;
	//console.log(chatId);
	const [getChatMessages] = useGetChatMessagesMutation();
	const dispatch = useDispatch();
	const [cId, setCId] = useState(chatId);
	const [refreshing, setRefreshing] = useState(false);
	const [chatMessages, setChatMessages] = useState([]);

	//console.log(chatMessages);

	// Retrieve chat messages and sort them in descending order based on timestamps
	const getMessages = async () => {
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
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: sender?.fullName,
		});
	}, [navigation, route]);
	useEffect(() => {
		if (cId) {
			getMessages();
		}
	}, [chatId, dispatch]);
	return (
		<View style={styles.screen}>
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
			<SendMessageInput
				chatId={chatId}
				recipient={sender._id}
				updateChatId={(id) => setCId(id)}
			/>
		</View>
	);
};

export default ChatScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
});
