import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Appbar, Button, FAB, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import { useGetUserChatsMutation } from '../store/chatApiSlice';
import { setUserChats } from '../store/chatSlice';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Chat from '../components/Chat';
import Colors from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';

const ChatListScreen = ({ navigation }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const { chats } = useSelector((state) => state.chat) || {};
	const [state, setState] = useState({ open: false });
	const [refreshing, setRefreshing] = useState(false);

	const onStateChange = ({ open }) => setState({ open });

	const { open } = state;
	const dispatch = useDispatch();

	const [getUserChats] = useGetUserChatsMutation();

	//retreive all the chats user has and sort them
	const getChats = async () => {
		try {
			setRefreshing(true);
			const res = await getUserChats(userInfo?._id).unwrap();

			dispatch(setUserChats({ ...res }));
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
	useEffect(() => {
		getChats();
	}, [userInfo, dispatch]);

	return (
		<View style={styles.screen}>
			<StatusBar style='light' backgroundColor={Colors.primary} />
			<Appbar.Header style={styles.header}>
				<Appbar.Content title='Ram Chatt' color={Colors.white} />
			</Appbar.Header>
			{chats.length <= 0 ? (
				<Text>You have no chats</Text>
			) : (
				<FlatList
					onRefresh={getChats}
					refreshing={refreshing}
					data={Object.values(chats)}
					renderItem={({ item }) => (
						<Chat
							key={item}
							chatId={item?._id}
							status={item?.status?.blocked}
							lastMessage={item?.messages[item?.messages.length - 1]}
							sender={item?.users[0]}
						/>
					)}
					keyExtractor={(item) => item._id}
					style={{ flex: 1 }}
					contentContainerStyle={{
						justifyContent: 'center',
					}}
				/>
			)}
			<FAB
				icon='plus'
				color={Colors.white}
				style={styles.fab}
				onPress={() => navigation.navigate('NewChatScreen')}
			/>
		</View>
	);
};

export default ChatListScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
		backgroundColor: Colors.primary,
		borderRadius: 50,
	},
	header: {
		backgroundColor: Colors.primary,
	},
});
