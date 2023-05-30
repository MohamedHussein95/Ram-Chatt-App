import { AntDesign, Entypo } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

const ProfileSetting = ({
	title,
	icon,
	IconPack,
	onPress,
	titleRight,
	right,
	color,
	size,
	styleTitle,
	...props
}) => {
	const Right = right;
	return (
		<TouchableOpacity
			style={styles.container}
			activeOpacity={0.8}
			onPress={onPress}
		>
			<View style={styles.iconContainer}>
				<IconPack name={icon} size={size || 25} color={color} />
				<Text style={{ ...styles.title, ...styleTitle, color: color }}>
					{title}
				</Text>
			</View>
			{right ? (
				Right
			) : (
				<View style={{ ...styles.iconContainer, ...{ flex: 0 } }}>
					{titleRight && <Text style={styles.title}>{titleRight}</Text>}
					{/* <AntDesign name='arrowright' size={24} color='black' /> */}
				</View>
			)}
		</TouchableOpacity>
	);
};

export default memo(ProfileSetting);

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 15,
		marginHorizontal: 10,
	},
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		gap: 15,
		alignItems: 'center',
	},
	title: {
		fontSize: 18,
		color: Colors.black,
	},
});
