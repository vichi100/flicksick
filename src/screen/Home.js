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
	TouchableHighlight,
	ActivityIndicator,
	Dimensions
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
import axios from 'axios';
import { connect } from 'react-redux';
import { setTrending, setMovieByFriend, setFSIdToGetDetails, setUtilData, setSeenMovies } from '../reducers/Action';
import FlatListStrip from './FlatListStrip';
import * as Contacts from 'expo-contacts';
import { SERVER_MOVIE_API_URL } from './utils/constants';
// import {setDataFor} from "../reducers/Action"

// https://entertainmenthub.netlify.app/

// https://api.themoviedb.org/3/trending/all/day?api_key=26ba5e77849587dbd7df199727859189&page=1

// /fPGeS6jgdLovQAKunNHX8l0avCy.jpg

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const Home = (props) => {
	var num = 0;
	const { navigation } = props;
	const [ slider1ActiveSlide, setSlider1ActiveSlide ] = useState(SLIDER_1_FIRST_ITEM);
	const carouselRef = useRef(null);
	const [ homeData, setHomeData ] = useState(null);
	const [ loading, setLoading ] = useState(false);
	const [ releaseDate, setReleaseDate ] = useState(new Date().getFullYear());
	const [ yearsArray, setYearsArray ] = useState([]);
	const [ topMoviesOfTheYear, setTopMoviesOfTheYear ] = useState([]);
	const [ loadingTop, setLoadingTop ] = useState(false);
	const [ category, setCategory ] = useState('RomCom');
	const [ movieByCategory, setMovieByCategory ] = useState([]);
	const [ loadingCategoryMovies, setLoadingCategoryMovies ] = useState(false);
	const [ categoryMappingData, setCategoryMappingData ] = useState([]);
	const [ categoryNamesArray, setCategoryNamesArray ] = useState([]);

	const flatListRef = useRef(null);
	const movieCategoryRef = useRef(null);

	const setSlider1ActiveSlideX = (index) => {
		setSlider1ActiveSlide(index);
	};

	const navigateTo = (destination) => {
		navigation.navigate(destination);
	};

	const _renderItem = ({ item, index }) => {
		return (
			<SliderEntry
				data={item}
				even={(index + 1) % 2 === 0}
				navigateTo={(destination) => navigateTo(destination)}
			/>
		);
	};

	const getHomeScreenData = () => {
		// console.log('getHomeScreenData called');
		const obj = {
			id: '123'
		};
		axios(SERVER_MOVIE_API_URL + '/getHomeScreenData', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log('response.data', response.data);
				setHomeData(response.data);
				props.setMovieByFriend(response.data[0].data);
				setLoading(false);
				// props.setTrendingTodayX(response.data['trending_today']);
				// props.setDataFor(response.data['trending_current_week']);
				// props.setTrendingTodayX(response.data['trending_today']);
				// props.setDataFor(response.data['trending_current_week']);
			},
			(error) => {
				console.log('getHomeScreenData: ', error);
				setLoading(false);
			}
		);
	};

	useEffect(() => {
		setLoading(true);
		getHomeScreenData();
		generateYearsBetween();
	}, []);

	const generateYearsBetween = (startYear = 1990, endYear) => {
		const endDate = endYear || new Date().getFullYear();
		let years = [];
		// console.log('endDate: ', endDate);
		while (startYear <= endDate) {
			years.push(startYear);
			startYear++;
		}
		const x = years.reverse();
		setYearsArray(x);
		return x;
	};

	useEffect(
		() => {
			// console.log('releaseDate: ', releaseDate);
			setLoadingTop(true);
			getTopMoviesOfTheYear(releaseDate);
		},
		[ releaseDate ]
	);

	const getTopMoviesOfTheYear = (releaseDate) => {
		const obj = {
			releaseDate: releaseDate
		};
		axios(SERVER_MOVIE_API_URL + '/getTopMoviesOfTheYear', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data);
				setTopMoviesOfTheYear(response.data);
				setLoadingTop(false);
			},
			(error) => {
				console.log('getTopMoviesOfTheYear: ', error);
				setLoading(false);
			}
		);
	};

	const scrollToIndex = (item) => {
		setReleaseDate(item);
		flatListRef.current.scrollToIndex({
			index:
				yearsArray.indexOf(item) < yearsArray.length - 1
					? yearsArray.indexOf(item) + 1
					: yearsArray.indexOf(item),
			animated: true,
			viewPosition: 0.5
		});
	};

	const renderReleaseDate = ({ item }) => {
		// console.log(item);
		return (
			<View
				style={{
					flex: 1,
					marginTop: 10,
					justifyContent: 'center',
					marginRight: 20,
					marginLeft: 20
				}}
			>
				<TouchableHighlight onPress={() => scrollToIndex(item)}>
					{item.toString().toUpperCase() === releaseDate.toString().toUpperCase() ? (
						<Text style={{ color: '#40E0D0', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					) : (
						<Text style={{ color: '#808080', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					)}
				</TouchableHighlight>
			</View>
		);
	};

	useEffect(() => {
		// console.log('getCategoryMappingData: ');
		getCategoryMappingData();
	}, []);

	const getCategoryMappingData = () => {
		const obj = {
			category: '-1'
		};
		axios(SERVER_MOVIE_API_URL + '/getUtilData', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data[0].category);
				const categoryDictArray = response.data[0].category;
				setCategoryMappingData(categoryDictArray);
				const categoryArray = [];
				categoryDictArray.map((item) => {
					const name = item.category;
					categoryArray.push(name);
				});
				// console.log(categoryArray);
				setCategoryNamesArray(categoryArray);
				props.setUtilData(response.data[0]);
			},
			(error) => {
				console.log('getCategoryMappingData: ', error);
				setLoading(false);
			}
		);
	};

	const scrollToIndexForMovieCategory = (item) => {
		// console.log('categoty2: ', categoryNamesArray.indexOf(item));
		setCategory(item);
		movieCategoryRef.current.scrollToIndex({
			index:
				categoryNamesArray.indexOf(item) < categoryNamesArray.length - 1
					? categoryNamesArray.indexOf(item) + 1
					: categoryNamesArray.indexOf(item),
			animated: true,
			viewPosition: 0.5
		});
	};
	const renderMovieCategory = ({ item }) => {
		// console.log(item);
		return (
			<View
				style={{
					flex: 1,
					marginTop: 15,
					justifyContent: 'center',
					marginRight: 20,
					marginLeft: 20,
					marginBottom: 3
				}}
			>
				<TouchableHighlight onPress={() => scrollToIndexForMovieCategory(item)}>
					{item.toString().toUpperCase() === category.toString().toUpperCase() ? (
						<Text style={{ color: '#40E0D0', fontSize: 18, fontWeight: '500' }}>{item}</Text>
					) : (
						<Text style={{ color: '#808080', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					)}
				</TouchableHighlight>
			</View>
		);
	};

	useEffect(
		() => {
			// console.log('category: ', categoryMappingData.length);
			if (category && categoryMappingData.length > 0) {
				setLoadingCategoryMovies(true);
				const categoryX = category;
				getMovieByCategory(categoryX);
			}
		},
		[ category, categoryMappingData ]
	);

	const getMovieByCategory = (categoryX) => {
		// console.log('getMovieByCategory: ', categoryX);
		var document = null;
		categoryMappingData.map((item) => {
			if (item.category === categoryX) {
				document = item.document;
			}
		});
		console.log('document: ', document);
		const obj = {
			category: categoryX,
			document: document
		};
		axios(SERVER_MOVIE_API_URL + '/getMovieByCategory', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data);
				setMovieByCategory(response.data);
				setLoadingCategoryMovies(false);
			},
			(error) => {
				console.log('getMovieByCategory: ', error);
				setLoading(false);
			}
		);
	};

	return loading ? (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0, .9)' }}>
			<ActivityIndicator animating size="large" color={'#fff'} />
			{/* <ActivityIndicator animating size="large" /> */}
		</View>
	) : (
		<SafeAreaView style={{ backgroundColor: 'rgba(0,0,0, .9)', flex: 1 }}>
			{homeData && homeData.length > 0 ? (
				<ScrollView>
					<View>
						<Text
							style={{
								color: '#DCDCDC',
								marginTop: 15,
								marginBottom: 10,
								textAlign: 'center',
								fontSize: 20,
								fontWeight: '600'
							}}
						>
							{homeData[0].title}
						</Text>
						<View style={{ flexDirection: 'column' }}>
							<View style={{}}>
								{/* <Text style={styles.title}>{`Example ${1}`}</Text>
          <Text style={styles.subtitle}>{"title"}</Text> */}
								<Carousel
									ref={carouselRef}
									data={homeData[0].data}
									renderItem={_renderItem}
									sliderWidth={sliderWidth}
									itemWidth={itemWidth}
									hasParallaxImages={true}
									firstItem={SLIDER_1_FIRST_ITEM}
									inactiveSlideScale={0.94}
									inactiveSlideOpacity={0.7}
									// inactiveSlideShift={20}
									containerCustomStyle={styles.slider}
									contentContainerCustomStyle={styles.sliderContentContainer}
									loop={true}
									loopClonesPerSide={2}
									autoplay={false}
									autoplayDelay={1000}
									autoplayInterval={5000}
									onSnapToItem={(index) => setSlider1ActiveSlideX(index)}
								/>
							</View>
						</View>
					</View>
					{homeData &&
						homeData.map((item) => {
							if (num === 0) {
								num = num + 1;
								return;
							}
							return (
								<FlatListStrip
									data={item.data}
									title={item.title}
									navigation={navigation}
									horizontalFlag={true}
									numColumns={1}
									imageHight={200}
									imageWidth={160}
								/>
							);
						})}

					<View>
						<View style={{ flexDirection: 'row', marginTop: 15 }}>
							<FlatList
								ref={movieCategoryRef}
								horizontal
								data={categoryNamesArray}
								renderItem={(item) => renderMovieCategory(item)}
								keyExtractor={(item, index) => index.toString()}
								snapToAlignment={'center'}
								// getItemLayout={(data, index) =>
								// 	// Max 5 items visibles at once
								// 	({
								// 		length: Dimensions.get('window').width / 5,
								// 		offset: Dimensions.get('window').width / 5 * index,
								// 		index
								// 	})}
								snapToInterval={Dimensions.get('window').width / 5}
							/>
						</View>
						{loadingCategoryMovies ? (
							<View
								style={{
									flex: 1,
									height: 200,
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: 'rgba(0,0,0, .9)'
								}}
							>
								<ActivityIndicator animating size="large" color={'#fff'} />
								{/* <ActivityIndicator animating size="large" /> */}
							</View>
						) : (
							<FlatListStrip
								data={movieByCategory}
								title={''}
								navigation={navigation}
								horizontalFlag={true}
								numColumns={1}
								imageHight={200}
								imageWidth={160}
							/>
						)}
					</View>

					<View>
						<View style={{ flexDirection: 'row', marginTop: 15 }}>
							<Text
								style={{
									color: '#DCDCDC',
									fontSize: 20,
									fontWeight: '500',
									marginTop: 10,
									// marginBottom: 10,
									marginLeft: 15,
									marginRight: 15,
									padding: 0,
									borderColor: '#fff'
								}}
							>
								Top Of the year
							</Text>
							<FlatList
								ref={flatListRef}
								horizontal
								data={yearsArray}
								snapToAlignment={'center'}
								getItemLayout={(data, index) =>
									// Max 5 items visibles at once
									({
										length: Dimensions.get('window').width / 5,
										offset: Dimensions.get('window').width / 5 * index,
										index
									})}
								snapToInterval={Dimensions.get('window').width / 5}
								// pagingEnabled={true}
								renderItem={(item) => renderReleaseDate(item)}
								keyExtractor={(item, index) => index.toString()}
							/>
						</View>
						{loadingTop ? (
							<View
								style={{
									flex: 1,
									height: 200,
									justifyContent: 'center',
									alignItems: 'center',
									backgroundColor: 'rgba(0,0,0, .9)'
								}}
							>
								<ActivityIndicator animating size="large" color={'#fff'} />
								{/* <ActivityIndicator animating size="large" /> */}
							</View>
						) : (
							<FlatListStrip
								data={topMoviesOfTheYear}
								title={''}
								navigation={navigation}
								horizontalFlag={true}
								numColumns={1}
								imageHight={200}
								imageWidth={160}
							/>
						)}
					</View>

					<View style={{ marginBottom: 10 }} />
				</ScrollView>
			) : (
				<View style={{ justifyContent: 'center', flex: 1 }}>
					<Text style={{ color: '#DCDCDC', textAlign: 'center', fontSize: 16 }}>
						Please check your network !!!
					</Text>
				</View>
			)}
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
	setTrending,
	setMovieByFriend,
	setFSIdToGetDetails,
	setUtilData,
	setSeenMovies
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);

// yarn add core-js@^3
// yarn cache clean
// rm -r node_modules
// yarn
// expo start -c

// what2watch
// flicksick
//flickpick

// loved it, dumb but entertaining, just time pass , worthless

// MOOD:
// romcom:  Comedy, Drama, Romance | Comedy, Romance |
// Feel Good: Animation, Adventure, Comedy | Adventure, Comedy, Drama | Animation, Adventure, Family
// sport: sport , biography
// mind blending: drama, mystery, thriller
// spy: action, mystery, thriller
//siyfiy:

// action, adventure, animation, biography, comedy, crime, horror, sci-fi, thriller, rom-com

// https://stackoverflow.com/questions/43510061/how-do-i-center-an-item-within-a-react-native-listview
