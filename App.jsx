import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import fonts from './constants/Fonts';
import AppNavigation from './navigation/AppNavigation';
import store from './store/store';

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
				<PaperProvider>
					<AppNavigation />
				</PaperProvider>
			</Provider>
			<Toast />
		</>
	);
}
