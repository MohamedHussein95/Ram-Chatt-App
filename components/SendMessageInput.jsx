import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import {
	useCreateChatMutation,
	useSendMessagesMutation,
} from '../store/chatApiSlice';
import { useSelector } from 'react-redux';

const SendMessageInput = ({ chatId, recipient, updateChatId }) => {
	const [messageText, setMessageText] = useState('');
	const [sendMessages] = useSendMessagesMutation();
	const { userInfo } = useSelector((state) => state.auth);
	const [cId, setCId] = useState(chatId);

	const [createChat] = useCreateChatMutation();
	const sendMessage = async () => {
		try {
			setMessageText('');
			const body = {
				sender: userInfo?._id,
				content: messageText,
			};
			if (cId) {
				await sendMessages({
					cId,
					body,
				}).unwrap();
			} else {
				//create the chat and update the cId
				const newBody = {
					users: [userInfo._id, recipient],
					messages: [body],
				};
				const res = await createChat(newBody).unwrap();

				setCId(res._id);
				updateChatId(res._id);
			}
		} catch (error) {
			console.log(error);
			Toast.show({
				type: 'error',
				text2: `${error?.data?.message || error.error}`,
				position: 'bottom',
			});
		}
	};

	return (
		<View>
			<TextInput
				right={<TextInput.Icon icon={'send'} onPress={sendMessage} />}
				value={messageText}
				onChangeText={(text) => setMessageText(text)}
			/>
		</View>
	);
};

export default SendMessageInput;

const styles = StyleSheet.create({});
