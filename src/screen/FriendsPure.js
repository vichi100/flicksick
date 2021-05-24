import React, { useEffect, useState, useRef, Component, PureComponent } from 'react';
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
	TextInput,
	RefreshControl
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import * as Font from 'expo-font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Carousel, { Pagination } from './react-native-snap-carousel/index';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import SliderEntry from './components/SliderEntry';
import styles, { colors } from './styles/index.style';
import { ENTRIES1, ENTRIES2 } from './static/entries';
import { scrollInterpolators, animatedStyles } from './utils/animations';
import axios from 'axios';
import { connect } from 'react-redux';
import { setTrendingTodayX, setDataFor, setUserContactDict } from '../reducers/Action';
import FlatListStrip from './FlatListStrip';
import * as Contacts from 'expo-contacts';
import FriendsDisplay from './FriendsDisplay';

const categoryData = [ 'All', 'Action', 'comady', 'mystery', 'romcom', 'Action', 'comady', 'mystery', 'romcom' ];

class FriendsPure extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			selectedFriendName: 'All Friends',
			selectedFriendMobile: null,
			contactData: null,
			contactObjDict: {},
			allFriendsDataArray: [],
			allFriendsDataArrayMain: []
		};
	}

	displayFriendMovieList = (item) => {
		console.log(item);
		if (this.state.selectedFriendMobile !== item.mobile) {
			this.setState({ selectedFriendMobile: item.mobile });
			this.setState({ selectedFriendName: item.name });
		} else {
			this.setState({ selectedFriendMobile: null });
			this.setState({ selectedFriendName: 'All Friends' });
		}
	};

	rowItem = ({ item }) => {
		return <FriendsDisplay item={item} displayFriendMovieList={(item) => this.displayFriendMovieList(item)} />;
	};

	rowKeyExt = (item) => item.mobile;

	renderCategoryItem = ({ item }) => {
		// console.log(item);
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					marginRight: 10,
					marginLeft: 10,
					marginTop: 10,
					marginBottom: 10
					// borderColor: '#fff',
					// borderWidth: 0.3,
					// borderRadius: 10
				}}
			>
				<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500', padding: 0 }}>{item}</Text>
			</View>
		);
	};

	componentDidMount = () => {
		if (this.props.userDetails) {
			(async () => {
				const { status } = await Contacts.requestPermissionsAsync();
				if (status === 'granted') {
					const { data } = await Contacts.getContactsAsync({
						fields: [ Contacts.Fields.PhoneNumbers ]
					});
					// console.log(data.length);
					if (data.length > 0) {
						this.setState({ contactData: data });
					}
				}
			})();
		}
	};

	componentDidMount = () => {
		if (this.state.contactData && this.props.userDetails) {
			contactData.map((item) => {
				createContactDict(item);
			});
			saveNewContact();
		}
	};

	createContactDict = (item) => {
		if (item['phoneNumbers'] && item['phoneNumbers'][0]) {
			// console.log(item['phoneNumbers'][0].number);
			const name = item.name;
			var mobile = item['phoneNumbers'][0].number.replace(/ /g, '');
			mobile = mobile.replace(/-/g, '');
			const countryCode = item['phoneNumbers'][0].countryCode;

			if (mobile.length >= 10) {
				if (mobile.indexOf('+') > -1) {
					// console.log(mobile);
					this.state.contactObjDict[mobile] = name;
				} else {
					if (mobile.length > 10) {
						const lenX = mobile.length;
						var temp = mobile.slice(lenX - 10, lenX);
						// console.log('+91' + temp);
						this.state.contactObjDict['+91' + temp] = name;
					}
				}
			}
			// console.log(Object.keys(contactObjDict).length);
		}
	};

	saveNewContact = () => {
		const obj = {
			id: this.props.userDetails.mobile,
			contact_dict: this.state.contactObjDict
		};
		axios('http://192.168.0.100:3000/saveNewContact', {
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

	componentDidMount = () => {
		this.getFriendsData();
	};

	getFriendsData = () => {
		const obj = {
			id: this.props.userDetails.mobile
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
						this.createFriendsDataArray(result.friends_on, 'on', allFriendsDataArrayX);
					}

					// setFriendOff(result.friends_off);
					if (result.friends_off) {
						this.createFriendsDataArray(result.friends_off, 'off', allFriendsDataArrayX);
					}

					// setFriendBlocked(result.friends_blocked);
					if (result.friends_blocked) {
						this.createFriendsDataArray(result.friends_blocked, 'blocked', allFriendsDataArrayX);
					}
				} else {
					// setFriendOff(contactObjDict);
					createFriendsDataArray(this.state.contactObjDict, 'off', allFriendsDataArrayX);
				}
				this.setState({ allFriendsDataArray: allFriendsDataArrayX });
				this.setState({ allFriendsDataArrayMain: allFriendsDataArrayX });
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

	createFriendsDataArray = (dictData, status, allFriendsDataArrayX) => {
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

	render() {
		const { navigation } = this.props;
		return (
			<SafeAreaView style={{ backgroundColor: 'rgba(0,0,0, .9)', flex: 1 }}>
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
						value={'search'}
						underlineColorAndroid="transparent"
						placeholder="Search by name or mobile"
						inlineImageLeft="search_icon"
						placeholderTextColor={'#A9A9A9'}
					/>
					<View style={{ position: 'absolute', top: 15, right: 10 }}>
						<AntDesign name="search1" color={'#A9A9A9'} size={20} />
					</View>
				</View>
				<View
					style={{ flexDirection: 'column', marginLeft: 15, marginRight: 15, marginTop: 0, marginBottom: 0 }}
				>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
						<Text
							style={{ color: '#20B2AA', fontSize: 18, fontWeight: '600' }}
							// numberOfLines={1}
						>
							{this.state.selectedFriendName}
						</Text>
						{this.state.selectedFriendName === 'All Friends' ? null : (
							<Text style={{ color: '#F5F5F5', fontSize: 14, fontWeight: '600' }}>All</Text>
						)}
					</View>

					{/* <Text style={{ color: '#F5F5F5', fontSize: 16, fontWeight: '500' }}>| </Text> */}
					<View
						style={{
							borderColor: '#fff',
							borderWidth: 0,
							borderRadius: 10
						}}
					>
						<FlatList
							horizontal
							data={categoryData}
							//data defined in constructor
							// ItemSeparatorComponent={ItemSeparatorView}
							//Item Separator View
							renderItem={(item) => this.renderCategoryItem(item)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>

					{/* <Text style={{ color: '#F5F5F5', margin: 10 }}>Action</Text>
					<Text style={{ color: '#F5F5F5', margin: 10 }}>Crime</Text>
					<Text style={{ color: '#F5F5F5', margin: 10 }}>Mystery</Text>
					<Text style={{ color: '#F5F5F5', margin: 10 }}>RomCom</Text>
					<Text style={{ color: '#F5F5F5', margin: 10 }}>Sports</Text> */}
				</View>
				<View style={{ margin: 7 }} />

				<FlatListStrip
					data={this.props.trendingCurrentWeek}
					title={null}
					navigation={navigation}
					horizontalFlag={true}
					numColumns={1}
					imageHight={200}
					imageWidth={160}
				/>

				<ScrollView>
					<View>
						<FlatList
							// horizontal
							data={this.state.allFriendsDataArray}
							//data defined in constructor
							// ItemSeparatorComponent={ItemSeparatorView}
							//Item Separator View
							renderItem={this.rowItem}
							keyExtractor={this.rowKeyExt}
							// extraData={selectedFriendMobile}
							// onEndReached={handleLoadMore}
							// onEndReachedThreshold={0.5}
							// ListFooterComponent={() => loadingMore && <ListFooterComponent />}
						/>
					</View>
				</ScrollView>
			</SafeAreaView>
		);
	}
}

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
export default connect(mapStateToProps, mapDispatchToProps)(FriendsPure);
