import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setCredentials, setDidTryAutoLogin } from './store/authSlice';
import { useGetUserInfoMutation } from './store/userApiSlice';
import Colors from './constants/Colors';

const StartUpScreen = () => {
	let userId = null;
	const dispatch = useDispatch();
	const [getUserData, errorInfo] = useGetUserInfoMutation();
	useEffect(() => {
		const getUserInfo = async () => {
			userId = await AsyncStorage.getItem('userId');

			if (!userId) {
				console.log('failed to retrieve user Id');
				dispatch(setDidTryAutoLogin());
				return;
			}
			try {
				//console.log(userId);
				const response = await getUserData(userId).unwrap();

				if (!response) {
					dispatch(setDidTryAutoLogin());
					throw new Error(errorInfo);
				} else {
					dispatch(setCredentials({ user: { ...response } }));
					dispatch(setDidTryAutoLogin());
				}
			} catch (error) {
				console.log(error);
				dispatch(setDidTryAutoLogin());
			}
		};
		getUserInfo();
	}, []);

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: Colors.primary,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View>
				<StatusBar hidden />
				<ActivityIndicator size={'small'} color={Colors.white} />
			</View>
		</View>
	);
};

export default StartUpScreen;
