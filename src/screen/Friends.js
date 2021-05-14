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

const dataX = [
	{
		name: 'Miyah Myles',
		mobile: '9833097595'
	},
	{
		name: 'June Cha',
		mobile: '9833097595'
	},
	{
		name: 'Iida Niskanen',
		mobile: '9833097595'
	},
	{
		name: 'Renee Sims',
		mobile: '9833097595'
	},
	{
		name: 'Jonathan Nu\u00f1ez',
		mobile: '9833097595'
	},
	{
		name: 'Sasha Ho',
		mobile: '9833097595'
	},
	{
		name: 'Abdullah Hadley',
		mobile: '9833097595'
	},
	{
		name: 'Thomas Stock',
		mobile: '9833097595'
	},
	{
		name: 'Veeti Seppanen',
		mobile: '9833097595'
	},
	{
		name: 'Bonnie Riley',
		mobile: '9833097595'
	}
];

const Friends = (props) => {
	const [ search, setSearch ] = useState('');

	const renderItem = ({ item }) => {
		console.log('Item:  ', item.name);
		return (
			<TouchableOpacity
				activeOpacity={1}
				// style={styles.slideInnerContainer}
				onPress={() => navigateTo()}
			>
				<View style={{ marginTop: 10 }} />

				<View
					style={{
						borderColor: 'rgba(105,105,105, .4)',
						borderWidth: 0.3,
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

	return (
		<SafeAreaView style={{ backgroundColor: 'rgba(0,0,0, .9)', flex: 1 }}>
			<View style={{ marginBottom: 5 }}>
				<TextInput
					style={{
						width: '98%',
						height: 40,
						borderWidth: 1,
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
			<ScrollView>
				<View>
					<FlatList
						// horizontal
						data={dataX}
						//data defined in constructor
						// ItemSeparatorComponent={ItemSeparatorView}
						//Item Separator View
						renderItem={(item) => renderItem(item)}
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
	tmdbIdToGetDetails: state.AppReducer.tmdbIdToGetDetails
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
