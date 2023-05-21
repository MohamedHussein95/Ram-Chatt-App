import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, FAB, Portal } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../store/authSlice';
import { useGetUserChatsMutation } from '../store/chatApiSlice';
import { setUserChats } from '../store/chatSlice';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Chat from '../components/Chat';
const HomeScreen = ({ navigation }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const { chats } = useSelector((state) => state.chat) || {};
	const [state, setState] = useState({ open: false });
	const [refreshing, setRefreshing] = useState(false);
	//console.log(chats);
	const onStateChange = ({ open }) => setState({ open });

	const { open } = state;
	const dispatch = useDispatch();

	const submitHandler = async () => {
		try {
			dispatch(clearCredentials());
		} catch (error) {
			console.log(error);
			Toast.show({
				type: 'error',
				text2: `${error.message}`,
			});
		}
	};
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

			<FAB.Group
				open={open}
				visible
				icon={open ? 'chat-processing' : 'chat'}
				actions={[
					{
						icon: 'plus',
						label: 'new chat',
						onPress: () => navigation.navigate('NewChatScreen'),
					},
				]}
				onStateChange={onStateChange}
				onPress={() => {
					if (open) {
						// do something if the speed dial is open
					}
				}}
			/>

			<Button mode='elevated' onPress={submitHandler}>
				logout
			</Button>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
});
