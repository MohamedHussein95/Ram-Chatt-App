import {
	ActivityIndicator,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
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
	const [loading, setLoading] = useState(false);

	const getPosts = async () => {
		try {
			try {
				setLoading(true);
				const posts = await getAllposts().unwrap();

				setPost(posts);
				setLoading(false);
			} catch (error) {
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
		}
	};
	//listen for new posts
	useEffect(() => {
		socket.on('posted', async () => {
			await getPosts();
		});
		return () => {
			socket.off('posted');
		};
	}, [socket]);
	//render posts for first time
	useEffect(() => {
		getPosts().catch((err) => console.log(err));
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
			{loading && (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<ActivityIndicator size={'small'} color={Colors.white} />
				</View>
			)}
			{!loading && (
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
					ListEmptyComponent={
						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<View
								style={{
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Text style={styles.noPosts}>
									No Posts at the moment.Be the first to create a post
								</Text>
							</View>
						</View>
					}
				/>
			)}
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.dark2,
	},
	header: {
		backgroundColor: Colors.primary,
		justifyContent: 'space-between',
	},
	noPosts: {
		fontSize: 18,
		fontFamily: 'REGULAR',
		color: Colors.greyScale600,
		textAlign: 'center',
		marginTop: 100,
	},
});
