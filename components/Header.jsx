import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const Header = ({ sender }) => {
	const navigation = useNavigation();
	return (
		<View style={styles.header}>
			<AntDesign
				name='arrowleft'
				size={25}
				onPress={() => navigation.pop()}
			/>
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={() => navigation.navigate('UserDetailsScreen', { sender })}
			>
				<View style={styles.avatarContainer}>
					<Avatar.Image source={{ uri: sender?.avatar }} size={40} />
					<Text style={styles.title}>{sender?.fullName}</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
};

export default Header;

const styles = StyleSheet.create({
	header: {
		width: '100%',
		flexDirection: 'row',
		paddingHorizontal: 15,
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 10,
		elevation: 2,
	},
	avatarContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginLeft: 15,
	},
	title: {
		fontSize: 20,
		letterSpacing: 0.5,
		fontWeight: '500',
		marginHorizontal: 10,
	},
});
