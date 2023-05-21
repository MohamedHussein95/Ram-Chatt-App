import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import NewChatScreen from '../screens/NewChatScreen';

const Stack = createNativeStackNavigator();

function MainStack() {
	return (
		<Stack.Navigator>
			<Stack.Screen name='HomeScreen' component={HomeScreen} />
			<Stack.Screen name='ChatScreen' component={ChatScreen} />
			<Stack.Screen
				name='NewChatScreen'
				component={NewChatScreen}
				options={{ headerShown: false }}
			/>
		</Stack.Navigator>
	);
}

export default MainStack;
