import 'dotenv/config';
export default {
	expo: {
		name: 'Ram Chatt',
		slug: 'ram-chatt',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/icon.png',
		userInterfaceStyle: 'light',
		splash: {
			image: './assets/splash.png',
			resizeMode: 'cover',
			backgroundColor: '#181A20',
		},
		updates: {
			fallbackToCacheTimeout: 0,
			url: '',
		},
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: true,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			permissions: [
				'INTERNET',
				'ACCESS_NETWORK_STATE',
				'VIBRATE',
				'CAMERA',
				'ACCESS_FINE_LOCATION',
				'READ_EXTERNAL_STORAGE',
				'WRITE_EXTERNAL_STORAGE',
			],
			package: 'com.legendman.ramchatt',
		},
		web: {
			favicon: './assets/favicon.png',
		},
		plugins: [
			[
				'expo-notifications',
				{
					color: '#ffffff',
				},
			],
		],
		extra: {
			eas: {
				projectId: 'e0012066-7a46-429c-8b6b-6da6df211e1b',
			},
			host: process.env.HOST,
		},
	},
};