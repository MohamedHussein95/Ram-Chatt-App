import {
	Image,
	StyleSheet,
	Text,
	TextInput,
	View,
	ScrollView,
	ImageBackground,
} from 'react-native';
import React, { useState } from 'react';
import { Appbar, FAB, useTheme, Button } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import { pickImageAsync } from '../utils/ImagePicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreatePostMutation } from '../store/postApiSlice';
import { useSelector } from 'react-redux';

const BOTTOM_APPBAR_HEIGHT = 50;

const CreatePostScreen = ({ navigation }) => {
	const [title, setTitle] = useState('');
	const [bodyText, setBodyText] = useState('');
	const [url, setUrl] = useState('');
	const [photo, setPhoto] = useState();
	const { userInfo } = useSelector((state) => state.auth);
	const { bottom } = useSafeAreaInsets();
	const [loading, setLoading] = useState(false);

	const [createPost] = useCreatePostMutation();

	const createAPost = async () => {
		try {
			setLoading(true);
			setTitle('');
			setBodyText('');
			setUrl('');
			const data = {
				createdBy: userInfo?._id,
				title: title,
				body: {
					text: bodyText,
				},
			};
			const res = await createPost(data);
			console.log(res);
		} catch (error) {
			setLoading(false);
			console.log(error);
		}
	};

	const handleImageUpload = async () => {
		try {
			const image = await pickImageAsync();
			if (!image) return;

			//set image
			setPhoto(image);
			console.log(image);
		} catch (error) {
			setIsLoading(false);
			console.log(error);
		}
	};
	return (
		<View style={styles.screen}>
			<Appbar.Header style={styles.header}>
				<Appbar.Action
					icon='close'
					onPress={() => navigation.navigate('HomeScreen')}
					color={Colors.white}
					size={35}
				/>
				<Button
					mode='outlined'
					style={{
						backgroundColor:
							title.length <= 0 ? Colors.greyScale700 : '#00BCFF',
					}}
					textColor={Colors.white}
					disabled={title.length <= 0}
					onPress={createAPost}
				>
					Post
				</Button>
			</Appbar.Header>
			<ScrollView style={{ flex: 1, paddingBottom: 100 }}>
				<View style={styles.body}>
					<View>
						<TextInput
							style={styles.search}
							placeholder='Title'
							placeholderTextColor={Colors.greyScale700}
							cursorColor={Colors.greyScale700}
							autoCapitalize='words'
							autoComplete='name'
							autoCorrect
							autoFocus
							multiline={true}
							onChangeText={(text) => setTitle(text)}
							value={title}
						/>
						<TextInput
							style={styles.link}
							placeholder='URL'
							placeholderTextColor={Colors.greyScale700}
							cursorColor={Colors.greyScale700}
							autoCapitalize='none'
							autoCorrect
							multiline={true}
							onChangeText={(text) => setUrl(text)}
							value={url}
							keyboardType='url'
						/>
						{photo && (
							<ImageBackground
								source={{ uri: photo }}
								style={styles.photo}
							>
								<MaterialCommunityIcons
									name='close'
									size={30}
									color={Colors.white}
									style={{
										position: 'absolute',
										top: 5,
										right: 5,
										borderRadius: 33,
										backgroundColor: Colors.greyScale600,
									}}
									onPress={() => setPhoto(null)}
								/>
							</ImageBackground>
						)}
						<View style={{ flex: 1 }}>
							<TextInput
								style={styles.searchBody}
								placeholder='body text(optional)'
								placeholderTextColor={Colors.greyScale700}
								cursorColor={Colors.greyScale700}
								autoCapitalize='none'
								autoComplete='name'
								autoCorrect
								multiline
								onChangeText={(text) => setBodyText(text)}
								value={bodyText}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
			<View>
				<Appbar
					style={[
						styles.bottom,
						{
							height: BOTTOM_APPBAR_HEIGHT + bottom,
						},
					]}
					safeAreaInsets={{ bottom }}
				>
					<Appbar.Action
						icon='link'
						onPress={() => {}}
						color={Colors.white}
						size={30}
					/>
					<Appbar.Action
						icon='image-area'
						onPress={handleImageUpload}
						color={Colors.white}
						size={30}
					/>
					<Appbar.Action
						icon='motion-play'
						onPress={() => {}}
						color={Colors.white}
						size={30}
					/>
					<Appbar.Action
						icon='format-list-numbered'
						onPress={() => {}}
						color={Colors.white}
						size={30}
					/>
				</Appbar>
			</View>
		</View>
	);
};

export default CreatePostScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	header: {
		backgroundColor: Colors.primary,
		justifyContent: 'space-between',
		marginRight: 10,
	},
	search: {
		borderWidth: 0,
		backgroundColor: 'transparent',
		padding: 15,
		color: Colors.primary,
		fontFamily: 'BOLD',
		fontSize: 24,
		letterSpacing: 0.5,
		marginTop: 20,
		marginLeft: 15,
		marginRight: 15,
		height: 'auto',
	},
	searchBody: {
		borderWidth: 0,
		padding: 15,
		paddingBottom: 30,
		backgroundColor: 'transparent',
		color: Colors.primary,
		fontFamily: 'MEDIUM',
		fontSize: 16,
		letterSpacing: 0.3,
		marginLeft: 15,
		height: 'auto',
		marginBottom: BOTTOM_APPBAR_HEIGHT - 10,
	},
	body: {
		flex: 1,
	},
	bottom: {
		backgroundColor: Colors.primary600,
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
	},
	photo: {
		width: '100%',
		height: 300,
	},
	link: {
		color: 'blue',
		textDecorationLine: 'underline',
		borderWidth: 0,
		padding: 15,
		backgroundColor: 'transparent',
		marginLeft: 15,
		height: 'auto',
	},
});
