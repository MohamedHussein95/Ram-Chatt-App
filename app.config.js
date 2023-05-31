import 'dotenv/config';

export default {
	expo: {
		name: 'Ram Chatt',
		slug: 'ram-chatt',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/logo.png',
		userInterfaceStyle: 'light',
		splash: {
			image: './assets/splashScreen.png',
			resizeMode: 'cover',
			backgroundColor: '#181A20',
		},
		updates: {
			fallbackToCacheTimeout: 0,
			url: process.env.UPDATE_URL,
		},
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: true,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/adaptive-logo.png',
				backgroundColor: '#181A20',
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
					color: '#181A20',
				},
			],
			[
				'expo-updates',
				{
					username: 'legendman',
				},
			],
		],
		extra: {
			eas: {
				projectId: process.env.PROJECT_ID,
			},
			backendHost: process.env.BACKEND_HOST,
		},
	},
};
