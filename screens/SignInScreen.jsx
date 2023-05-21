import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { useLoginMutation } from '../store/userApiSlice';
const SignInScreen = ({ navigation }) => {
	const theme = useTheme();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();
	const [login, loading, error] = useLoginMutation();

	const submitHandler = async () => {
		try {
			const data = await login({
				email,
				password,
			}).unwrap();

			dispatch(setCredentials({ user: { ...data } }));
			Toast.show({
				type: 'success',
				text1: 'Signed In',
				text2: `Start Chatting `,
				position: 'bottom',
			});
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
		<View style={styles.screen}>
			<Text style={styles.title}>Ram Chatt</Text>

			<TextInput
				placeholder='Email'
				value={email}
				onChangeText={(text) => setEmail(text)}
				style={styles.input}
			/>
			<TextInput
				placeholder='Password'
				value={password}
				onChangeText={(text) => setPassword(text)}
				style={styles.input}
			/>

			{loading.status === 'loading' ? (
				<ActivityIndicator size={'small'} color='green' />
			) : (
				<Button mode='elevated' onPress={submitHandler}>
					Sign In
				</Button>
			)}

			<Text
				style={{ marginVertical: 15 }}
				onPress={() => navigation.navigate('RegisterScreen')}
			>
				Don't Have an account?
				<Text style={{ color: 'red' }}>Sign Up</Text>
			</Text>
		</View>
	);
};

export default SignInScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: 'center',
	},
	input: {
		width: '95%',
		marginVertical: 15,
	},
	title: {
		fontSize: 36,
		marginTop: 50,
	},
});
