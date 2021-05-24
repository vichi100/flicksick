import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
// import { fakeServer } from './fakeServer';
import axios from 'axios';

const renderItem = ({ item }) => {
	// console.log('item', item);
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
	const [ startIndex, setStartIndex ] = useState(0);
	const [ endIndex, setEndIndex ] = useState(6);
	const [ allFriendsDataArray, setAllFriendsDataArray ] = useState([]);

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
				// console.log('size: ', Object.keys(result).length);
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
				// const start = startIndex;
				// const end = endIndex;
				// const temp = allFriendsDataArrayX.slice(start, end);
				// setSubAllFriendsDataArray(temp);
				// setStartIndex(endIndex);
				// setEndIndex(end + 6);
			},
			(error) => {
				console.log(error);
			}
		);
	};

	const createFriendsDataArray = (dictData, status, allFriendsDataArrayX) => {
		// console.log('friends size2: ', Object.keys(dictData).length);
		Object.keys(dictData).map((item) => {
			const name = dictData[item];
			const mobile = item;
			const friendObj = {
				name: name,
				mobile: mobile,
				status: status
			};
			allFriendsDataArrayX.push(friendObj);
			// console.log(allFriendsDataArrayX.length);
		});
	};

	const fetchData = async () => {
		const response = await fakeServer(20);
		setData([ ...response ]);
	};

	useEffect(
		() => {
			// console.log('allFriendsDataArray.length: ', allFriendsDataArray.length);
			if (allFriendsDataArray.length > 0) {
				fetchData();
			}
		},
		[ allFriendsDataArray ]
	);

	const handleOnEndReached = async () => {
		setLoadingMore(true);
		if (!stopFetchMore) {
			const response = await fakeServer(20);
			if (response === 'done') return setLoadingMore(false);
			setData([ ...data, ...response ]);
			stopFetchMore = true;
		}
		setLoadingMore(false);
	};
	let lastItem = '';
	const fakeServer = (qty) =>
		new Promise((resolve, reject) => {
			let newArr;
			const lastItemIndex = allFriendsDataArray.indexOf(lastItem);
			if (lastItemIndex === allFriendsDataArray.length - 1) return resolve('done');

			if (!lastItem) {
				newArr = [ ...allFriendsDataArray ].slice(0, qty);
				lastItem = [ ...newArr ].pop();
			} else {
				const newIndex = allFriendsDataArray.indexOf(lastItem) + 1;
				newArr = [ ...allFriendsDataArray ].slice(newIndex, qty + newIndex);
				lastItem = [ ...newArr ].pop();
			}
			setTimeout(() => {
				resolve(newArr);
			}, 1000);
		});

	return (
		<FlatList
			data={allFriendsDataArray}
			keyExtractor={(item, index) => String(index)}
			renderItem={renderItem}
			// onEndReached={handleOnEndReached}
			// onEndReachedThreshold={0.5}
			// onScrollBeginDrag={() => {
			// 	stopFetchMore = false;
			// }}
			// ListFooterComponent={() => loadingMore && <ListFooterComponent />}
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
