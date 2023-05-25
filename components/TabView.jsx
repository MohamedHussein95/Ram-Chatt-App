import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Colors from '../constants/Colors';
import { useState } from 'react';
import { FlatList } from 'react-native-gesture-handler';

const FirstRoute = () => (
	<View
		style={[styles.tabContainer, { backgroundColor: Colors.greyScale500 }]}
	>
		{/* Customize the content for the first tab route */}
	</View>
);

const SecondRoute = () => (
	<View
		style={[styles.tabContainer, { backgroundColor: Colors.greyScale500 }]}
	>
		{/* Customize the content for the second tab route */}
	</View>
);

const renderScene = SceneMap({
	first: FirstRoute,
	second: SecondRoute,
});

export default function PostTabviews() {
	const layout = useWindowDimensions();

	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: 'first', title: 'Posts' },
		{ key: 'second', title: 'Tags' },
	]);

	return (
		<>
			<View style={{ flex: 1 }}>
				<TabView
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={{ width: layout.width }}
					tabBarProps={{
						// Add any additional tab bar props here
						// For example, to customize the tab bar style:
						style: { backgroundColor: Colors.primary },
						activeTintColor: Colors.primary,
						inactiveTintColor: Colors.greyScale100,
					}}
				/>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	tabContainer: {
		flex: 1,
	},
});
