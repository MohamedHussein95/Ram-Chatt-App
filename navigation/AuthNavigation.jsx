import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name='SignUpScreen' component={SignUpScreen} />
			<Stack.Screen name='SignInScreen' component={SignInScreen} />
		</Stack.Navigator>
	);
}

export default AuthStack;
