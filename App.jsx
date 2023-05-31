import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import fonts from './constants/Fonts';
import AppNavigation from './navigation/AppNavigation';
import store from './store/store';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export default function App() {
	const [fontsLoaded] = useFonts(fonts);

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}
	return (
		<>
			<Provider store={store}>
				<PaperProvider>
					<AppNavigation onReady={onLayoutRootView} />
				</PaperProvider>
			</Provider>
			<Toast />
		</>
	);
}
