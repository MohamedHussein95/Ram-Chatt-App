import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';

const ExploreScreen = () => {
	return (
		<View style={styles.screen}>
			<Text>ExploreScreen</Text>
		</View>
	);
};

export default ExploreScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.dark2,
	},
});
