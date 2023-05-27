import {
	AntDesign,
	Feather,
	Ionicons,
	MaterialIcons,
} from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import {
	Appbar,
	Avatar,
	Button,
	Divider,
	Portal,
	Modal as Rmodal,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../components/Input';
import ProfileSetting from '../components/ProfileSetting';
import Colors from '../constants/Colors';
import { clearCredentials, updateUserBio } from '../store/authSlice';
import {
	useLogoutMutation,
	useUpdateBioMutation,
	useUploadProfileMutation,
} from '../store/userApiSlice';
import { pickImageAsync } from '../utils/ImagePicker';

const ProfileScreen = ({ navigation }) => {
	const { userInfo } = useSelector((state) => state.auth);
	const [visible, setVisible] = useState(false);
	const [bio, setBio] = useState(userInfo?.bio);
	const [sound, setSound] = useState();
	const [isSoundPlaying, setIsSoundPlaying] = useState(false);
	const dispatch = useDispatch();
	const shakeAnimaRef = useRef();
	const [updateBio] = useUpdateBioMutation();
	const [logOut] = useLogoutMutation();
	const [photo, setPhoto] = useState(userInfo?.avatar);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const handleNavigate = useCallback((navigateTo) => {
		navigation.navigate(navigateTo);
	});
	const [isModalVisible, setModalVisible] = useState(false);

	const handleBioUpdate = async () => {
		const body = { body: bio };
		const res = await updateBio({ id: userInfo?._id, body }).unwrap();
		dispatch(updateUserBio(res));
		setVisible(false);
	};

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};
	const handleLogOut = async () => {
		await logOut().unwrap();
		dispatch(clearCredentials());
	};
	async function playSound() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync({
			uri: userInfo?.introSong,
		});

		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();

		// Set the playback status update callback
		sound.setOnPlaybackStatusUpdate((status) => {
			if (status.didJustFinish) {
				// Replay the song
				sound.replayAsync();
			}
			setIsSoundPlaying(status.isPlaying);
		});

		// Get the initial playback status
		const initialStatus = await sound.getStatusAsync();
		setIsSoundPlaying(initialStatus.isPlaying);
	}
	const [uploadProfile] = useUploadProfileMutation();
	const handleProfileUpload = async () => {
		try {
			const image = await pickImageAsync();
			if (!image) return;

			//set image
			setPhoto(image);

			const res = await uploadProfile({
				id: userInfo?._id,
				file: image,
			}).unwrap();

			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		if (isSoundPlaying) {
			// If sound is currently playing, play the animation
			shakeAnimaRef.current?.pulse(800);
			console.log('Sound is playing');
		}

		return sound
			? () => {
					console.log('Unloading Sound');
					sound.unloadAsync();
					setIsSoundPlaying(false);
			  }
			: undefined;
	}, [sound, isSoundPlaying]);

	return (
		<View style={styles.screen}>
			<StatusBar style='light' backgroundColor={Colors.primary} />
			<ScrollView style={{ flex: 1 }}>
				<View style={styles.headerContainer}>
					<Appbar.Header style={styles.headerContainer}>
						<Appbar.Content
							title={userInfo?.userName}
							style={styles.userName}
							color={Colors.white}
						/>
						<Appbar.Action
							icon='menu'
							onPress={toggleModal}
							color={Colors.white}
						/>
					</Appbar.Header>
					<Modal
						onBackdropPress={() => setModalVisible(false)}
						onBackButtonPress={() => setModalVisible(false)}
						isVisible={isModalVisible}
						onSwipeComplete={toggleModal}
						style={styles.modal}
					>
						<View style={styles.modalContainer}>
							<ScrollView>
								<ProfileSetting
									title={'Edit Profile'}
									icon={'user'}
									IconPack={Feather}
									onPress={() => handleNavigate('EditProfileScreen')}
									color={Colors.white}
								/>

								<ProfileSetting
									title={'Security'}
									icon={'security'}
									IconPack={MaterialIcons}
									onPress={() => handleNavigate('SecurityScreen')}
									color={Colors.white}
								/>

								<ProfileSetting
									title={'Privacy Policy'}
									icon={'lock'}
									IconPack={Feather}
									color={Colors.white}
								/>
								<ProfileSetting
									title={'Help Center'}
									icon={'help-outline'}
									IconPack={Ionicons}
									color={Colors.white}
								/>
								<ProfileSetting
									title={'Invite Friends'}
									icon={'people-outline'}
									IconPack={Ionicons}
									color={Colors.white}
								/>
								<TouchableOpacity
									style={styles.iconContainer}
									activeOpacity={0.8}
									onPress={handleLogOut}
								>
									<MaterialIcons
										name='logout'
										size={25}
										color={Colors.error}
									/>
									<Text
										style={{
											...styles.title,
											...{
												fontSize: 18,
												color: Colors.error,
												fontFamily: 'BOLD',
												letterSpacing: 1.5,
											},
										}}
									>
										LogOut
									</Text>
								</TouchableOpacity>
							</ScrollView>
						</View>
					</Modal>
				</View>
				<View style={styles.profileHeaderContainer}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={handleProfileUpload}
					>
						<Avatar.Image source={{ uri: photo }} size={120} />
					</TouchableOpacity>
					<Text style={styles.title}>{userInfo?.fullName}</Text>
					<Text style={styles.content}>{userInfo?.email}</Text>
					<View style={styles.profileDataContainer}>
						<View style={styles.profileData}>
							<Text
								style={{
									...styles.profileDataText,
									fontFamily: 'BOLD',
									fontSize: 24,
								}}
							>
								{userInfo?.profileData?.posts?.length}
							</Text>
							<Text style={styles.profileDataText}>Posts</Text>
						</View>
						<View style={styles.profileData}>
							<Text
								style={{
									...styles.profileDataText,
									fontFamily: 'BOLD',
									fontSize: 24,
								}}
							>
								{userInfo?.profileData?.followers?.length}
							</Text>
							<Text style={styles.profileDataText}>Followers</Text>
						</View>
						<View style={styles.profileData}>
							<Text
								style={{
									...styles.profileDataText,
									fontFamily: 'BOLD',
									fontSize: 24,
								}}
							>
								{userInfo?.profileData?.following?.length}
							</Text>
							<Text style={styles.profileDataText}>Follwing</Text>
						</View>
					</View>

					{sound || isSoundPlaying ? (
						<Animatable.View ref={shakeAnimaRef}>
							<TouchableOpacity>
								<AntDesign
									name='playcircleo'
									size={24}
									color='green'
									style={{ marginTop: 15 }}
									onPress={playSound}
								/>
							</TouchableOpacity>
						</Animatable.View>
					) : (
						<View
							style={{
								marginTop: 15,
								backgroundColor: Colors.primary,
								padding: 10,
								borderRadius: 100,
							}}
						>
							<AntDesign
								name='playcircleo'
								size={30}
								color={Colors.white}
								onPress={playSound}
							/>
						</View>
					)}

					<TouchableOpacity onPress={showModal}>
						<Text style={styles.bio}>{userInfo?.bio || 'no bio'}</Text>
						<Portal>
							<Rmodal
								visible={visible}
								onDismiss={hideModal}
								contentContainerStyle={styles.containerStyle}
							>
								<View
									style={{
										width: '100%',
										backgroundColor: 'white',
										height: 50,
										position: 'absolute',
										top: 0,
										alignSelf: 'center',
										justifyContent: 'center',
									}}
								>
									<Text style={styles.bio}>Bio</Text>
								</View>

								<Input
									multiline={true}
									placeholder='Your bio'
									style={styles.input}
									onChangeText={(text) => setBio(text)}
									value={bio}
									containerStyle={{
										borderRadius: 0,
									}}
									inputContainerStyle={{
										height: 40,
										borderRadius: 3,
									}}
								/>
								<Button
									mode='contained'
									style={styles.button}
									onPress={handleBioUpdate}
								>
									Update
								</Button>
							</Rmodal>
						</Portal>
					</TouchableOpacity>
				</View>
				<Divider />
			</ScrollView>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.dark2,
	},
	headerContainer: {
		backgroundColor: Colors.primary,
	},
	title: {
		fontSize: 22,
		color: Colors.primary,
		marginTop: 10,
		fontFamily: 'MEDIUM',
	},
	userName: {
		fontSize: 17,
		fontFamily: 'MEDIUM',
		letterSpacing: 0.5,
	},
	content: {
		fontSize: 17,
		color: Colors.primary100,
		marginVertical: 5,
		fontFamily: 'REGULAR',
	},
	profileDataContainer: {
		width: '70%',
		marginTop: 5,
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 35,
		marginVertical: 5,
	},
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		gap: 15,
		alignItems: 'center',
		marginVertical: 15,
		marginHorizontal: 15,
	},
	profileData: { alignItems: 'center' },
	profileDataText: {
		fontSize: 18,
		color: Colors.primary,
		textAlign: 'center',
		fontFamily: 'REGULAR',
	},
	profileHeaderContainer: {
		alignItems: 'center',
		marginVertical: 11,
		justifyContent: 'center',
		paddingVertical: 11,
		//backgroundColor: 'red',
	},
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	bio: {
		fontSize: 16,
		fontWeight: '300',
		textAlign: 'center',
		marginTop: 10,
		padding: 10,
		fontFamily: 'REGULAR',
		color: Colors.primary,
	},
	modalContainer: {
		backgroundColor: Colors.primary,
		height: '50%',
		paddingVertical: 15,
		paddingHorizontal: 15,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	containerStyle: {
		backgroundColor: Colors.primary,
		overflow: 'hidden',
		width: '80%',
		alignSelf: 'center',
		borderRadius: 10,
		height: '40%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		marginVertical: 25,
	},
	button: {
		width: '90%',
		borderRadius: 3,
		alignSelf: 'center',
		marginTop: 10,
		backgroundColor: Colors.primary500,
		position: 'absolute',
		bottom: 10,
	},

	buttonContainer: {
		paddingTop: 20,
	},
});
