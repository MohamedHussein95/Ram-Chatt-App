import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const Message = ({ item }) => {
	const { sender, content } = item;
	const { userInfo } = useSelector((state) => state.auth);
	const MessageStyle = { ...styles.container };
	const textStyle = { ...styles.text };
	const wrapperStyle = { ...styles.wrapperStyle };

	const type = sender === userInfo._id ? 'myMessage' : 'theirMessage';

	switch (type) {
		case 'system':
			textStyle.color = '#65644A';
			MessageStyle.backgroundColor = Colors.beige;
			MessageStyle.alignItems = 'center';
			MessageStyle.marginTop = 10;
			break;
		case 'error':
			MessageStyle.backgroundColor = Colors.RED;
			textStyle.color = 'white';
			MessageStyle.marginTop = 10;
			break;
		case 'myMessage':
			wrapperStyle.justifyContent = 'flex-end';
			MessageStyle.backgroundColor = '#E7FED6';
			MessageStyle.maxWidth = '90%';
			break;
		case 'theirMessage':
			wrapperStyle.justifyContent = 'flex-start';
			MessageStyle.maxWidth = '90%';
			break;

		default:
			break;
	}

	return (
		<View style={wrapperStyle}>
			<View style={MessageStyle}>
				<Text style={textStyle}>{content}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapperStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	container: {
		backgroundColor: 'white',
		borderRadius: 6,
		padding: 10,
		marginBottom: 10,
		borderColor: '#E2DACC',
		borderWidth: 1,
		margin: 10,
	},
	text: {
		letterSpacing: 0.3,
		fontSize: 16,
	},
});

export default Message;
