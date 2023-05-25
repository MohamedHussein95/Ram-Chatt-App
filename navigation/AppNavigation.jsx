import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AuthNavigator from './AuthNavigation';
import MainNavigator from './MainNavigation';
import { useSelector } from 'react-redux';
import StartUpScreen from '../StartUpScreen';

const AppNavigator = ({ onReady }) => {
	const isAuth = useSelector((state) => state.auth.isAuth);
	const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

	return (
		<NavigationContainer onReady={onReady}>
			{didTryAutoLogin && isAuth && <MainNavigator />}
			{!didTryAutoLogin && !isAuth && <StartUpScreen />}
			{didTryAutoLogin && !isAuth && <AuthNavigator />}
		</NavigationContainer>
	);
};

export default AppNavigator;
