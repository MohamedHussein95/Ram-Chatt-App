import { StyleSheet, TextInput, View } from 'react-native';
import React, { memo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const ChatInput = ({ onPress }) => {
	const [message, setMessage] = useState('');
	return (
		<View style={styles.container}>
			<TextInput
				value={message}
				onChangeText={setMessage}
				style={styles.input}
				placeholder='send a message'
				placeholderTextColor={Colors.white}
			/>
			{message.trim().length > 0 ? (
				<MaterialCommunityIcons
					name='send'
					size={25}
					color={Colors.white}
					onPress={() => {
						setMessage('');
						onPress(message);
					}}
				/>
			) : null}
		</View>
	);
};

export default memo(ChatInput);

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 50,
		backgroundColor: Colors.primary,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10,
	},
	input: {
		flex: 1,
		color: Colors.white,
		fontFamily: 'MEDIUM',
		fontSize: 15,
		paddingHorizontal: 5,
	},
});
