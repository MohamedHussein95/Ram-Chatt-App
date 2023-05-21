import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import { Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
const Chat = ({ chatId, status, lastMessage, sender }) => {
	const sentTime = chatId
		? moment(lastMessage?.createAt).format('HH:mm:ss')
		: '';
	const [newMessageCount, setNewMessageCount] = useState(0);

	const navigation = useNavigation();

	//console.log(chatId, status, lastMessage, sender);

	const chatStyle = {
		padding: chatId ? 10 : 5,
		margin: 0,
		marginVertical: chatId ? 15 : 3,
	};
	const headerStyle = {
		padding: 0,
		marginBottom: 0,
	};

	return (
		<TouchableOpacity
			style={{ ...styles.chat, ...chatStyle }}
			activeOpacity={0.8}
			onPress={() => navigation.navigate('ChatScreen', { sender, chatId })}
		>
			{chatId ? (
				<View>
					<View style={styles.header}>
						<Avatar.Image size={40} source={{ uri: sender?.avatar }} />
						<Text style={styles.title}>{sender?.fullName}</Text>
						<Text>{sentTime || ''}</Text>
					</View>
					<View style={styles.messageContainer}>
						<Text
							numberOfLines={1}
							ellipsizeMode='tail'
							style={styles.message}
						>
							{lastMessage?.content.encryptedData}
						</Text>
						{newMessageCount > 0 && (
							<Badge size={25}>{newMessageCount}</Badge>
						)}
					</View>
				</View>
			) : (
				<View>
					<View style={{ ...styles.header, ...headerStyle }}>
						<Avatar.Image size={40} source={{ uri: sender?.avatar }} />
						<Text style={styles.title}>{sender?.fullName}</Text>
						<Text>{sentTime || ''}</Text>
					</View>
				</View>
			)}
		</TouchableOpacity>
	);
};

export default Chat;

const styles = StyleSheet.create({
	chat: {
		backgroundColor: '#abcf',
		width: '95%',
		alignSelf: 'center',
		borderRadius: 10,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 15,
		marginBottom: 10,
	},
	title: {
		flex: 1,
		fontSize: 18,
		fontWeight: '300',
	},
	messageContainer: {
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
	},
	message: {
		flex: 1,
	},
});
