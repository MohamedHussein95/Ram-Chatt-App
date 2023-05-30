import {
	AntDesign,
	Ionicons,
	MaterialCommunityIcons,
} from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '../constants/Colors';
import ChatListScreen from '../screens/ChatListScreen';
import ChatScreen from '../screens/ChatScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import NewChatScreen from '../screens/NewChatScreen';
import PostDetailsScreen from '../screens/PostDetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import { updatePushToken } from '../store/authSlice';
import { useRegisterForPushTokenMutation } from '../store/userApiSlice';
import socket from '../utils/socket';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabStack = ({ navigation, route }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const [postCount, setPostCount] = useState(0);
	const currentTab = getFocusedRouteNameFromRoute(route);
	useEffect(() => {
		socket.on('posted', async () => {
			if (currentTab !== 'HomeScreen') {
				setPostCount((prevCount) => prevCount + 1);
			}
		});

		return () => {
			socket.off('posted');
		};
	}, [socket, currentTab]);
	useEffect(() => {
		if (currentTab === 'HomeScreen') {
			setPostCount(0);
		}
	}, [navigation, currentTab]);
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
						iconName = focused ? 'compass' : 'compass-outline';
						return (
							<MaterialCommunityIcons
								name={iconName}
								size={size}
								color={color}
							/>
						);
					} else if (route.name === 'CreatePostScreen') {
						iconName = focused ? 'pluscircle' : 'pluscircleo';
						return (
							<AntDesign name={iconName} size={size} color={color} />
						);
					}
				},
				tabBarActiveTintColor: Colors.white,
				tabBarInactiveTintColor: Colors.greyScale600,
				headerShown: false,
				tabBarStyle: {
					paddingVertical: 5,
					height: Platform.OS === 'ios' ? 100 : 60,
					backgroundColor: Colors.primary,
				},
				tabBarItemStyle: {
					marginBottom: 5,
				},
				tabBarLabelStyle: {},
				tabBarHideOnKeyboard: true,
			})}
		>
			<Tab.Screen
				name='HomeScreen'
				component={HomeScreen}
				options={({ route }) => ({
					tabBarLabel: 'Home',
					tabBarBadgeStyle: {
						backgroundColor: Colors.red,
						color: Colors.white,
					},
					tabBarBadge: postCount > 0 ? String(postCount) : null,
				})}
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

const TopTab = createMaterialTopTabNavigator();
const ChatStack = () => {
	return (
		<TopTab.Navigator>
			<TopTab.Screen name='ChatListScreen' component={ChatListScreen} />
		</TopTab.Navigator>
	);
};

function MainStack() {
	const { userInfo } = useSelector((state) => state.auth);
	const [expoPushToken, setExpoPushToken] = useState('');
	const [notification, setNotification] = useState(false);
	const notificationListener = useRef();
	const responseListener = useRef();
	const dispatch = useDispatch();
	useEffect(() => {
		registerForPushNotificationsAsync().then((token) =>
			setExpoPushToken(token)
		);

		notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				setNotification(notification);
			});

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(response) => {}
			);

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);
	const [registerForPushToken] = useRegisterForPushTokenMutation();
	useEffect(() => {
		const registerPushToken = async () => {
			try {
				if (expoPushToken) {
					const tokenData = {
						token: expoPushToken,
					};
					const id = userInfo?._id;
					const res = await registerForPushToken({
						id,
						tokenData,
					}).unwrap();
					dispatch(updatePushToken(res));
				}
			} catch (error) {
				console.log(error);
			}
		};
		registerPushToken();
	}, [expoPushToken]);

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
			<Stack.Screen name='PostDetailsScreen' component={PostDetailsScreen} />
		</Stack.Navigator>
	);
}

export default MainStack;

async function registerForPushNotificationsAsync() {
	let token;
	if (Device.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		//console.log('Must use physical device for Push Notifications');
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: Colors.primary,
		});
	}

	return token;
}
