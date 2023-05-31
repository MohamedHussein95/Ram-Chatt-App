import React, { useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import Post from '../components/Post';
import Colors from '../constants/Colors';
import { useGetAllPostsMutation } from '../store/postApiSlice';
import socket from '../utils/socket';
import { useSelector } from 'react-redux';

const HomeScreen = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const [posts, setPost] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [getAllposts] = useGetAllPostsMutation();
	const flatListRef = useRef();

	const getPosts = async () => {
		setRefreshing(true);
		try {
			const posts = await getAllposts().unwrap();
			setPost(posts);
		} catch (error) {
			console.log(error);
		} finally {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		socket.on('add-post', async (res) => {
			setPost((prev) => [...prev, res]);
			flatListRef.current.scrollToEnd();
		});

		return () => {
			socket.off('add-post');
		};
	}, [socket]);

	useEffect(() => {
		getPosts().catch((err) => console.log(err));
	}, []);

	const EmptyListComponent = (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
				<Text style={styles.noPosts}>
					No Posts at the moment. Be the first to create a post
				</Text>
			</View>
		</View>
	);

	return (
		<View style={styles.screen}>
			<Appbar.Header style={styles.header}>
				<Appbar.Content title='Home' color='#fff' />
				<Appbar.Action
					icon='magnify'
					onPress={() => {}}
					color='#fff'
					size={30}
				/>
			</Appbar.Header>
			<FlatList
				ref={flatListRef}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={getPosts}
						title='fetching new posts'
						tintColor={Colors.error}
						titleColor={Colors.error}
						colors={[Colors.liked]}
					/>
				}
				data={posts}
				renderItem={({ item }) => <Post key={item?._d} item={item} />}
				keyExtractor={(item) => item._id}
				style={{ flex: 1 }}
				contentContainerStyle={{ justifyContent: 'center' }}
				ListEmptyComponent={EmptyListComponent}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: Colors.dark1,
	},
	header: {
		backgroundColor: Colors.primary,
		justifyContent: 'space-between',
	},
	noPosts: {
		fontSize: 18,
		fontFamily: 'REGULAR',
		color: Colors.dark1,
		textAlign: 'center',
		marginTop: 100,
	},
});

export default HomeScreen;
