import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import {
	ActivityIndicator,
	Button,
	TextInput,
	useTheme,
} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '../store/userApiSlice';
import { setCredentials } from '../store/authSlice';
import Toast from 'react-native-toast-message';
const RegisterScreen = ({ navigation }) => {
	const theme = useTheme();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const dispatch = useDispatch();
	const [register, loading, error] = useRegisterMutation();

	const submitHandler = async () => {
		console.log(firstName, lastName, email, password);
		try {
			const data = await register({
				firstName,
				lastName,
				email,
				password,
			}).unwrap();

			dispatch(setCredentials({ user: { ...data } }));
			Toast.show({
				type: 'success',
				text1: 'Successfully Registered!',
				text2: `Welcome ${data.fullName},you can start chatting now`,
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
				placeholder='First Name'
				value={firstName}
				onChangeText={(text) => setFirstName(text)}
				style={styles.input}
			/>
			<TextInput
				placeholder='Last Name'
				value={lastName}
				onChangeText={(text) => setLastName(text)}
				style={styles.input}
			/>
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
					Sign Up
				</Button>
			)}

			<Text
				style={{ marginVertical: 15 }}
				onPress={() => navigation.navigate('SignInScreen')}
			>
				Have an account already?
				<Text style={{ color: 'red' }}>Sign In</Text>
			</Text>
		</View>
	);
};

export default RegisterScreen;

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
