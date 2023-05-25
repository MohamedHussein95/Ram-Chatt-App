import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export const pickImageAsync = async () => {
	await checkMediaPermission();
	let result = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.Images, //filter to only images
		allowsEditing: true,
		aspect: [1, 1], //images should be square
		quality: 1,
		base64: true,
	});

	if (!result.canceled) {
		//console.log(result.assets[0].uri);
		return result.assets[0].uri;
	} else {
		alert('You did not select any image.');
	}
};

export const checkMediaPermission = async () => {
	if (Platform.OS !== 'web') {
		const permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			return Promise.reject('We need permission to access your photos');
		}
	}
	return Promise.resolve();
};
