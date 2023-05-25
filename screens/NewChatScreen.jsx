import {
	FlatList,
	StyleSheet,
	Text,
	View,
	TextInput,
	ActivityIndicator,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import {
	useSearchUserMutation,
	useSearchUserQuery,
} from '../store/userApiSlice';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import Chat from '../components/Chat';
import { useSelector } from 'react-redux';
import { Appbar } from 'react-native-paper';
import Colors from '../constants/Colors';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

const NewChatScreen = ({ navigation }) => {
	const [searchPhrase, setSearchPhrase] = useState('');
	const [loading, setLoading] = useState(false);
	const [users, setUsers] = useState([]);
	const [emptyResult, setEmptyResult] = useState(false);
	const [searching, setSearching] = useState(false);
	const { userInfo } = useSelector((state) => state.auth);
	const [searchUsers] = useSearchUserMutation();
	const Id = userInfo._id;
	const handleSearch = async (text) => {
		try {
			if (!searchPhrase || searchPhrase === '') {
				setUsers();
				setEmptyResult(false);
				return;
			}
			setLoading(true);

			const res = await searchUsers({ Id, user: searchPhrase }).unwrap();

			setUsers(res);
			console.log(res);
			if (res.length === 0) {
				setEmptyResult(true);
			} else {
				setEmptyResult(false);
			}
			setLoading(false);
		} catch (error) {
			setUsers();
			setEmptyResult(true);
			setLoading(false);
			console.log(error);
		}
	};
	useEffect(() => {
		const timeout = setTimeout(handleSearch, 500);

		return () => clearTimeout(timeout);
	}, [searchPhrase]);
	return (
		<View style={styles.screen}>
			<StatusBar style='light' backgroundColor={Colors.primary} />
			<Appbar.Header style={styles.header}>
				<Appbar.BackAction
					onPress={() => navigation.pop()}
					color={Colors.white}
				/>
				{searching ? (
					<TextInput
						style={styles.search}
						placeholder='Search'
						placeholderTextColor={Colors.greyScale700}
						cursorColor={Colors.greyScale700}
						autoCapitalize='none'
						autoComplete='name'
						autoCorrect
						autoFocus
						value={searchPhrase}
						onChangeText={(text) => setSearchPhrase(text)}
					/>
				) : (
					<Appbar.Content title='New Message' color={Colors.white} />
				)}

				{searching ? (
					<Appbar.Action
						icon='close'
						onPress={() => setSearchPhrase('')}
						color={Colors.white}
					/>
				) : (
					<Appbar.Action
						icon='magnify'
						onPress={() => setSearching((prev) => !prev)}
						color={Colors.white}
					/>
				)}
			</Appbar.Header>
			{!searchPhrase && (
				<Appbar.Header style={styles.secondHeader}>
					<Appbar.Action
						icon='account-multiple'
						onPress={() => setSearchPhrase('')}
						color={Colors.white}
						size={30}
					/>
					<Appbar.Content title='New Group' color={Colors.white} />
				</Appbar.Header>
			)}
			{loading && (
				<View style={{ flex: 1 }}>
					<ActivityIndicator size='large' color={Colors.primary} />
				</View>
			)}

			{!loading && users?.length > 0 && (
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
			)}

			{emptyResult && !loading && (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<FontAwesome
						name='question'
						size={55}
						color={Colors.disabled}
						style={styles.noResultIcon}
					/>
					<Text style={styles.noResultText}>No users found!</Text>
				</View>
			)}
		</View>
	);
};

export default NewChatScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	header: {
		backgroundColor: Colors.primary,
	},
	secondHeader: {
		backgroundColor: Colors.primary200,
	},
	search: {
		flex: 1,
		borderWidth: 0,
		backgroundColor: 'transparent',
		color: Colors.white,
		fontFamily: 'REGULAR',
		fontSize: 16,
		letterSpacing: 0.5,
	},
	searchContainer: {
		flexDirection: 'row',
		backgroundColor: Colors.disabled,
		alignItems: 'center',
		height: 30,
		marginVertical: 8,
		paddingHorizontal: 8,
		gap: 10,
		borderRadius: 5,
	},
	searchBox: {
		flex: 1,

		fontSize: 15,
		width: '100%',
	},
	noResultIcon: {
		marginBottom: 20,
	},
	noResultText: {
		color: Colors.disabled,
		fontFamily: 'REGULAR',
		fontSize: 20,
	},
});
