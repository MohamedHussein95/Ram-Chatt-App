import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import { useSelector } from 'react-redux';
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import socket from '../utils/socket';

const Bubble = ({ item, text }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const [message, setMessage] = useState(item);
	const type =
		userInfo._id === message.user._id ? 'myMessage' : 'theirMessage';
	const date = new Date(message.createdAt);
	const sentTime = moment(date).format('HH:mm');

	const bubbleStyle = { ...styles.bubble };
	const textStyle = { ...styles.message };
	const messageStyle = { ...styles.messageContainer };
	const timeContainergeStyle = { ...styles.timeContainer };

	switch (type) {
		case 'system':
			textStyle.color = '#65644A';
			bubbleStyle.backgroundColor = Colors.beige;
			bubbleStyle.alignItems = 'center';
			bubbleStyle.marginTop = 10;
			break;
		case 'error':
			bubbleStyle.backgroundColor = Colors.error;
			textStyle.color = 'white';
			bubbleStyle.marginTop = 10;
			break;
		case 'myMessage':
			bubbleStyle.flexDirection = 'row-reverse';
			messageStyle.alignItems = 'flex-end';
			messageStyle.backgroundColor = Colors.primary600;
			break;
		case 'theirMessage':
			break;

		default:
			break;
	}
	//listen for message updates
	useEffect(() => {
		socket.on('message-viewed', async (id, uid) => {
			if (id === message._id && uid !== userInfo?._id) {
				setMessage({ ...message, seen: true });
			}
		});

		return () => {
			socket.off('message-viewed');
		};
	}, [socket]);
	return (
		<View style={{ ...styles.bubble, ...bubbleStyle }}>
			<View style={styles.avatarContainer}>
				<Avatar.Image source={{ uri: message.user.avatar }} size={25} />
			</View>
			<TouchableOpacity
				style={{ ...styles.messageContainer, ...messageStyle }}
				activeOpacity={0.8}
			>
				<View>
					<View style={styles.textContainer}>
						<Text style={styles.message}>{message.text}</Text>
						{userInfo._id === message.user._id && (
							<>
								{message.seen && message.delivered && (
									<MaterialCommunityIcons
										name='check-all'
										color={Colors.success}
									/>
								)}
								{!message.seen && message.delivered && (
									<MaterialCommunityIcons
										name='check-all'
										color={Colors.greyScale300}
									/>
								)}
								{!message.delivered && (
									<MaterialCommunityIcons
										name='check'
										color={Colors.greyScale300}
									/>
								)}
							</>
						)}
					</View>
					<View style={styles.timeContainer}>
						<Text style={styles.time}>~{message.user.name}</Text>
						<Text style={styles.time}>{sentTime}</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	bubble: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: 5,
		marginVertical: 5,
		marginHorizontal: 10,
	},
	messageContainer: {
		backgroundColor: Colors.greyScale800,
		padding: 5,
		justifyContent: 'center',
		alignItems: 'flex-start',
		borderRadius: 10,
		maxWidth: '70%',
	},
	message: {
		color: Colors.white,
		fontFamily: 'MEDIUM',
		paddingHorizontal: 4,
	},
	textContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},

	timeContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 4,
		gap: 10,
	},
	time: {
		color: Colors.greyScale400,
		fontFamily: 'REGULAR',
		fontSize: 12,
	},
});

export default memo(Bubble);
