import React, { useEffect, useState, useRef } from 'react';
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
	TextInput
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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
import { setTrendingTodayX, setDataFor } from '../reducers/Action';
import FlatListStrip from './FlatListStrip';

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

const categoryData = [ 'All', 'Action', 'comady', 'mystery', 'romcom', 'Action', 'comady', 'mystery', 'romcom' ];

const Friends = (props) => {
	const { navigation } = props;
	const [ search, setSearch ] = useState('');
	const [ selectedFriendMobile, setSelectedFriendMobile ] = useState(null);
	const [ selectedFriendName, setSelectedFriendName ] = useState('All Friends');
	const [ borderColor, setBorderColor ] = useState('#fff');
	const [ borderWidth, setBorderWidth ] = useState(null);

	const displayFriendMovieList = (item) => {
		if (selectedFriendMobile !== item.mobile) {
			setSelectedFriendMobile(item.mobile);
			setSelectedFriendName(item.name);
		} else {
			setSelectedFriendMobile(null);
			setSelectedFriendName('All Friends');
		}
	};

	const renderFriendsList = ({ item }) => {
		console.log('Item:  ', item);
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
								{'+91 ' + item.mobile}
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
					<View>
						<MaterialCommunityIcons name="chevron-down" color={'#A9A9A9'} size={26} />
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const searchFilterFunction = (text) => {
		// Check if searched text is not blank
		if (text) {
			// Inserted text is not blank
			// Filter the masterDataSource and update FilteredDataSource
			//   const newData = props.residentialPropertyList.filter(function(item) {
			//     // Applying filter for the inserted text in search bar
			//     const itemData =
			//       item.property_address.building_name +
			//       item.property_address.landmark_or_street +
			//       item.property_address.location_area +
			//       item.owner_details.name +
			//       item.owner_details.mobile1;
			//     const textData = text.toUpperCase();
			//     return itemData.toUpperCase().indexOf(textData) > -1;
			//   });
			//   setData(newData);
			//   setSearch(text);
		} else {
			// Inserted text is blank
			// Update FilteredDataSource with masterDataSource
			//   setData(props.residentialPropertyList);
			//   setSearch(text);
		}
	};

	const renderCategoryItem = ({ item }) => {
		console.log(item);
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					marginRight: 10,
					marginLeft: 10
				}}
			>
				<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{item}</Text>
			</View>
		);
	};

	const renderMovieItemX = ({ item }) => {
		console.log('Item:  ', item.poster_path);
		return (
			<TouchableOpacity
				activeOpacity={1}
				// style={styles.slideInnerContainer}
				onPress={() => myNavigation(item.id)}
			>
				<View style={{ marginLeft: 5, flex: 1 }}>
					<Image
						source={{
							uri: 'https://image.tmdb.org/t/p/w300' + item.poster_path
						}}
						style={{ width: 160, height: 200, alignSelf: 'center' }}
						resizeMode={'cover'}
					/>
					<View
						style={{
							position: 'absolute',
							// top: 0,
							// right: 0,
							// height: 100,
							// width: 70,
							backgroundColor: 'rgba(0,0,0, .3)',
							// borderTopRightRadius: 10,
							// borderBottomRightRadius: 10,
							// flexDirection: "row",
							// justifyContent: "space-between",
							// padding: 5,
							// bo
							// paddingLeft: 15,
							// paddingRight: 15
							width: '100%',
							height: '100%'
						}}
					>
						<View
							style={{
								position: 'absolute',
								flex: 1,
								top: 0,
								right: 0,
								flexDirection: 'row',
								// backgroundColor: "rgba(0,0,0, .3)",
								padding: 5
							}}
						>
							<AntDesign name="hearto" color={'red'} size={18} />
							<View style={{ marginLeft: 5 }} />
							<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>90%</Text>
						</View>
						{/* <View style={{ flexDirection: "row" }}>
            <AntDesign name="eyeo" color={"#fff"} size={20} />
            <View style={{ marginLeft: 5 }} />
            <Text style={{ color: "#fff" }}>100</Text>
          </View> */}
						{/* <View style={{ flexDirection: "row" }}>
            <Entypo name="list" color={"#fff"} size={20} />
            <View style={{ marginLeft: 5 }} />
            <Text style={{ color: "#fff" }}>250</Text>
          </View> */}
					</View>
					<View style={{ position: 'absolute', bottom: 5, left: 5 }}>
						<Text
							style={{
								color: '#fff',
								fontSize: 12,
								fontWeight: '500',
								textTransform: 'capitalize'
							}}
						>
							{item.media_type && item.media_type.toUpperCase() === 'tv'.toUpperCase() ? (
								'Series'
							) : (
								item.media_type
							)}
						</Text>
					</View>
					<View
						style={{
							position: 'absolute',
							bottom: 0,
							right: 0,
							borderColor: 'rgba(211,211,211, .6)',
							borderWidth: 1,
							padding: 3,
							borderRadius: 5,
							backgroundColor: 'rgba(0,0,0, .4)',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<Text
							style={{
								color: '#fff',
								fontSize: 10,
								fontWeight: '500',
								textTransform: 'capitalize'
							}}
						>
							Seen |
						</Text>
						<Ionicons name="checkmark" color={'#00FF00'} size={12} />
					</View>
				</View>
			</TouchableOpacity>
		);
	};

	const renderMovieItem = ({ item }) => {
		console.log('ItemX:  ', item.poster_path);
		return (
			<TouchableOpacity
				activeOpacity={1}
				// style={styles.slideInnerContainer}
				onPress={() => myNavigation(item.fs_id)}
			>
				<View style={{ marginLeft: 5, flex: 1 }}>
					<Image
						source={{
							uri: 'https://image.tmdb.org/t/p/w300' + item.poster_path
						}}
						style={{ width: 160, height: 200, alignSelf: 'center' }}
						resizeMode={'cover'}
					/>
					<View
						style={{
							position: 'absolute',
							// top: 0,
							// right: 0,
							// height: 100,
							// width: 70,
							backgroundColor: 'rgba(0,0,0, .3)',
							// borderTopRightRadius: 10,
							// borderBottomRightRadius: 10,
							// flexDirection: "row",
							// justifyContent: "space-between",
							// padding: 5,
							// bo
							// paddingLeft: 15,
							// paddingRight: 15
							width: '100%',
							height: '100%'
						}}
					>
						<View
							style={{
								position: 'absolute',
								flex: 1,
								top: 0,
								right: 0,
								flexDirection: 'row',
								// backgroundColor: "rgba(0,0,0, .3)",
								padding: 5
							}}
						>
							<AntDesign name="hearto" color={'red'} size={18} />
							<View style={{ marginLeft: 5 }} />
							<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>90%</Text>
						</View>
					</View>
					<View style={{ position: 'absolute', bottom: 5, left: 5 }}>
						<Text
							style={{
								color: '#fff',
								fontSize: 12,
								fontWeight: '500',
								textTransform: 'capitalize'
							}}
						>
							{item.media_type && item.media_type.toUpperCase() === 'tv'.toUpperCase() ? (
								'Series'
							) : (
								item.media_type
							)}
						</Text>
					</View>
					<TouchableOpacity
						onPress={() => openRating(item.fs_id)}
						style={{
							flexDirection: 'row',
							justifyContent: 'center'
						}}
					>
						<View
							style={{
								position: 'absolute',
								bottom: 0,
								right: 0,
								borderColor: 'rgba(211,211,211, .6)',
								borderWidth: 1,
								padding: 3,
								borderRadius: 5,
								backgroundColor: 'rgba(0,0,0, .4)',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<Text
								style={{
									color: '#fff',
									fontSize: 10,
									fontWeight: '500',
									textTransform: 'capitalize'
								}}
							>
								Seen |
							</Text>
							<Ionicons name="checkmark" color={'#00FF00'} size={12} />
						</View>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
	};

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
						backgroundColor: '#000'
					}}
					onChangeText={(text) => searchFilterFunction(text)}
					value={search}
					underlineColorAndroid="transparent"
					placeholder="Search by name or mobile"
					inlineImageLeft="search_icon"
					placeholderTextColor={'#A9A9A9'}
				/>
				<View style={{ position: 'absolute', top: 15, right: 10 }}>
					<AntDesign name="search1" color={'#7CFC00'} size={20} />
				</View>
			</View>
			<View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginTop: 10, marginBottom: 0 }}>
				<Text style={{ color: '#F5F5F5', fontSize: 18, fontWeight: '600', width: '25%' }} numberOfLines={1}>
					{selectedFriendName}
				</Text>
				<Text style={{ color: '#F5F5F5', fontSize: 16, fontWeight: '500' }}>| </Text>
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

			<ScrollView>
				<View>
					<FlatList
						// horizontal
						data={dataX}
						//data defined in constructor
						// ItemSeparatorComponent={ItemSeparatorView}
						//Item Separator View
						renderItem={(item) => renderFriendsList(item)}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	trendingToday: state.AppReducer.trendingToday,
	trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	// trendingToday: state.AppReducer.trendingToday,
	// trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	fsIdToGetDetails: state.AppReducer.fsIdToGetDetails
});

// const mapDispatchToProps = () => ({
//   setTrendingTodayX,
//   setTrendingCurrentWeekY,
// });
const mapDispatchToProps = {
	setTrendingTodayX,
	setDataFor
};
export default connect(mapStateToProps, mapDispatchToProps)(Friends);
