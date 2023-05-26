import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import moment from 'moment/moment';
import { useSelector } from 'react-redux';
import Colors from '../constants/Colors';

const Message = ({ item }) => {
	const { sender, content, createdAt } = item;
	const date = new Date(createdAt);
	const sentTime = moment(date).format('HH:mm');
	const { userInfo } = useSelector((state) => state.auth);
	const status = sender !== userInfo?._id;

	return (
		<View>
			<View
				style={
					status
						? styles.mmessageWrapper
						: [styles.mmessageWrapper, { alignItems: 'flex-end' }]
				}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View
						style={
							status
								? styles.mmessage
								: [
										styles.mmessage,
										{ backgroundColor: Colors.primary500 },
								  ]
						}
					>
						<Text style={styles.content}>{content}</Text>
					</View>
				</View>
				<Text style={{ color: Colors.white, marginHorizontal: 15 }}>
					{sentTime}
				</Text>
			</View>
		</View>
	);
};

export default memo(Message);

const styles = StyleSheet.create({
	mmessageWrapper: {
		width: '100%',
		alignItems: 'flex-start',
		marginBottom: 15,
	},
	mmessage: {
		maxWidth: '50%',
		backgroundColor: Colors.greyScale700,
		padding: 15,
		borderRadius: 10,
		marginBottom: 2,
		marginHorizontal: 10,
	},
	content: {
		color: Colors.white,
		fontFamily: 'MEDIUM',
		fontSize: 15,
	},
});
