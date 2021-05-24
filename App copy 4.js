import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fakeServer } from './fakeServer';
import axios from 'axios';

const renderItem = ({ item }) => {
	// console.log(item);
	return (
		<Text
			style={{
				textAlign: 'center',
				fontWeight: 'bold',
				fontSize: 20,
				padding: 15,
				borderBottomColor: 'red',
				borderBottomWidth: 2
			}}
		>
			{item.name}
		</Text>
	);
};

let stopFetchMore = true;

const ListFooterComponent = () => (
	<Text
		style={{
			fontSize: 16,
			fontWeight: 'bold',
			textAlign: 'center',
			padding: 5
		}}
	>
		Loading...
	</Text>
);

export default function App() {
	const [ data, setData ] = useState([]);
	const [ loadingMore, setLoadingMore ] = useState(false);

	// const { navigation } = props;
	const [ search, setSearch ] = useState('');
	const [ selectedFriendMobile, setSelectedFriendMobile ] = useState(null);
	const [ selectedFriendName, setSelectedFriendName ] = useState('All Friends');
	const [ contactData, setContactData ] = useState(null);
	const [ contactObjDict, setContactObjDict ] = useState({});
	const [ friendOn, setFriendOn ] = useState(null);
	const [ friendOff, setFriendOff ] = useState(null);
	const [ friendBlocked, setFriendBlocked ] = useState(null);
	const [ allFriendsDataArray, setAllFriendsDataArray ] = useState([]);
	const [ subAllFriendsDataArray, setSubAllFriendsDataArray ] = useState([]);
	const [ refreshing, setRefreshing ] = React.useState(false);
	const [ startIndex, setStartIndex ] = useState(0);
	const [ endIndex, setEndIndex ] = useState(25);

	// const fetchData = async () => {
	// 	const response = await fakeServer(20);
	// 	setData([ ...response ]);
	// };

	// useEffect(() => {
	// 	fetchData();
	// }, []);

	useEffect(() => {
		getFriendsData();
	}, []);

	const getFriendsData = () => {
		const obj = {
			id: '+919867614466'
		};
		axios('http://192.168.0.100:3000/getFriendsData', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data.friends_off);
				const result = response.data;
				const allFriendsDataArrayX = [];
				console.log('size: ', Object.keys(result).length);
				if (Object.keys(result).length > 0) {
					// setFriendOn(result.friends_on);
					// console.log('friends size', Object.keys(result.friends_on).length);
					if (result.friends_on) {
						createFriendsDataArray(result.friends_on, 'on', allFriendsDataArrayX);
					}

					// setFriendOff(result.friends_off);
					if (result.friends_off) {
						createFriendsDataArray(result.friends_off, 'off', allFriendsDataArrayX);
					}

					// setFriendBlocked(result.friends_blocked);
					if (result.friends_blocked) {
						createFriendsDataArray(result.friends_blocked, 'blocked', allFriendsDataArrayX);
					}
				} else {
					// setFriendOff(contactObjDict);
					createFriendsDataArray(contactObjDict, 'off', allFriendsDataArrayX);
				}
				setAllFriendsDataArray(allFriendsDataArrayX);
				const start = startIndex;
				const end = endIndex;
				const temp = allFriendsDataArrayX.slice(start, end);
				setSubAllFriendsDataArray(temp);
				setStartIndex(endIndex);
				setEndIndex(end + 25);
			},
			(error) => {
				console.log(error);
			}
		);
	};

	const createFriendsDataArray = (dictData, status, allFriendsDataArrayX) => {
		console.log('friends size2: ', Object.keys(dictData).length);
		Object.keys(dictData).map((item) => {
			const name = dictData[item];
			const mobile = item;
			const friendObj = {
				name: name,
				mobile: mobile,
				status: status
			};
			allFriendsDataArrayX.push(friendObj);
			console.log(allFriendsDataArrayX.length);
		});
	};

	const handleOnEndReached = async () => {
		setLoadingMore(true);
		console.log('refresh');
		if (!stopFetchMore) {
			console.log('refresh');
			// setRefreshing(true);
			// setLoadingMore(true);
			const start = startIndex;
			const end = endIndex;
			console.log('start : ', start);
			console.log('end : ', end);
			const temp = allFriendsDataArray.slice(start, end);
			const x = [ ...subAllFriendsDataArray, ...temp ];
			console.log('temp len: ', temp.length);
			setSubAllFriendsDataArray(temp);
			setStartIndex(endIndex);
			setEndIndex(end + 25);
			// wait(2000).then(() => setRefreshing(false));
			// setRefreshing(false);
			// setLoadingMore(false);
		}
		setLoadingMore(false);
	};

	return (
		<FlatList
			data={subAllFriendsDataArray}
			keyExtractor={(item) => item}
			renderItem={renderItem}
			onEndReached={handleOnEndReached}
			onEndReachedThreshold={0.5}
			onScrollBeginDrag={() => {
				stopFetchMore = false;
			}}
			ListFooterComponent={() => loadingMore && <ListFooterComponent />}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
