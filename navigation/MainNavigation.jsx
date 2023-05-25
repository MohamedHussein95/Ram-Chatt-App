import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import ChatScreen from '../screens/ChatScreen';
import NewChatScreen from '../screens/NewChatScreen';
import Colors from '../constants/Colors';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import ExploreScreen from '../screens/ExploreScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import { useSelector } from 'react-redux';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const notificationCount = userInfo?.notifications?.length || null;

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;

					if (route.name === 'HomeScreen') {
						iconName = focused ? 'home' : 'home-outline';
						return <Ionicons name={iconName} size={size} color={color} />;
					} else if (route.name === 'ChatListScreen') {
						iconName = focused
							? 'chatbubble-ellipses-sharp'
							: 'chatbubble-ellipses-outline';
						return <Ionicons name={iconName} size={size} color={color} />;
					} else if (route.name === 'ProfileScreen') {
						iconName = focused ? 'person' : 'person-outline';
						return <Ionicons name={iconName} size={size} color={color} />;
					} else if (route.name === 'ExploreScreen') {
						iconName = focused ? 'video-library' : 'video-library';
						return (
							<MaterialIcons name={iconName} size={size} color={color} />
						);
					} else if (route.name === 'CreatePostScreen') {
						iconName = focused ? 'pluscircle' : 'pluscircleo';
						return <AntDesign name={iconName} size={24} color={color} />;
					}
				},
				tabBarActiveTintColor: Colors.white,
				tabBarInactiveTintColor: Colors.greyScale500,
				headerShown: false,
				tabBarStyle: {
					paddingVertical: 5,
					height: Platform.OS === 'ios' ? 100 : 60,
					backgroundColor: Colors.primary,
				},
				tabBarItemStyle: {
					marginBottom: 5,
				},
				tabBarLabelStyle: {
					fontSize: 14,
					fontWeight: '500',
				},
				tabBarHideOnKeyboard: true,
			})}
		>
			<Tab.Screen
				name='HomeScreen'
				component={HomeScreen}
				options={{
					tabBarLabel: 'Home',
				}}
			/>
			<Tab.Screen
				name='ExploreScreen'
				component={ExploreScreen}
				options={{
					tabBarLabel: 'Explore',
				}}
			/>
			<Tab.Screen
				name='CreatePostScreen'
				component={CreatePostScreen}
				options={{
					tabBarLabel: 'Create',
				}}
			/>

			<Tab.Screen
				name='ChatListScreen'
				component={ChatListScreen}
				options={({ route }) => ({
					tabBarLabel: 'Chat',
					tabBarBadgeStyle: {
						backgroundColor: Colors.red,
						color: Colors.white,
						fontSize: 12,
						fontWeight: 'bold',
						minWidth: 20,
						height: 20,
						textAlign: 'center',
						paddingTop: 2,
					},
					tabBarBadge:
						route.state &&
						route.state.index === 0 &&
						notificationCount > 0
							? String(notificationCount)
							: null,
				})}
			/>

			<Tab.Screen
				name='ProfileScreen'
				component={ProfileScreen}
				options={{
					tabBarLabel: 'Profile',
				}}
			/>
		</Tab.Navigator>
	);
};

function MainStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}
			initialRouteName='TabStack'
		>
			<Stack.Screen name='TabStack' component={TabStack} />
			<Stack.Screen name='ChatScreen' component={ChatScreen} />
			<Stack.Screen name='NewChatScreen' component={NewChatScreen} />
			<Stack.Screen name='UserDetailsScreen' component={UserDetailsScreen} />
		</Stack.Navigator>
	);
}

export default MainStack;
