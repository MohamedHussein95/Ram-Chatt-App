import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Appbar } from 'react-native-paper';
import Colors from '../constants/Colors';
import Post from '../components/Post';
import { useGetAllPostsMutation } from '../store/postApiSlice';

import socket from '../utils/socket';

const HomeScreen = () => {
	const [posts, setPost] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [getAllposts] = useGetAllPostsMutation();

	const getPosts = async () => {
		try {
			const posts = await getAllposts().unwrap();
			//console.log(posts);
			setPost(posts);
		} catch (error) {}
	};
	useEffect(() => {
		getPosts();
	}, []);
	return (
		<View style={styles.screen}>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title='Home' color={Colors.white} />

				<Appbar.Action
					icon='magnify'
					onPress={() => {}}
					color={Colors.white}
					size={30}
				/>
			</Appbar.Header>
			<FlatList
				onRefresh={getPosts}
				refreshing={refreshing}
				data={posts}
				renderItem={({ item }) => <Post key={item?._d} item={item} />}
				keyExtractor={(item) => item._id}
				style={{ flex: 1 }}
				contentContainerStyle={{
					justifyContent: 'center',
				}}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.primary600,
	},
	header: {
		backgroundColor: Colors.primary,
		justifyContent: 'space-between',
	},
});
