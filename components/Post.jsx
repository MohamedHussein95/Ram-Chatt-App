import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import moment from 'moment';

const Post = ({ item }) => {
	const [liked, setLiked] = useState(false);
	const [disliked, setDisliked] = useState(false);
	const date = new Date(item?.createdAt);
	const createdAt = moment(date).fromNow();

	return (
		<View style={styles.post}>
			<View style={styles.header}>
				<View style={styles.avatarContainer}>
					<Avatar.Image
						size={45}
						source={{ uri: item?.createdBy?.avatar }}
					/>
					<View style={{ width: '50%' }}>
						<Text
							style={styles.userName}
							numberOfLines={1}
							ellipsizeMode='tail'
						>
							{item?.createdBy?.userName}
						</Text>
					</View>
					<Text style={styles.time}>{createdAt}</Text>
				</View>
				<View style={styles.menu}>
					<MaterialCommunityIcons
						name='dots-vertical'
						color={Colors.primary400}
						size={25}
					/>
				</View>
			</View>
			<View style={styles.body}>
				<Text style={styles.title}>{item?.title}</Text>
				{item?.body?.text && (
					<Text style={styles.bodyText}>{item?.body?.text}</Text>
				)}
			</View>
			<View style={styles.footer}>
				<MaterialCommunityIcons
					name={liked && !disliked ? 'thumb-up' : 'thumb-up-outline'}
					size={30}
					color={Colors.primary400}
				/>
				<Text style={styles.footerText}>
					{item?.metaData?.likes?.length}
				</Text>
				<MaterialCommunityIcons
					name={disliked && !liked ? 'thumb-down' : 'thumb-down-outline'}
					size={30}
					color={Colors.primary400}
				/>
				<Text style={styles.footerText}>
					{item?.metaData?.dislikes?.length}
				</Text>
				<MaterialCommunityIcons
					name='comment-outline'
					size={30}
					color={Colors.primary400}
				/>
				<Text style={styles.footerText}>
					{item?.metaData?.comments?.length}
				</Text>

				<MaterialCommunityIcons
					name='share-outline'
					size={35}
					color={Colors.primary400}
				/>
				<Text style={styles.footerText}>{'12'}</Text>
			</View>
		</View>
	);
};

export default Post;

const styles = StyleSheet.create({
	post: {
		marginVertical: 0,
		width: '100%',
		alignSelf: 'center',

		overflow: 'hidden',
		backgroundColor: Colors.primary600,
		padding: 10,
		borderBottomColor: Colors.greyScale700,
		borderBottomWidth: 1,
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		padding: 10,
	},
	menu: {},
	avatarContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	userName: {
		fontSize: 14,
		marginRight: 25,
		marginLeft: 5,
		color: Colors.primary400,
		fontFamily: 'REGULAR',
	},
	time: { fontFamily: 'REGULAR', fontSize: 12, color: Colors.primary400 },
	body: {
		paddingHorizontal: 15,
		paddingBottom: 10,
	},
	title: {
		fontSize: 24,
		fontFamily: 'SEMI_BOLD',
		color: Colors.white,
	},
	bodyText: {
		fontSize: 14,
		fontFamily: 'MEDIUM',
		color: Colors.primary400,
	},
	footer: {
		width: '80%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
	},
	footerText: {
		color: Colors.primary400,
	},
});
