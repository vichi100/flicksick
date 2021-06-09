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
	ActivityIndicator
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
import { setTrendingTodayX, setDataFor, setFSIdToGetDetails } from '../reducers/Action';
import FlatListStrip from './FlatListStrip';
import * as Contacts from 'expo-contacts';
import { SERVER_URL } from './utils/constants';
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
		axios(SERVER_URL + '/getHomeScreenData', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data);
				setHomeData(response.data);
				setLoading(false);
				// props.setTrendingTodayX(response.data['trending_today']);
				// props.setDataFor(response.data['trending_current_week']);
				// props.setTrendingTodayX(response.data['trending_today']);
				// props.setDataFor(response.data['trending_current_week']);
			},
			(error) => {
				console.log(error);
				setLoading(false);
			}
		);
	};

	useEffect(() => {
		setLoading(true);
		getHomeScreenData();
	}, []);

	const generateYearsBetween = (startYear = 2000, endYear) => {
		const endDate = endYear || new Date().getFullYear();
		let years = [];
		// console.log('endDate: ', endDate);
		while (startYear <= endDate) {
			years.push(startYear);
			startYear++;
		}
		return years.reverse();
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
		axios(SERVER_URL + '/getTopMoviesOfTheYear', {
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
				console.log(error);
				setLoading(false);
			}
		);
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
				<TouchableHighlight onPress={() => setReleaseDate(item)}>
					{item.toString().toUpperCase() === releaseDate.toString().toUpperCase() ? (
						<Text style={{ color: '#40E0D0', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					) : (
						<Text style={{ color: '#808080', fontSize: 16, fontWeight: '500' }}>{item}</Text>
					)}
				</TouchableHighlight>
			</View>
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
								horizontal
								data={generateYearsBetween()}
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

					{/* <FlatListStrip
					data={props.trendingCurrentWeek}
					title={'Most Watched This Week'}
					navigation={navigation}
					horizontalFlag={true}
					numColumns={1}
					imageHight={200}
					imageWidth={160}
				/> */}
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
	setTrendingTodayX,
	setDataFor,
	setFSIdToGetDetails
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
