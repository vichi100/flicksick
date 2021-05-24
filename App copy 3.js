import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function App() {
	const [ contactData, setContactData ] = useState(null);
	const [ contactObjDict, setContactObjDict ] = useState({});
	useEffect(() => {
		(async () => {
			const { status } = await Contacts.requestPermissionsAsync();
			if (status === 'granted') {
				const { data } = await Contacts.getContactsAsync({
					fields: [ Contacts.Fields.PhoneNumbers ]
				});

				if (data.length > 0) {
					console.log('data size: ', data.length);
					setContactData(data);
				}
			}
		})();
	}, []);

	useEffect(
		() => {
			if (contactData) {
				contactData.map((item) => {
					createContactDict(item);
				});
			}
		},
		[ contactData ]
	);

	const createContactDict = (item) => {
		if (item['phoneNumbers'] && item['phoneNumbers'][0]) {
			// console.log(item['phoneNumbers'][0].number);
			const name = item.name;
			const mobile = item['phoneNumbers'][0].number.replace(/ /g, '');
			const countryCode = item['phoneNumbers'][0].countryCode;

			if (mobile.length >= 10) {
				if (mobile.indexOf('+') > -1) {
					// console.log(mobile);
					contactObjDict[mobile] = name;
					// console.log(contactObjDict);
					// const obj = {
					// 	name: name,
					// 	mobile: mobile,
					// 	country: countryCode
					// };
					// contactObjArray.push(obj);
				} else {
					if (mobile.length > 10) {
						const lenX = mobile.length;
						var temp = mobile.slice(lenX - 10, lenX);
						contactObjDict[temp] = name;
						// console.log('+91' + temp);
						// const obj = {
						// 	name: name,
						// 	mobile: mobile,
						// 	country: countryCode
						// };
						// contactObjArray.push(obj);
					}
				}
			}
			// console.log(Object.keys(contactObjDict).length);
		}
	};

	const renderItem = ({ item }) => {
		// if (item['phoneNumbers'] && item['phoneNumbers'][0]) {
		// 	// console.log(item['phoneNumbers'][0].number);
		// 	const name = item.name;
		// 	const mobile = item['phoneNumbers'][0].number.replace(/ /g, '');
		// 	const countryCode = item['phoneNumbers'][0].countryCode;

		// 	if (mobile.length >= 10) {
		// 		if (mobile.indexOf('+') > -1) {
		// 			// console.log(mobile);
		// 			const obj = {
		// 				name: name,
		// 				mobile: mobile,
		// 				country: countryCode
		// 			};
		// 			contactObjArray.push(obj);
		// 		} else {
		// 			if (mobile.length > 10) {
		// 				const lenX = mobile.length;
		// 				var temp = mobile.slice(lenX - 10, lenX);
		// 				// console.log('+91' + temp);
		// 				const obj = {
		// 					name: name,
		// 					mobile: mobile,
		// 					country: countryCode
		// 				};
		// 				contactObjArray.push(obj);
		// 			}
		// 		}
		// 	}
		// 	console.log(contactObjArray.length);
		// }

		return item['phoneNumbers'] && item['phoneNumbers'][0] ? (
			<View>
				<Text>{item.name}</Text>
				<Text>{item['phoneNumbers'][0].number}</Text>
				<Text>{item['phoneNumbers'][0].countryCode}</Text>
			</View>
		) : null;
	};

	return (
		<View style={styles.container}>
			<FlatList
				data={contactData}
				//data defined in constructor
				// ItemSeparatorComponent={ItemSeparatorView}
				//Item Separator View
				renderItem={(item) => renderItem(item)}
				keyExtractor={(item, index) => index.toString()}
				// numColumns={2}
			/>
		</View>
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
