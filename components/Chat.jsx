import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Badge } from 'react-native-paper';
import Colors from '../constants/Colors';
import { useGetChatLastMessageMutation } from '../store/chatApiSlice';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import socket from '../utils/socket';
import { useSelector } from 'react-redux';

const Chat = ({ chatId, status, lastMessage, sender }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const date = new Date(lastMessage?.createdAt);
	const sentTime = chatId ? moment(date).format('HH:mm') : '';

	const [getChatLastMessage] = useGetChatLastMessageMutation();

	const [newMessageCount, setNewMessageCount] = useState(0);
	const [lastMessageData, setLastMessageData] = useState(
		lastMessage?.content?.encryptedData
	);

	const navigation = useNavigation();

	const chatStyle = {
		padding: chatId ? 10 : 5,
		margin: 0,
		marginVertical: chatId ? 0.5 : 0.5,
		backgroundColor: status ? Colors.error : Colors.dark1,
	};

	const getLastMessage = useCallback(async () => {
		try {
			if (chatId) {
				const res = await getChatLastMessage(chatId).unwrap();
				setLastMessageData(res);
			}
		} catch (error) {
			console.log(error);
			Toast.show({
				type: 'error',
				text2: `${error?.data?.message || error.error}`,
				position: 'bottom',
			});
		}
	}, [chatId, getChatLastMessage]);
	useEffect(() => {
		socket.on('new-message', async (uid, cid, message) => {
			if (cid === chatId) {
				getLastMessage();
			}
			if (uid.toString() === userInfo?._id.toString() && cid === chatId) {
				setNewMessageCount((prev) => prev + 1);
			}
		});
		return () => {
			socket.off('new-message');
		};
	}, [socket]);
	useEffect(() => {
		getLastMessage();
	}, []);
	return (
		<TouchableOpacity
			style={{ ...styles.chat, ...chatStyle }}
			activeOpacity={0.8}
			onPress={() => {
				setNewMessageCount(0);
				navigation.navigate('ChatScreen', { sender, chatId });
			}}
		>
			{chatId ? (
				<View style={styles.wrapper}>
					<View style={styles.avatarcontainer}>
						<Avatar.Image size={60} source={{ uri: sender?.avatar }} />
					</View>
					<View style={styles.header}>
						<Text style={styles.title}>{sender?.fullName}</Text>
						<View style={styles.messageContainer}>
							<Text
								numberOfLines={1}
								ellipsizeMode='tail'
								style={styles.message}
							>
								{lastMessageData}
							</Text>
						</View>
					</View>
					<View style={styles.timeContainer}>
						<Text style={styles.time}>{sentTime || ''}</Text>
						{newMessageCount > 0 && (
							<Badge size={25}>{newMessageCount}</Badge>
						)}
					</View>
				</View>
			) : (
				<View
					style={{
						...styles.wrapper,
						...{
							elevation: 2,
						},
					}}
				>
					<View style={styles.avatarcontainer}>
						<Avatar.Image size={40} source={{ uri: sender?.avatar }} />
					</View>
					<View style={styles.header}>
						<Text style={{ ...styles.title, ...{ fontSize: 15 } }}>
							{sender?.fullName}
						</Text>
						<View style={styles.messageContainer}>
							<Text
								numberOfLines={1}
								ellipsizeMode='tail'
								style={{ ...styles.message, ...{ fontSize: 12 } }}
							>
								{sender?.lastSeen || 'last seen recently'}
							</Text>
						</View>
					</View>
				</View>
			)}
		</TouchableOpacity>
	);
};

export default memo(Chat);

const styles = StyleSheet.create({
	chat: {
		width: '100%',
		alignSelf: 'center',
		paddingHorizontal: 10,
	},
	avatarcontainer: {
		marginRight: 10,
	},
	header: {
		flex: 1,
		marginBottom: 10,
	},
	title: {
		fontSize: 18,
		color: Colors.white,
		fontFamily: 'MEDIUM',
	},
	messageContainer: {
		flex: 1,
	},
	message: {
		fontSize: 16,
		color: Colors.greyScale400,
		fontFamily: 'MEDIUM',
	},
	wrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	timeContainer: {},
	time: {
		fontSize: 15,
		color: Colors.white,
		fontFamily: 'LIGHT',
	},
});
