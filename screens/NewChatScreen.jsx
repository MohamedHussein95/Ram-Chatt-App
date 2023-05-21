import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import {
	useSearchUserMutation,
	useSearchUserQuery,
} from '../store/userApiSlice';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Chat from '../components/Chat';
import { useSelector } from 'react-redux';

const NewChatScreen = () => {
	const [searchPhrase, setSearchPhrase] = useState('');
	const [users, setUsers] = useState([]);
	const { userInfo } = useSelector((state) => state.auth);
	const [searchUsers] = useSearchUserMutation();
	const Id = userInfo._id;
	const handleSearch = async (text) => {
		try {
			setSearchPhrase(text);

			const res = await searchUsers({ Id, user: text }).unwrap();

			setUsers(res);
		} catch (error) {
			console.log(error);
			Toast.show({
				type: 'error',
				text2: `${error?.data?.message || error.error}`,
				position: 'bottom',
			});
		}
	};
	useEffect(() => {
		if (searchPhrase.length === 0) {
			setUsers((prev) => []);
		}
	}, [searchPhrase]);
	return (
		<View style={styles.screen}>
			<TextInput
				placeholder='search users'
				value={searchPhrase}
				onChangeText={handleSearch}
				style={{ marginBottom: 5 }}
			/>
			<FlatList
				data={users}
				renderItem={({ item }) => (
					<Chat
						key={item?._id}
						chatId={item?.chatId}
						status={null}
						lastMessage={null}
						sender={item}
					/>
				)}
				keyExtractor={(item) => item._id}
				style={{ flex: 1 }}
				contentContainerStyle={{
					justifyContent: 'center',
				}}
			/>
		</View>
	);
};

export default NewChatScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
});
