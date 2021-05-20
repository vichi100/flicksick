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
	TouchableOpacity
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
import FlatListStrip from './FlatListStrip';
// import {setDataFor} from "../reducers/Action"

// https://entertainmenthub.netlify.app/

// https://api.themoviedb.org/3/trending/all/day?api_key=26ba5e77849587dbd7df199727859189&page=1

// /fPGeS6jgdLovQAKunNHX8l0avCy.jpg

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const Home = (props) => {
	const { navigation } = props;

	const [ slider1ActiveSlide, setSlider1ActiveSlide ] = useState(SLIDER_1_FIRST_ITEM);
	const carouselRef = useRef(null);

	const setSlider1ActiveSlideX = (index) => {
		setSlider1ActiveSlide(index);
	};

	const myNavigation = (tmdbId) => {
		props.setTMDBIdToGetDetails(tmdbId);
		navigateTo();
	};

	const navigateTo = () => {
		navigation.navigate('MovieDetails');
	};

	const _renderItem = ({ item, index }) => {
		return <SliderEntry data={item} even={(index + 1) % 2 === 0} navigateTo={() => navigateTo()} />;
	};

	const renderItem = ({ item }) => {
		// console.log("Item:  ", item.illustration);
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

	const getHomeScreenData = () => {
		console.log('getHomeScreenData called');
		const obj = {
			id: '123'
		};
		axios('http://192.168.0.100:3000/getHomeScreenData', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data);
				props.setTrendingTodayX(response.data['trending_today']);
				props.setDataFor(response.data['trending_current_week']);
				// props.setTrendingTodayX(response.data['trending_today']);
				// props.setDataFor(response.data['trending_current_week']);
			},
			(error) => {
				console.log(error);
			}
		);
	};

	useEffect(() => {
		getHomeScreenData();
	}, []);

	return (
		<SafeAreaView style={{ backgroundColor: 'rgba(0,0,0, .9)', flex: 1 }}>
			<ScrollView>
				<Text
					style={{
						color: 'rgba(255, 255, 255, 1)',
						marginTop: 10,
						marginBottom: 10,
						textAlign: 'center',
						fontSize: 16,
						fontWeight: '600'
					}}
				>
					Dope on these with FRIENDS{' '}
				</Text>
				<View style={{ flexDirection: 'column' }}>
					<View style={{}}>
						{/* <Text style={styles.title}>{`Example ${1}`}</Text>
          <Text style={styles.subtitle}>{"title"}</Text> */}
						<Carousel
							ref={carouselRef}
							data={props.trendingToday}
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
						{/* <Pagination
            dotsLength={ENTRIES1.length}
            activeDotIndex={slider1ActiveSlide}
            containerStyle={styles.paginationContainer}
            dotColor={"rgba(255, 255, 255, 0.92)"}
            dotStyle={styles.paginationDot}
            inactiveDotColor={"#fff"}
            inactiveDotOpacity={0.9}
            inactiveDotScale={0.6}
            carouselRef={carouselRef}
            tappableDots={!!carouselRef}
          /> */}
					</View>
				</View>

				<FlatListStrip data={props.trendingToday} title={'Trending Today'} />
				{/* <View>
					<Text
						style={{
							color: '#fff',
							fontSize: 16,
							fontWeight: '600',
							marginTop: 10,
							marginBottom: 10,
							marginLeft: 15,
							padding: 0,
							borderColor: '#fff'
						}}
					>
						Trending Today
					</Text>
					<FlatList
						horizontal
						data={props.trendingToday}
						//data defined in constructor
						// ItemSeparatorComponent={ItemSeparatorView}
						//Item Separator View
						renderItem={(item) => renderItem(item)}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View> */}
				<FlatListStrip data={props.trendingCurrentWeek} title={'Most Watched This Week'} />
				{/* <View>
					<Text
						style={{
							color: '#fff',
							fontSize: 16,
							fontWeight: '600',
							marginTop: 10,
							marginBottom: 10,
							marginLeft: 15,
							padding: 0,
							borderColor: '#fff'
						}}
					>
						Most watched This Week
					</Text>
					<FlatList
						horizontal
						data={props.trendingCurrentWeek}
						//data defined in constructor
						// ItemSeparatorComponent={ItemSeparatorView}
						//Item Separator View
						renderItem={(item) => renderItem(item)}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View> */}
				<View style={{ marginBottom: 10 }} />
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
	setDataFor,
	setTMDBIdToGetDetails
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
