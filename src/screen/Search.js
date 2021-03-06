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
import { TouchableHighlight } from 'react-native-gesture-handler';
import { SERVER_MOVIE_API_URL, FLICKSICK_IMAGE_URL, TMDB_IMAGE_URL } from './utils/constants';
import GlobalStyles from './GlobalStyles';

const categoryData = ['All', 'Action', 'comady', 'mystery', 'romcom', 'Action', 'comady', 'mystery', 'romcom'];

const Search = (props) => {
	const { navigation } = props;
	const [searchText, setSearchText] = useState('');
	const [startId, setStartId] = useState('0');
	const [endId, setEndId] = useState('0');
	const [movieDataArray, setMovieDataArray] = useState([]);
	const [showMovieDataArray, setShowMovieDataArray] = useState([]);
	const [loadingMore, setLoadingMore] = useState(false);
	const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [fsId, setFSId] = useState(null);
	const [movieTitle, setMovieTitle] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [genres, setGenres] = useState('all');
	const [releaseDate, setReleaseDate] = useState('all');
	const [loading, setLoading] = useState(false);
	const [releaseDateArray, setReleaseDateArray] = useState([]);
	const [genresObj, setGenresObj] = useState([]);
	const [genresArray, setGenresArray] = useState([]);

	const setSearchTerm = (text) => {
		setLoading(false);
		setSearchText(text);
		if (text.length === 0) {
			setShowMovieDataArray(movieDataArray);
		}
	};

	const searchFilterFunction = () => {
		// Check if searched text is not blank
		console.log(searchText);
		if (searchText.length > 1) {
			setGenres('all')
			setReleaseDate('all')
			searchMovie(searchText);
		} else {
			// Inserted text is blank
			// Update FilteredDataSource with masterDataSource
			setShowMovieDataArray(movieDataArray);
		}
	};

	const searchMovie = (titleX) => {
		setLoading(true);
		const obj = {
			title: titleX
		};
		axios(SERVER_MOVIE_API_URL + '/searchMovieByTitle', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				console.log(response.data.length);
				const result = response.data;
				// if (response.data.length > 0) {

				setShowMovieDataArray(result);
				// }
				setLoading(false);
				console.log('setLoading false1');
				setRefreshing(false);
			},
			(error) => {
				setLoading(false);
				console.log(error);
			}
		);
	};

	// const fetchResultByCategory = categoryX => {

	// }
	const setGenresX = (item) => {
		setGenres(item);
		setSearchText('')
	}
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
				<TouchableHighlight onPress={() => setGenresX(item)}>
					{item.toString().toUpperCase() === genres.toUpperCase() ? (
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					) : (
						<Text style={{ color: '#808080', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					)}
				</TouchableHighlight>
			</View>
		);
	};


	const setReleaseDateX = (item) => {
		setReleaseDate(item);
		setSearchText('')
	}

	const renderReleaseDate = ({ item }) => {
		// console.log(item);
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					marginRight: 20
				}}
			>
				<TouchableHighlight onPress={() => setReleaseDateX(item)}>
					{item.toString().toUpperCase() === releaseDate.toString().toUpperCase() ? (
						<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					) : (
						<Text style={{ color: '#808080', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					)}
				</TouchableHighlight>
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

	useEffect(
		() => {
			setLoading(true);
			console.log('setLoading true');
			if (
				genres.toUpperCase() !== 'all'.toUpperCase() ||
				releaseDate.toString().toUpperCase() !== 'all'.toUpperCase()
			) {
				console.log('change');
				console.log(genres);
				setStartId(0);
				// setEndId(0);
				// console.log('showMovieDataArray', JSON.stringify(showMovieDataArray));
				showMovieDataArray.splice(0, showMovieDataArray.length); // just to refresh the screen
				movieDataArray.splice(0, movieDataArray.length); // just to refresh the screen
				// movieDataArray = [];
				// setShowMovieDataArray([]);
				// setMovieDataArray([]);
			}
			// setLoading(false);
			// if (searchText.length === 0) {
			// 	fetchOnScrollDownMovies(0);
			// }

			fetchOnScrollDownMovies(0);
		},
		[genres, releaseDate]
	);

	const fetchOnScrollDownMovies = (startIdX) => {
		console.log("fetchOnScrollDownMovies")
		if (searchText && searchText.trim().length > 0) {
			setLoadingMore(false);
			setRefreshing(false);
			setLoading(false);
			return
		}
		setLoadingMore(true);
		console.log('startId: ', startIdX);
		const obj = {
			id: startIdX,
			genres: genres,
			releaseDate: releaseDate
		};
		axios(SERVER_MOVIE_API_URL + '/fetchOnScrollDownMovies', {
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
					const tempData = [...movieDataArray, ...result];
					setMovieDataArray(tempData);
					setShowMovieDataArray(tempData);
					setStartId(tempData[tempData.length - 1]._id); // start for next scroll down
					// setEndId(tempData[0]._id); // start for next pull down
				}
				setLoadingMore(false);
				setRefreshing(false);
				setLoading(false);
				console.log('setLoading false2');
			},
			(error) => {
				setLoadingMore(false);
				console.log(error);
			}
		);
	};

	const fetchOnScrollUpMovies = () => {
		console.log("fetchOnScrollUpMovies")
		// pull down
		if (searchText && searchText.trim().length > 0) {
			setLoadingMore(false);
			setRefreshing(false);
			setLoading(false);
			return
		}
		setRefreshing(true);
		const obj = {
			id: endId
		};
		axios(SERVER_MOVIE_API_URL + '/fetchOnScrollUpMovies', {
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
					const tempData = [...result, ...movieDataArray];
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
			fetchOnScrollDownMovies(startId);
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

	useEffect(() => {
		getUtilData();
	}, []);

	const getUtilData = () => {
		const obj = {
			id: '123'
		};
		axios(SERVER_MOVIE_API_URL + '/getUtilData', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		})
			.then((response) => {
				const result = response.data;
				// console.log('years: ', result[0].years);
				setGenresObj(result[0].genres);
				setReleaseDateArray(['All', ...result[0].years]);
				const temp = Object.values(result[0].genres).sort();

				const arr = temp.filter(function (item) {
					return item.toUpperCase() !== 'Adult'.toUpperCase();
				});
				const xx = ['All', ...arr];
				setGenresArray(xx);
				// console.log(Object.values(result[0].genres));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<SafeAreaView style={GlobalStyles.droidSafeArea}>
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
					onChangeText={(text) => setSearchTerm(text)}
					value={searchText}
					underlineColorAndroid="transparent"
					placeholder="Search by moviex / series name or cast"
					// inlineImageLeft="search_icon"
					placeholderTextColor={'#A9A9A9'}
				/>
				{searchText ? (
					<View style={{ position: 'absolute', top: 7, right: 5 }}>
						<TouchableHighlight
							onPress={() => searchFilterFunction()}
							style={{ backgroundColor: '#3CB371', borderRadius: 10 }}
						>
							<Text style={{ color: '#ffffff', padding: 8 }}>Search</Text>
						</TouchableHighlight>
					</View>
				) : (
					<View style={{ position: 'absolute', top: 15, right: 10 }}>
						<AntDesign name="search1" color={'#A9A9A9'} size={20} />
					</View>
				)}
			</View>
			<View style={{ marginLeft: 15, marginRight: 15, marginBottom: 15, marginTop: 2 }}>
				<FlatList
					horizontal
					data={genresArray}
					renderItem={(item) => renderCategoryItem(item)}
					keyExtractor={(item, index) => index.toString()}
				/>
				<View style={{ marginTop: 15 }} />
				<FlatList
					horizontal
					data={releaseDateArray}
					renderItem={(item) => renderReleaseDate(item)}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>

			{loading ? (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'rgba(0,0,0, .9)'
					}}
				>
					<ActivityIndicator animating size="large" color={'#fff'} />
					{/* <ActivityIndicator animating size="large" /> */}
				</View>
			) : showMovieDataArray && showMovieDataArray.length > 0 ? (
				<View style={{ flex: 1 }}>
					<FlatList
						removeClippedSubviews={true}
						data={showMovieDataArray}
						// renderItem={(item) => renderMovieItem(item)}
						renderItem={(item) => renderMovieItem(item)}
						keyExtractor={(item, index) => index.toString()}
						onEndReached={() => handleLoadMore()}
						onEndReachedThreshold={0.5}
						initialNumToRender={10}
						ListFooterComponent={renderFooter}
						numColumns={2}
						onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
						// scrollEnabled={!loadingMore}
						extraData={showMovieDataArray}
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
				</View>
			) : (
				<View style={{ justifyContent: 'center', flex: 1 }}>
					<Text style={{ color: '#DCDCDC', textAlign: 'center', fontSize: 16 }}>
						Sorry !!! no movie for <Text style={{ color: '#F4A460' }}>{genres}</Text> category
					</Text>
				</View>
			)}
			<SeenModal
				fsId={fsId}
				movieTitle={movieTitle}
				userId={props.userDetails && props.userDetails.id}
				mobile={props.userDetails && props.userDetails.mobile}
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
