import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from '../screens/RegisterScreen';
import SignInScreen from '../screens/SignInScreen';

const Stack = createNativeStackNavigator();

function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name='RegisterScreen' component={RegisterScreen} />
			<Stack.Screen name='SignInScreen' component={SignInScreen} />
		</Stack.Navigator>
	);
}

export default AuthStack;
