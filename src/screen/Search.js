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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import * as Font from 'expo-font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousel, { Pagination } from './react-native-snap-carousel/index';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import SliderEntry from './components/SliderEntry';
import styles, { colors } from './styles/index.style';
import { ENTRIES1, ENTRIES2 } from './static/entries';
import { scrollInterpolators, animatedStyles } from './utils/animations';
import axios from 'axios';
import { connect } from 'react-redux';
import { setTrendingTodayX, setDataFor, setTMDBIdToGetDetails } from '../reducers/Action';

const categoryData = [ 'All', 'Action', 'comady', 'mystery', 'romcom', 'Action', 'comady', 'mystery', 'romcom' ];

const Search = (props) => {
	const [ search, setSearch ] = useState('');

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
					marginRight: 20
				}}
			>
				<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{item}</Text>
			</View>
		);
	};

	const renderItem = ({ item }) => {
		// console.log("Item:  ", item.illustration);
		return (
			<TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => myNavigation(item.id)}>
				<View style={{ marginLeft: 5, width: '100%', height: 270 }}>
					<Image
						source={{
							uri: 'https://image.tmdb.org/t/p/w300' + item.poster_path
						}}
						style={{ width: '100%', height: '100%' }}
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
					placeholder="Search by movie / series name or cast"
					inlineImageLeft="search_icon"
					placeholderTextColor={'#A9A9A9'}
				/>
				<View style={{ position: 'absolute', top: 15, right: 10 }}>
					<AntDesign name="search1" color={'#7CFC00'} size={20} />
				</View>
			</View>
			<View style={{ flexDirection: 'row', margin: 15 }}>
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
			<View>
				<FlatList
					// horizontal
					data={props.trendingCurrentWeek}
					//data defined in constructor
					// ItemSeparatorComponent={ItemSeparatorView}
					//Item Separator View
					renderItem={(item) => renderItem(item)}
					keyExtractor={(item, index) => index.toString()}
					numColumns={2}
				/>
			</View>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	trendingToday: state.AppReducer.trendingToday,
	trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	tmdbIdToGetDetails: state.AppReducer.tmdbIdToGetDetails
});

// const mapDispatchToProps = () => ({
//   setTrendingTodayX,
//   setTrendingCurrentWeekY,
// });
const mapDispatchToProps = {
	setTrendingTodayX,
	setDataFor,
	setTMDBIdToGetDetails
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
