import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import AppNavigation from './navigation/AppNavigation';
import store from './store/store';
import theme from './theme';
import * as SplashScreen from 'expo-splash-screen';
import fonts from './constants/Fonts';
import { useCallback } from 'react';
import { useFonts } from 'expo-font';

export default function App() {
	const [fontsLoaded] = useFonts(fonts);

	if (fontsLoaded) {
		console.log('fonts loaded');
	}

	if (!fontsLoaded) {
		console.log('fonts not loaded');
	}
	return (
		<>
			<Provider store={store}>
				<PaperProvider theme={theme()}>
					<AppNavigation />
				</PaperProvider>
			</Provider>
			<Toast />
		</>
	);
}
