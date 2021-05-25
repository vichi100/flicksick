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
import { setTrendingTodayX, setDataFor, setFSIdToGetDetails } from '../reducers/Action';
import Row from './Row';
import SeenModal from './SeenModal';

const categoryData = [ 'All', 'Action', 'comady', 'mystery', 'romcom', 'Action', 'comady', 'mystery', 'romcom' ];

const Search = (props) => {
	const { navigation } = props;
	const [ search, setSearch ] = useState('');
	const [ startId, setStartId ] = useState('0');
	const [ endId, setEndId ] = useState('0');
	const [ movieDataArray, setMovieDataArray ] = useState([]);
	const [ showMovieDataArray, setShowMovieDataArray ] = useState([]);
	const [ loadingMore, setLoadingMore ] = useState(false);
	const [ onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum ] = useState(true);
	const [ refreshing, setRefreshing ] = useState(false);
	const [ fsId, setFSId ] = useState(null);
	const [ movieTitle, setMovieTitle ] = useState(null);
	const [ modalVisible, setModalVisible ] = useState(false);

	const searchFilterFunction = (text) => {
		// Check if searched text is not blank
		console.log(text);
		if (text.length > 1) {
			searchMovie(text);
			setSearch(text);
		} else {
			// Inserted text is blank
			// Update FilteredDataSource with masterDataSource
			setShowMovieDataArray(movieDataArray);
			setSearch(text);
		}
	};

	const searchMovie = (titleX) => {
		setLoadingMore(true);
		const obj = {
			title: titleX
		};
		axios('http://192.168.0.100:3000/searchMovieByTitle', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				console.log(response.data.length);
				if (response.data.length > 0) {
					const result = response.data;
					setShowMovieDataArray(result);
				}
				setLoadingMore(false);
				setRefreshing(false);
			},
			(error) => {
				setLoadingMore(false);
				console.log(error);
			}
		);
	};

	const renderCategoryItem = ({ item }) => {
		// console.log(item);
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

	const renderMovieItemX = ({ item }) => {
		// console.log("Item:  ", item.illustration);
		return (
			<TouchableOpacity activeOpacity={1} style={{ flex: 1 }} onPress={() => myNavigation(item.id)}>
				<View style={{ marginLeft: 5, marginBottom: 5 }}>
					<Image
						source={{
							uri: 'https://image.tmdb.org/t/p/w300' + item.poster_path
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

	const renderMovieItem = ({ item }) => {
		return (
			<Row
				item={item}
				setFSId={(id) => setFSId(id)}
				setMovieTitle={(title) => setMovieTitle(title)}
				setModalVisible={(flag) => setModalVisible(flag)}
				navigation={navigation}
			/>
		);
	};

	useEffect(() => {
		if (search.length === 0) {
			fetchOnScrollDownMovies();
		}
	}, []);

	const fetchOnScrollDownMovies = () => {
		setLoadingMore(true);
		const obj = {
			id: startId
		};
		axios('http://192.168.0.100:3000/fetchOnScrollDownMovies', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				console.log(response.data.length);
				if (response.data.length > 0) {
					const result = response.data;
					const tempData = [ ...movieDataArray, ...result ];
					setMovieDataArray(tempData);
					setShowMovieDataArray(tempData);
					setStartId(tempData[tempData.length - 1]._id); // start for next scroll down
					setEndId(tempData[0]._id); // start for next pull down
				}
				setLoadingMore(false);
				setRefreshing(false);
			},
			(error) => {
				setLoadingMore(false);
				console.log(error);
			}
		);
	};

	const fetchOnScrollUpMovies = () => {
		// pull down
		setRefreshing(true);
		const obj = {
			id: endId
		};
		axios('http://192.168.0.100:3000/fetchOnScrollUpMovies', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				console.log(response.data.length);
				if (response.data.length > 0) {
					const result = response.data;
					if (movieDataArray.length > 25) {
						movieDataArray.splice(movieDataArray.length - 25, movieDataArray.length);
					}
					const tempData = [ ...result, ...movieDataArray ];
					setMovieDataArray(tempData);
					setStartId(tempData[tempData.length - 1]._id);
					setEndId(tempData[0]._id);
				}
				// setLoadingMore(false);
				setRefreshing(false);
			},
			(error) => {
				setRefreshing(false);
				console.log(error);
			}
		);
	};

	const handleLoadMore = () => {
		// console.log(handleLoadMore);
		// setLoadingMore(true);

		if (!onEndReachedCalledDuringMomentum && !loadingMore) {
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

	const handleRefresh = () => {
		setRefreshing(true);
		fetchOnScrollUpMovies();
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
						backgroundColor: '#000',
						color: '#A9A9A9'
					}}
					onChangeText={(text) => searchFilterFunction(text)}
					value={search}
					underlineColorAndroid="transparent"
					placeholder="Search by movie / series name or cast"
					inlineImageLeft="search_icon"
					placeholderTextColor={'#A9A9A9'}
				/>
				<View style={{ position: 'absolute', top: 15, right: 10 }}>
					<AntDesign name="search1" color={'#A9A9A9'} size={20} />
				</View>
			</View>
			<View style={{ flexDirection: 'row', marginLeft: 15, marginRight: 15, marginBottom: 15, marginTop: 2 }}>
				<FlatList
					horizontal
					data={categoryData}
					renderItem={(item) => renderCategoryItem(item)}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>

			<FlatList
				removeClippedSubviews={true}
				data={showMovieDataArray}
				// renderItem={(item) => renderMovieItem(item)}
				renderItem={(item) => renderMovieItem(item)}
				keyExtractor={(item, index) => index.toString()}
				onEndReached={() => handleLoadMore()}
				onEndReachedThreshold={0}
				initialNumToRender={10}
				ListFooterComponent={renderFooter}
				numColumns={2}
				onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
				scrollEnabled={!loadingMore}
				// refreshControl={
				// 	<RefreshControl
				// 		refreshing={refreshing}
				// 		onRefresh={handleRefresh}
				// 		tintColor={'#fff'}
				// 		// colors={[ 'gray', 'orange' ]}
				// 	/>
				// }
				// onRefresh={() => handleRefresh()}
				// refreshing={refreshing}
				// enabled={true}
			/>
			<SeenModal
				fsId={fsId}
				movieTitle={movieTitle}
				userId={props.userDetails.id}
				mobile={props.userDetails.mobile}
				modalVisible={modalVisible}
				setModalVisible={(vFlag) => setModalVisible(vFlag)}
				navigation={navigation}
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	trendingToday: state.AppReducer.trendingToday,
	trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	fsIdToGetDetails: state.AppReducer.fsIdToGetDetails,
	userDetails: state.AppReducer.userDetails
});

// const mapDispatchToProps = () => ({
//   setTrendingTodayX,
//   setTrendingCurrentWeekY,
// });
const mapDispatchToProps = {
	setTrendingTodayX,
	setDataFor,
	setFSIdToGetDetails
};
export default connect(mapStateToProps, mapDispatchToProps)(Search);
