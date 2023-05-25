import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
	Appbar,
	Avatar,
	Button,
	Divider,
	Portal,
	Modal as Rmodal,
	TextInput,
} from 'react-native-paper';
import {
	AntDesign,
	Entypo,
	Feather,
	FontAwesome,
	Ionicons,
	MaterialCommunityIcons,
	MaterialIcons,
	Octicons,
} from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { Audio } from 'expo-av';
import ProfileSetting from '../components/ProfileSetting';
import Colors from '../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import {
	useFollowUserMutation,
	useGetOtherUserProfileMutation,
} from '../store/userApiSlice';
import { updateFollowing } from '../store/authSlice';

const UserDetailsScreen = ({ navigation, route }) => {
	const [sender, setSender] = useState(route.params.sender);
	const { userInfo } = useSelector((state) => state.auth);
	const [sound, setSound] = useState(null);
	const [visible, setVisible] = useState(false);
	const [bio, setBio] = useState('');
	const [isModalVisible, setModalVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const [followed, setFollowed] = useState(
		userInfo?.profileData?.following?.includes(route.params?.sender)
	);
	const dispatch = useDispatch();
	const [getOtherUser] = useGetOtherUserProfileMutation();
	const [follow] = useFollowUserMutation();

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};
	async function playSound() {
		console.log('Loading Sound');
		const { sound } = await Audio.Sound.createAsync({
			uri: sender?.introSong,
		});
		setSound(sound);

		console.log('Playing Sound');
		await sound.playAsync();

		sound.setOnPlaybackStatusUpdate((status) => {
			if (status.didJustFinish) {
				// Replay the song
				sound.replayAsync();
			}
		});
	}

	useEffect(() => {
		return sound
			? () => {
					console.log('Unloading Sound');
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	const getUser = async () => {
		try {
			const res = await getOtherUser(sender?._id).unwrap();
			setSender(res);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getUser();
	}, [followed]);

	const handleBlockUser = () => {};
	const handleReportUser = () => {};

	const followUser = async () => {
		const body = {
			currentId: userInfo?._id,
		};
		try {
			await follow({
				id: sender?._id,
				body,
			});
			dispatch(updateFollowing(sender?._id));
			setFollowed((prev) => !prev);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={styles.screen}>
			<ScrollView style={{ flex: 1 }}>
				<Appbar.Header style={styles.headerContainer}>
					<Appbar.BackAction
						onPress={() => navigation.pop()}
						color={Colors.white}
					/>
					<Appbar.Content
						title={sender?.userName}
						style={styles.userName}
						color={Colors.white}
					/>
					<Appbar.Action
						icon='menu'
						onPress={toggleModal}
						color={Colors.white}
					/>
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
									title={'Report...'}
									icon={'report'}
									IconPack={Octicons}
									onPress={() => handleNavigate('EditProfileScreen')}
									color={Colors.white}
								/>

								<ProfileSetting
									title={'Block'}
									icon={'block'}
									IconPack={Entypo}
									onPress={() => handleNavigate('SecurityScreen')}
									color={Colors.white}
								/>

								<ProfileSetting
									title={'Show QR code'}
									icon={'qr-code-outline'}
									IconPack={Ionicons}
									color={Colors.white}
								/>
								<ProfileSetting
									title={'Share this profile'}
									icon={'share'}
									IconPack={Entypo}
									color={Colors.white}
								/>
								<ProfileSetting
									title={'About this Account'}
									icon={'account-cowboy-hat-outline'}
									IconPack={MaterialCommunityIcons}
									color={Colors.white}
								/>
							</ScrollView>
						</View>
					</Modal>
				</Appbar.Header>

				<View style={styles.profileHeaderContainer}>
					<View style={styles.avatarContainer}>
						<Avatar.Image source={{ uri: sender?.avatar }} size={80} />
						<View style={styles.profileDataContainer}>
							<View style={styles.profileData}>
								<Text
									style={{
										...styles.profileDataText,
										...{ fontSize: 24, fontWeight: 'bold' },
									}}
								>
									{sender?.profileData?.postCount?.length}
								</Text>
								<Text style={styles.profileDataText}>Posts</Text>
							</View>
							<View style={styles.profileData}>
								<Text
									style={{
										...styles.profileDataText,
										...{ fontSize: 24, fontWeight: 'bold' },
									}}
								>
									{sender?.profileData?.followers?.length}
								</Text>
								<Text style={styles.profileDataText}>Followers</Text>
							</View>
							<View style={styles.profileData}>
								<Text
									style={{
										...styles.profileDataText,
										...{ fontSize: 24, fontWeight: 'bold' },
									}}
								>
									{sender?.profileData?.following?.length}
								</Text>
								<Text style={styles.profileDataText}>Follwing</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							width: '100%',
							paddingHorizontal: 20,
						}}
					>
						<Text style={styles.title}>{sender?.fullName}</Text>
						<Text style={styles.content}>{sender?.email}</Text>

						<Text style={styles.bio}>{sender?.bio || 'no bio'}</Text>
					</View>
					<View style={styles.followContainer}>
						{followed ? (
							<Button
								mode='contained'
								style={styles.button}
								onPress={followUser}
							>
								Following
							</Button>
						) : (
							<Button
								mode='contained'
								style={styles.button}
								onPress={followUser}
							>
								<MaterialCommunityIcons name='account-plus' size={25} />
							</Button>
						)}
						<Button mode='contained' style={styles.button}>
							<MaterialCommunityIcons name='music' size={25} />
						</Button>
					</View>
				</View>
				<Divider />
			</ScrollView>
		</View>
	);
};

export default UserDetailsScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
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
	avatarContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
	},
	profileDataContainer: {
		width: '70%',
		marginTop: 5,
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 20,
		marginVertical: 1,
	},

	profileData: { alignItems: 'center' },
	profileDataText: {
		fontSize: 15,
		color: Colors.black,
		textAlign: 'center',
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
		backgroundColor: 'white',
		padding: 20,
		width: '80%',
		alignSelf: 'center',
		borderRadius: 10,
	},
	input: {
		marginVertical: 25,
	},
	button: {
		alignSelf: 'center',
		width: '40%',
		marginVertical: 10,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 3,
		backgroundColor: Colors.primary,
	},

	buttonContainer: {
		paddingTop: 20,
	},
	followContainer: {
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 20,
		width: '100%',
		marginTop: 10,
	},
});
