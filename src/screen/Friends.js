import React, { useEffect, useState, useRef, memo } from 'react';
import {
	StyleSheet,
	Platform,
	View,
	ScrollView,
	Text,
	StatusBar,
	SafeAreaView,
	FlatList,
	Image,
	TouchableOpacity,
	TouchableHighlight,
	TextInput,
	RefreshControl,
	ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import * as Font from 'expo-font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { connect } from 'react-redux';
import { setTrendingTodayX, setDataFor, setUserContactDict } from '../reducers/Action';
import FlatListStrip from './FlatListStrip';
import * as Contacts from 'expo-contacts';
import FriendsDisplay from './FriendsDisplay';
import Snackbar from '../screen/components/SnackbarComponent';
import { SERVER_URL } from './utils/constants';

const categoryData = [ 'All', 'Action', 'comady', 'mystery', 'romcom', 'Action', 'comady', 'mystery', 'romcom' ];

const Friends = (props) => {
	const { navigation } = props;
	const [ search, setSearch ] = useState('');
	const [ selectedFriendMobile, setSelectedFriendMobile ] = useState(null);
	const [ selectedFriendName, setSelectedFriendName ] = useState('All Friends');
	const [ contactData, setContactData ] = useState(null);
	const [ contactObjDict, setContactObjDict ] = useState({});
	const [ friendOn, setFriendOn ] = useState(null);
	const [ friendOff, setFriendOff ] = useState(null);
	const [ friendBlocked, setFriendBlocked ] = useState(null);
	const [ allFriendsDataArray, setAllFriendsDataArray ] = useState([]);
	const [ allFriendsDataArrayMain, setAllFriendsDataArrayMain ] = useState([]);
	const [ subAllFriendsDataArray, setSubAllFriendsDataArray ] = useState([]);
	const [ startIndex, setStartIndex ] = useState(0);
	const [ endIndex, setEndIndex ] = useState(10);
	const [ loadingMore, setLoadingMore ] = useState(false);
	const [ onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum ] = useState(true);
	const [ refreshing, setRefreshing ] = useState(false);
	const [ category, setCategory ] = useState('all');
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ isVisible, setIsVisible ] = useState(false);

	const dismissSnackBar = () => {
		setIsVisible(false);
	};

	const displayFriendMovieList = (item) => {
		console.log(item);
		if (item.status === 'off') {
			setErrorMessage(
				<Text>
					Your friend is not using Flick / Sick.{' '}
					<Text style={{ color: 'rgba(0,191,255, .9)', fontSize: 16, fontWeight: '600' }}>Invite </Text>him |
				</Text>
			);
			setIsVisible(true);
			return;
		}
		if (selectedFriendMobile !== item.mobile) {
			setSelectedFriendMobile(item.mobile);
			setSelectedFriendName(item.name);
			setCategory('all');
		} else {
			setSelectedFriendMobile(null);
			setSelectedFriendName('All Friends');
			setCategory('all');
		}
	};

	const RowX = ({ item }) => {
		return (
			<TouchableOpacity
				activeOpacity={1}
				// style={styles.slideInnerContainer}
				onPress={() => displayFriendMovieList(item)}
			>
				<View style={{ marginTop: 10 }} />

				<View
					style={{
						borderColor:
							selectedFriendMobile === item.mobile ? 'rgba(255,255,255, .9)' : 'rgba(105,105,105, .4)',
						borderWidth: selectedFriendMobile === item.mobile ? 0.9 : 0.3,
						borderRadius: 30,
						padding: 15,
						marginLeft: 5,
						marginRight: 5,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<View
						style={{
							paddingLeft: 10,
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '80%',
							alignItems: 'center'
						}}
					>
						<View>
							<Text style={{ color: '#F5F5F5', fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
							<Text style={{ color: '#A9A9A9', fontSize: 12, fontWeight: '400', paddingTop: 5 }}>
								{item.mobile}
							</Text>
						</View>

						<Text
							style={{
								color: 'rgba(0,191,255, .9)',
								fontSize: 16,
								fontWeight: '600',
								textAlign: 'center'
							}}
						>
							Invite
						</Text>
					</View>
					{item.status === 'on' ? (
						<View>
							<FontAwesome name="circle" color={'#3CB371'} size={15} />
						</View>
					) : item.status === 'off' ? (
						<View>
							<FontAwesome name="circle" color={'#FF8C00'} size={17} />
						</View>
					) : (
						<View>
							<FontAwesome name="minus-circle" color={'#DC143C'} size={15} />
						</View>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	const rowItem = ({ item }) => {
		return <FriendsDisplay item={item} displayFriendMovieList={(item) => displayFriendMovieList(item)} />;
	};

	const rowKeyExt = (item, index) => item.mobile;

	const areEqual = (prevProps, nextProps) => {
		// return false prevProps.text & nextProps.text are not equal.
		return prevProps.item.mobile === nextProps.item.mobile;
		// else all are equal, no re-render
		return true;
	};

	const renderFriendsList = ({ item }) => {
		// console.log('Item:  ', item);
		return <Row item={item} />;
	};

	const searchFilterFunction = (text) => {
		// Check if searched text is not blank
		if (text) {
			// setAllFriendsDataArrayMain([ ...allFriendsDataArray ]);
			// Inserted text is not blank
			// Filter the masterDataSource and update FilteredDataSource
			const newData = allFriendsDataArray.filter(function(item) {
				// Applying filter for the inserted text in search bar
				const itemData = item.name + item.mobile;
				const textData = text.toUpperCase();
				return itemData.toUpperCase().indexOf(textData) > -1;
			});
			setAllFriendsDataArray(newData);
			setSearch(text);
		} else {
			// Inserted text is blank
			// Update FilteredDataSource with masterDataSource
			setAllFriendsDataArray(allFriendsDataArrayMain);
			// setAllFriendsDataArrayMain(null);
			setSearch(text);
		}
	};

	const renderCategoryItem = ({ item }) => {
		// console.log(item);
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					marginRight: 10,
					marginLeft: 10
				}}
			>
				<TouchableHighlight onPress={() => setCategory(item)}>
					{item.toString().toUpperCase() === category.toUpperCase() ? (
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					) : (
						<Text style={{ color: '#808080', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					)}
				</TouchableHighlight>
			</View>
		);
	};

	useEffect(
		() => {
			if (props.userDetails) {
				(async () => {
					const { status } = await Contacts.requestPermissionsAsync();
					if (status === 'granted') {
						const { data } = await Contacts.getContactsAsync({
							fields: [ Contacts.Fields.PhoneNumbers ]
						});
						// console.log(data.length);
						if (data.length > 0) {
							setContactData(data);
						}
					}
				})();
			}
		},
		[ props.userDetails ]
	);

	useEffect(
		() => {
			if (contactData && props.userDetails) {
				contactData.map((item) => {
					createContactDict(item);
				});
				saveNewContact();
			}
		},
		[ contactData ]
	);

	const createContactDict = (item) => {
		if (item['phoneNumbers'] && item['phoneNumbers'][0]) {
			// console.log(item['phoneNumbers'][0].number);
			const name = item.name;
			var mobile = item['phoneNumbers'][0].number.replace(/ /g, '');
			mobile = mobile.replace(/-/g, '');
			const countryCode = item['phoneNumbers'][0].countryCode;

			if (mobile.length >= 10) {
				if (mobile.indexOf('+') > -1) {
					// console.log(mobile);
					contactObjDict[mobile] = name;
				} else {
					if (mobile.length > 10) {
						const lenX = mobile.length;
						var temp = mobile.slice(lenX - 10, lenX);
						// console.log('+91' + temp);
						contactObjDict['+91' + temp] = name;
					}
				}
			}
			// console.log(Object.keys(contactObjDict).length);
		}
	};

	const saveNewContact = () => {
		const obj = {
			id: props.userDetails.mobile,
			contact_dict: contactObjDict
		};
		axios(SERVER_URL + '/saveNewContact', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data);
			},
			(error) => {
				console.log(error);
			}
		);
	};

	useEffect(() => {
		getFriendsData();
	}, []);

	const getFriendsData = () => {
		const obj = {
			id: props.userDetails.mobile
		};
		axios(SERVER_URL + '/getFriendsData', {
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
				const temp = allFriendsDataArrayX.slice(startIndex, endIndex);
				setAllFriendsDataArray(allFriendsDataArrayX);
				setAllFriendsDataArrayMain(allFriendsDataArrayX);
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

	// allFriendsDataArray
	const fetchOnScrollDownMovies = () => {
		console.log('fetchOnScrollDownMovies1: ', allFriendsDataArray.length);
		const subData = allFriendsDataArrayMain.slice(endIndex, endIndex + 10);
		// if (allFriendsDataArray.length > 50) {
		// 	const x = allFriendsDataArray.length - 50;
		// 	allFriendsDataArray.splice(0, x);
		// }
		// const temp = [ ...allFriendsDataArray, ...subData ];
		allFriendsDataArray.concat(subData);
		// setAllFriendsDataArray(temp);
		setEndIndex(endIndex + 10);
		// setOnEndReachedCalledDuringMomentum(true);
		setLoadingMore(false);
		console.log('fetchOnScrollDownMovies2: ', allFriendsDataArray.length);
		// setTimeout(() => {}, 1000);
	};

	const handleLoadMore = () => {
		console.log('handleLoadMore1');
		console.log('onEndReachedCalledDuringMomentum: ', onEndReachedCalledDuringMomentum);
		console.log('loadingMore: ', loadingMore);
		if (!onEndReachedCalledDuringMomentum && !loadingMore) {
			console.log('handleLoadMore2');
			setLoadingMore(true);
			fetchOnScrollDownMovies();
			setOnEndReachedCalledDuringMomentum(true);
		}
	};

	const renderFooter = () => {
		if (!loadingMore) return null;

		return (
			<View
				style={{
					// position: 'relative',
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					width: 60,
					height: 60,
					paddingVertical: 20,
					borderTopWidth: 1,
					marginTop: 10,
					marginBottom: 10,
					borderColor: '#fff'
				}}
			>
				<ActivityIndicator animating size="large" />
			</View>
		);
	};

	return (
		<SafeAreaView style={{ backgroundColor: 'rgba(0,0,0, .9)', flex: 1 }}>
			<View>
				<View style={{ marginBottom: 5 }}>
					<TextInput
						style={{
							width: '98%',
							height: 40,
							borderWidth: 0.2,
							paddingLeft: 20,
							margin: 5,
							// marginBottom: 5,
							borderRadius: 10,
							borderColor: '#00FFFF',
							backgroundColor: '#000',
							color: '#A9A9A9'
						}}
						onChangeText={(text) => searchFilterFunction(text)}
						value={search}
						underlineColorAndroid="transparent"
						placeholder="Search by name or mobile"
						inlineImageLeft="search_icon"
						placeholderTextColor={'#A9A9A9'}
					/>
					<View style={{ position: 'absolute', top: 15, right: 10 }}>
						<AntDesign name="search1" color={'#A9A9A9'} size={20} />
					</View>
				</View>
				<View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginTop: 10, marginBottom: 0 }}>
					<Text
						style={{ color: 'rgba(32,178,170,4)', fontSize: 18, fontWeight: '600', width: '26%' }}
						numberOfLines={1}
					>
						{selectedFriendName}
					</Text>
					<Text style={{ color: '#FFA500', fontSize: 16, fontWeight: '500' }}>{' |'} </Text>
					<FlatList
						horizontal
						data={categoryData}
						//data defined in constructor
						// ItemSeparatorComponent={ItemSeparatorView}
						//Item Separator View
						renderItem={(item) => renderCategoryItem(item)}
						keyExtractor={(item, index) => index.toString()}
					/>
					{/* <Text style={{ color: '#F5F5F5', margin: 10 }}>Action</Text>
					<Text style={{ color: '#F5F5F5', margin: 10 }}>Crime</Text>
					<Text style={{ color: '#F5F5F5', margin: 10 }}>Mystery</Text>
					<Text style={{ color: '#F5F5F5', margin: 10 }}>RomCom</Text>
					<Text style={{ color: '#F5F5F5', margin: 10 }}>Sports</Text> */}
				</View>
				<View style={{ margin: 7 }} />

				<FlatListStrip
					data={props.trendingCurrentWeek}
					title={null}
					navigation={navigation}
					horizontalFlag={true}
					numColumns={1}
					imageHight={200}
					imageWidth={160}
				/>

				{/* <ScrollView> */}
				<FlatList
					// horizontal
					removeClippedSubviews={true}
					data={allFriendsDataArray}
					// renderItem={rowItem}
					renderItem={({ item }) => <RowX item={item} />}
					extraData={allFriendsDataArray}
					keyExtractor={rowKeyExt}
					// onEndReached={() => handleLoadMore()}
					// onEndReachedThreshold={0}
					// ListFooterComponent={renderFooter}
					// onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
					// scrollEnabled={!loadingMore}
				/>
				{/* </ScrollView> */}
				{/* <View style={{ marginBottom: 90 }} /> */}
				{/* <View style={{ marginTop: 0 }}> */}

				{/* </View> */}
				<Snackbar
					visible={isVisible}
					textMessage={errorMessage}
					position={'top'}
					actionHandler={() => dismissSnackBar()}
					actionText="OK"
				/>
			</View>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	trendingToday: state.AppReducer.trendingToday,
	trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	fsIdToGetDetails: state.AppReducer.fsIdToGetDetails,
	userDetails: state.AppReducer.userDetails,
	userContactDict: state.AppReducer.userContactDict
});

// const mapDispatchToProps = () => ({
//   setTrendingTodayX,
//   setTrendingCurrentWeekY,
// });
const mapDispatchToProps = {
	setTrendingTodayX,
	setDataFor,
	setUserContactDict
};
export default connect(mapStateToProps, mapDispatchToProps)(Friends);

const dataX = [
	{
		name: 'Miyah Myles',
		mobile: '9833097591'
	},
	{
		name: 'June Cha',
		mobile: '9833097592'
	},
	{
		name: 'Iida Niskanen',
		mobile: '9833097593'
	},
	{
		name: 'Renee Sims',
		mobile: '9833097594'
	},
	{
		name: 'Jonathan Nu\u00f1ez',
		mobile: '9833097595'
	},
	{
		name: 'Sasha Ho',
		mobile: '9833097596'
	},
	{
		name: 'Abdullah Hadley',
		mobile: '9833097597'
	},
	{
		name: 'Thomas Stock',
		mobile: '9833097598'
	},
	{
		name: 'Veeti Seppanen',
		mobile: '9833097599'
	}
];
