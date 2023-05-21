import Toast from 'react-native-toast-message';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';
import AppNavigation from './navigation/AppNavigation';
import store from './store/store';
import theme from './theme';

export default function App() {
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
