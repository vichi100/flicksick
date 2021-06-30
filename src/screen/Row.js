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
	TextInput,
	ActivityIndicator,
	RefreshControl
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import * as Font from 'expo-font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { connect } from 'react-redux';
import { setTrendingTodayX, setDataFor, setFSIdToGetDetails, setMovieDetails } from '../reducers/Action';
import { SERVER_URL, FLICKSICK_IMAGE_URL, TMDB_IMAGE_URL } from './utils/constants';
import { getFSMovieRating } from './utils/methods';

const Row = (props) => {
	const { item, navigation } = props;

	const openRating = (movie) => {
		// console.log('rating');
		props.setModalVisible(true);
		props.setFSId(movie.fs_id);
		props.setMovieTitle(movie.title);
	};

	const myNavigation = (fsId, movieData) => {
		// console.log(fsId);
		props.setFSIdToGetDetails(fsId);
		props.setMovieDetails(movieData);
		navigateTo();
	};

	const navigateTo = () => {
		navigation.navigate('MovieDetails');
	};

	return (
		<TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => myNavigation(item.fs_id, item)}>
			<View style={{ marginLeft: 5, marginBottom: 5 }}>
				<Image
					source={{
						uri:
							item.poster_path.indexOf('image') > -1
								? FLICKSICK_IMAGE_URL + item.poster_path
								: TMDB_IMAGE_URL + item.poster_path
					}}
					// style={{ width: '100%', height: '100%' }}
					style={{ width: '100%', height: 230, alignSelf: 'center' }}
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
						<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
							{getFSMovieRating(item).loved_it}%
						</Text>
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
					onPress={() => openRating(item)}
					style={{
						flexDirection: 'row',
						justifyContent: 'center'
					}}
				>
					<View
						style={{
							position: 'absolute',
							bottom: 3,
							right: 3,
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
						<Text
							style={{
								color: '#00FF00',
								fontSize: 10,
								fontWeight: '700',
								textTransform: 'capitalize'
							}}
						>
							{' ?'}
						</Text>
						{/* <Ionicons name="checkmark" color={'#00FF00'} size={12} /> */}
					</View>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);
};

// export default Row;
const mapStateToProps = (state) => ({
	trendingToday: state.AppReducer.trendingToday,
	trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	fsIdToGetDetails: state.AppReducer.fsIdToGetDetails,
	userDetails: state.AppReducer.userDetails
});

const mapDispatchToProps = {
	setTrendingTodayX,
	setDataFor,
	setFSIdToGetDetails,
	setMovieDetails
};
export default connect(mapStateToProps, mapDispatchToProps)(Row);
