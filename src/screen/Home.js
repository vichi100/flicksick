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
import { setTrendingTodayX, setDataFor, setFSIdToGetDetails } from '../reducers/Action';
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
					</View>
				</View>

				<FlatListStrip
					data={props.trendingToday}
					title={'Trending Today'}
					navigation={navigation}
					horizontalFlag={true}
					numColumns={1}
					imageHight={200}
					imageWidth={160}
				/>

				<FlatListStrip
					data={props.trendingCurrentWeek}
					title={'Most Watched This Week'}
					navigation={navigation}
					horizontalFlag={true}
					numColumns={1}
					imageHight={200}
					imageWidth={160}
				/>

				<View style={{ marginBottom: 10 }} />
			</ScrollView>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	trendingToday: state.AppReducer.trendingToday,
	trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	fsIdToGetDetails: state.AppReducer.fsIdToGetDetails
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
