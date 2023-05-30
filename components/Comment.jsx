import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import { Avatar } from 'react-native-paper';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Comment = ({ item }) => {
	const { sentBy, body, createdAt } = item;
	const date = new Date(createdAt);
	const sentTime = moment(date).fromNow(true);
	return (
		<View style={styles.comment}>
			<View style={styles.avatarContainer}>
				<Avatar.Image size={30} source={{ uri: sentBy?.avatar }} />
				<View style={{ width: '50%' }}>
					<Text
						style={styles.userName}
						numberOfLines={1}
						ellipsizeMode='tail'
					>
						{sentBy?.userName}
					</Text>
				</View>
				<Text style={styles.time}>{sentTime}</Text>
			</View>
			<View style={styles.body}>
				{body && <Text style={styles.bodyText}>{body}</Text>}
			</View>
			<View style={styles.footer}>
				<MaterialCommunityIcons
					name='reply'
					color={Colors.primary400}
					size={20}
				/>
				<Text style={styles.footerText}>Reply</Text>
			</View>
		</View>
	);
};

export default Comment;

const styles = StyleSheet.create({
	comment: {
		backgroundColor: Colors.dark1,
		padding: 15,
		marginVertical: 1,
	},
	avatarContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	userName: {
		fontSize: 14,
		marginRight: 20,
		marginLeft: 5,
		color: Colors.primary400,
		fontFamily: 'REGULAR',
	},
	time: { fontFamily: 'REGULAR', fontSize: 12, color: Colors.primary400 },
	body: {
		paddingVertical: 3,
	},
	bodyText: {
		fontSize: 14,
		fontFamily: 'MEDIUM',
		color: Colors.greyScale400,
	},
	footer: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	footerText: {
		color: Colors.primary400,
	},
});
