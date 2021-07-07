import React, { useEffect, useState, useRef, useCallback } from 'react';
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
	Button,
	TouchableOpacity,
	Modal,
	ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import * as Font from 'expo-font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import { scrollInterpolators, animatedStyles } from './utils/animations';
import { Video, AVPlaybackStatus } from 'expo-av';
import ViewMoreText from './components/ViewMoreText';
import { connect } from 'react-redux';
import { setFSIdToGetDetails } from '../reducers/Action';
import { WebView } from 'react-native-webview';
import { useScrollToTop } from '@react-navigation/native';
import FlatListStrip from './FlatListStrip';
import { TouchableHighlight } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { SERVER_MOVIE_API_URL, FLICKSICK_IMAGE_URL, TMDB_IMAGE_URL } from './utils/constants';
import { getFSMovieRating } from './utils/methods';
// https://entertainmenthub.netlify.app/

// https://api.themoviedb.org/3/trending/all/day?api_key=26ba5e77849587dbd7df199727859189&page=1

// /fPGeS6jgdLovQAKunNHX8l0avCy.jpg

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 1;

const useHookWithRefCallback = () => {
	const ref = useRef(null);
	const setRef = useCallback((node) => {
		if (ref.current) {
			// Make sure to cleanup any events/references added to the last instance
		}

		if (node) {
			// Check if a node is actually passed. Otherwise node would be null.
			// You can now do what you need to, addEventListeners, measure, etc.
		}

		// Save a reference to the node
		ref.current = node;
	}, []);

	return [ setRef ];
};

const MovieDetails = (props) => {
	const { navigation } = props;
	const scrollViewRef = useRef();

	const [ movieDetails, setMovieDetails ] = useState(null);
	const [ genres, setGenres ] = useState([]);
	const [ isVisible, setIsVisible ] = useState(false);
	const [ slider1ActiveSlide, setSlider1ActiveSlide ] = useState(SLIDER_1_FIRST_ITEM);
	const [ trailerURI, setTrailerURI ] = useState(null);
	const carouselRef = useRef(null);
	const [ visible, setVisible ] = useState(false);
	// const [ OTTProvideLink, setOTTProvideLink ] = useState(null);
	const [ OTTProvidesList, setOTTProvidesList ] = useState([]);
	const [ ratingDict, setRatingDict ] = useState(null);
	const [ fsMovieRating, setFsMovieRating ] = useState(null);

	// const video = React.useRef(null);
	const [ status, setStatus ] = React.useState({});

	const ActivityIndicatorElement = () => {
		return (
			<View
				style={{
					flex: 1,
					position: 'absolute',
					marginLeft: 'auto',
					marginRight: 'auto',
					marginTop: 'auto',
					marginBottom: 'auto',
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
					justifyContent: 'center'
				}}
			>
				<ActivityIndicator color="#000000" size="large" />
			</View>
		);
	};

	useEffect(
		() => {
			if (props.movieDetails) {
				getFSMovieRatingX(props.movieDetails);
			}
		},
		[ props.movieDetails ]
	);

	const getFSMovieRatingX = (itemX) => {
		const tempFSRating = getFSMovieRating(itemX);
		setFsMovieRating(tempFSRating);
	};

	useEffect(
		() => {
			// console.log(scrollViewRef.current);
			// if (scrollViewRef.current) {
			// 	getMovieDetails();
			// }
			getMovieDetails();
		},
		[ props.fsIdToGetDetails, scrollViewRef.current ]
	);

	const getMovieDetails = () => {
		// console.log(props.movieDetails);
		const movieDetails = props.movieDetails;
		setMovieDetails(movieDetails);
		const genresX = [];
		movieDetails.genres.map((item) => {
			// console.log(item.name);
			genresX.push(item.name);
		});
		setGenres(genresX);

		// streaming info
		const OTTArrayObj = [];
		const ott = movieDetails.streaming_info;
		console.log(JSON.stringify(ott));
		var ottURL = null;
		ott.map((item) => {
			console.log('item: ', item);
			Object.keys(item).map((key) => {
				console.log('key: ', key);
				const ottCountry = item[key];
				console.log(JSON.stringify(ottCountry));
				ottURL = ottCountry['in'].link;
				console.log(FLICKSICK_IMAGE_URL + props.utilData.ott_provider[key]);
				const OTTObj = {
					provider: key,
					url: ottURL,
					image: FLICKSICK_IMAGE_URL + props.utilData.ott_provider[key]
				};
				OTTArrayObj.push(OTTObj);
				console.log(JSON.stringify(ottURL));
			});
		});

		setOTTProvidesList(OTTArrayObj);
		const tempRatingDict = {};
		movieDetails.ratings &&
			movieDetails.ratings.map((item) => {
				const name = item.source;
				const rating = item.value.slice(0, 2);

				tempRatingDict[name] = rating;
			});
		setRatingDict(tempRatingDict);
	};

	const renderViewLess = (onPress) => {
		return (
			<Text onPress={onPress} style={{ color: '#6495ED' }}>
				View less
			</Text>
		);
	};

	const renderViewMore = (onPress) => {
		return (
			<Text onPress={onPress} style={{ color: '#6495ED' }}>
				View more
			</Text>
		);
	};

	const renderItem = ({ item }) => {
		// console.log("Item:  ", item.illustration);
		return (
			<TouchableOpacity activeOpacity={1} onPress={() => navigateTo()}>
				<View style={{ marginLeft: 5, flex: 1 }}>
					<Image
						source={{
							uri:
								item.poster_path.indexOf('image') > -1
									? FLICKSICK_IMAGE_URL + item.poster_path
									: TMDB_IMAGE_URL + item.poster_path
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
					<View style={{ position: 'absolute', bottom: 5, right: 5 }}>
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
				</View>
			</TouchableOpacity>
		);
	};

	const playTrailer = (trailerLink) => {
		// console.log('playTrailer: ', 'https://www.youtube.com/embed/' + JSON.stringify(trailerLink));

		setTrailerURI('https://www.youtube.com/embed/' + trailerLink);
		setIsVisible(true);
	};
	const openOTT = (ottURL) => {
		Linking.openURL(ottURL);
	};

	const renderOTTProvider = ({ item }) => {
		// console.log(item);
		return (
			// movieDetails
			<TouchableHighlight onPress={() => openOTT(item.url)}>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						marginRight: 20,
						borderWidth: 0.4,
						borderColor: '#fff',
						padding: 10,
						borderRadius: 10
					}}
				>
					{/* <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{item}</Text> */}
					{/* <Image source={item.image} style={{ width: 40, height: 40 }} /> */}
					<Image
						source={{
							uri: item.image
						}}
						style={{ width: 40, height: 40 }}
					/>
				</View>
			</TouchableHighlight>
		);
	};

	return (
		<SafeAreaView style={{ backgroundColor: 'rgba(0,0,0, .9)', flex: 1 }}>
			{movieDetails ? (
				<View style={{ flex: 1 }}>
					<View
						style={{
							height: 200,
							// flex: 1,
							alignItems: 'stretch',
							justifyContent: 'center'
						}}
					>
						<Image
							source={{
								uri:
									movieDetails.backdrop_path.indexOf('image') > -1
										? FLICKSICK_IMAGE_URL + movieDetails.backdrop_path
										: TMDB_IMAGE_URL + movieDetails.backdrop_path
							}}
							style={{ flexGrow: 1 }}
							resizeMode={'cover'}
						/>
						{movieDetails.trailer && movieDetails.trailer.trim().length > 0 ? (
							<TouchableOpacity onPress={() => playTrailer(movieDetails.trailer)}>
								<View
									style={{
										position: 'absolute',
										bottom: 5,
										right: 5,
										backgroundColor: 'rgba(0,0,0, .2)',
										borderColor: '#fff',
										borderWidth: 1,
										padding: 5,
										borderRadius: 5
									}}
								>
									<Text
										style={{
											color: '#fff',
											fontSize: 12,
											fontWeight: '500',
											textTransform: 'capitalize'
										}}
									>
										Trailer
									</Text>
								</View>
							</TouchableOpacity>
						) : null}

						{/* <Video
            ref={video}
            style={{ alignSelf: "center", width: "100%", height: 200 }}
            source={{
              uri: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
            }}
            useNativeControls
            resizeMode="cover"
            usePosterA={true}
            isLooping
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          /> */}
					</View>

					<View style={{ marginTop: 15 }}>
						<View
							style={{
								paddingLeft: 15,
								paddingRight: 15,
								flexDirection: 'row',
								justifyContent: 'space-between'
							}}
						>
							<Text style={{ fontSize: 18, fontWeight: '600', color: '#fff', width: '80%' }}>
								{movieDetails.title || movieDetails.original_title}
							</Text>
							<View style={{ flexDirection: 'row' }}>
								<Text style={{ fontSize: 18, fontWeight: '600', color: '#FFA500' }}>
									{movieDetails.age ? movieDetails.age : 'NA'}
								</Text>
								<Text style={{ color: '#A9A9A9', paddingTop: 5 }}>Age</Text>
							</View>
						</View>

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingLeft: 15,
								paddingRight: 15
							}}
						>
							<Text
								style={{
									fontSize: 14,
									fontWeight: '400',
									color: '#b9b9c0',
									paddingTop: 5,
									width: '80%'
								}}
							>
								{genres.join(', ')}
							</Text>
							<Text
								style={{
									fontSize: 14,
									fontWeight: '400',
									color: '#b9b9c0',
									paddingTop: 5
								}}
							>
								{movieDetails.media_type === 'movie' ? movieDetails.runtime + ' min' : null}
							</Text>
						</View>

						<View style={{ marginLeft: 15, marginRight: 15, marginTop: 5 }}>
							<ViewMoreText
								numberOfLines={2}
								renderViewMore={renderViewMore}
								renderViewLess={renderViewLess}
								// textStyle={{ textAlign: "center" }}
							>
								<Text style={{ color: '#c2cac4' }}>{movieDetails.overview}</Text>
							</ViewMoreText>
						</View>
					</View>

					<ScrollView>
						<View style={{ paddingBottom: 0 }}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingLeft: 15,
									paddingRight: 10,
									paddingTop: 20,
									paddingBottom: 20,
									marginTop: 30,
									margin: 5,
									borderColor: 'rgba(105,105,105, 0.6)',
									borderWidth: 0.3,
									borderRadius: 10
								}}
							>
								<View
									style={{
										position: 'absolute',
										// backgroundColor: "#FFF",
										top: -18,
										left: 15,
										padding: 5,
										// paddingLeft: 10,
										zIndex: 50,
										flexDirection: 'row'
									}}
								>
									<Text
										style={{
											color: 'rgb(211,211,211)',
											fontSize: 14,
											fontWeight: '600',
											paddingTop: 3
											// backgroundColor: "rgba(0,0,0, .1)",
										}}
									>
										{'   Rating'}
									</Text>
								</View>

								<View>
									<View
										style={{
											flexDirection: 'row',
											marginBottom: 5,
											flex: 1,
											justifyContent: 'center'
										}}
									>
										{/* <AntDesign name="eyeo" color={'#7CFC00'} size={20} /> */}
										<View style={{ marginLeft: 0 }} />
										<Text
											style={{
												color: '#fff',
												fontSize: 20,
												fontWeight: '600',
												textAlign: 'center'
											}}
										>
											{Number(movieDetails.imdb_rating) / 10 || 'NA'}
										</Text>
									</View>
									<Image
										source={require('../../assets/img/imdb.png')}
										style={{ width: 70, height: 30 }}
										// resizeMode={'contain'}
									/>
								</View>
								<View>
									<View
										style={{
											flexDirection: 'row',
											marginBottom: 5,
											flex: 1,
											justifyContent: 'center'
										}}
									>
										{/* <MaterialCommunityIcons name="stack-overflow" color={'#00FFFF'} size={20} /> */}
										<View style={{ marginLeft: 0 }} />
										<Text
											style={{
												color: '#fff',
												fontSize: 20,
												fontWeight: '600',
												textAlign: 'center'
											}}
										>
											{movieDetails.rotten_tomatoes_rating ? (
												Number(movieDetails.rotten_tomatoes_rating) / 10
											) : ratingDict && ratingDict['Rotten Tomatoes'] ? (
												Number(ratingDict['Rotten Tomatoes']) / 10
											) : (
												'NA'
											)}
										</Text>
									</View>
									<Image
										source={require('../../assets/img/rotten.png')}
										style={{ width: 75, height: 20 }}
										resizeMode={'contain'}
									/>
								</View>

								<View>
									<View
										style={{
											flexDirection: 'row',
											marginBottom: 5,
											flex: 1,
											justifyContent: 'center'
										}}
									>
										{/* <AntDesign name="hearto" color={'red'} size={20} /> */}
										<View style={{ marginLeft: 0 }} />
										<Text
											style={{
												color: '#fff',
												fontSize: 20,
												fontWeight: '600',
												textAlign: 'center'
											}}
										>
											{Number(movieDetails.tmdb_rating) / 10 || 'NA'}
										</Text>
									</View>
									<Image
										source={require('../../assets/img/tmdb.png')}
										style={{ width: 70, height: 30 }}
										resizeMode={'contain'}
									/>
								</View>
							</View>

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									// paddingLeft: 15,
									// paddingRight: 15,
									paddingTop: 20,
									paddingBottom: 20,
									margin: 5,
									borderColor: 'rgba(105,105,105, 0.6)',
									borderWidth: 0.3,
									borderRadius: 10,
									marginTop: 15
								}}
							>
								<View
									style={{
										position: 'absolute',
										// backgroundColor: "#FFF",
										top: -18,
										left: 15,
										padding: 5,
										// paddingLeft: 10,
										zIndex: 50
									}}
								>
									<Text
										style={{
											color: 'rgb(211,211,211)',
											fontSize: 14,
											fontWeight: '600',
											paddingTop: 3
										}}
									>
										{'   By Friends   '}
									</Text>
								</View>
								<View style={{ flex: 1, alignItems: 'center' }}>
									<View style={{ flexDirection: 'row' }}>
										{/* <AntDesign name="eyeo" color={'#7CFC00'} size={20} /> */}
										<View style={{ marginLeft: 0 }} />
										<Text
											style={{ color: 'rgba(255,105,180, .9)', fontSize: 22, fontWeight: '700' }}
										>
											{fsMovieRating && fsMovieRating.loved_it}%
										</Text>
									</View>
									<Text
										style={{
											color: 'rgba(245,245,245, .9)',
											fontSize: 13,
											fontWeight: '500',
											paddingTop: 3,
											textAlign: 'center'
										}}
									>
										Loved It
									</Text>
								</View>
								<View style={{ flex: 1, alignItems: 'center' }}>
									<View style={{ flexDirection: 'row' }}>
										{/* <MaterialCommunityIcons name="stack-overflow" color={'#00FFFF'} size={20} /> */}
										<View style={{ marginLeft: 0 }} />
										<Text style={{ color: 'rgba(255,140,0, .8)', fontSize: 22, fontWeight: '700' }}>
											{fsMovieRating && fsMovieRating.dumb_but_entertaining}%
										</Text>
									</View>
									<Text
										style={{
											color: 'rgba(245,245,245, .9)',
											fontSize: 13,
											fontWeight: '500',
											paddingTop: 3,
											textAlign: 'center'
										}}
									>
										Dumb But{'\n'}Entertaining
									</Text>
								</View>

								<View style={{ flex: 1, alignItems: 'center' }}>
									<View style={{ flexDirection: 'row' }}>
										{/* <AntDesign name="hearto" color={'#FF69B4'} size={20} /> */}
										<View style={{ marginLeft: 0 }} />
										<Text
											style={{ color: 'rgba(64,224,208, .6)', fontSize: 22, fontWeight: '700' }}
										>
											{fsMovieRating && fsMovieRating.just_time_pass}%
										</Text>
									</View>
									<Text
										style={{
											color: 'rgba(245,245,245, .9)',
											fontSize: 13,
											fontWeight: '500',
											paddingTop: 3,
											textAlign: 'center'
										}}
									>
										Just Time{'\n'} Pass
									</Text>
								</View>
								<View style={{ flex: 1, alignItems: 'center' }}>
									<View style={{ flexDirection: 'row' }}>
										{/* <AntDesign name="hearto" color={'#FF69B4'} size={20} /> */}
										<View style={{ marginLeft: 0 }} />
										<Text
											style={{ color: 'rgba(245,222,179, .6)', fontSize: 22, fontWeight: '700' }}
										>
											{fsMovieRating && fsMovieRating.worthless}%
										</Text>
									</View>
									<Text
										style={{
											color: 'rgba(245,245,245, .9)',
											fontSize: 13,
											fontWeight: '500',
											paddingTop: 3,
											textAlign: 'center'
										}}
									>
										Worthless
									</Text>
								</View>
							</View>

							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									paddingLeft: 15,
									paddingRight: 15,
									paddingTop: 10,
									paddingBottom: 10,
									margin: 5
									// borderColor: "rgba(105,105,105, 0.6)",
									// borderWidth: 0.3,
									// borderRadius: 10,
								}}
							>
								{/* <View style={{}}>
							<Text style={{ color: '#fff' }}>Watch On</Text>
						</View> */}
								<Text style={{ color: '#fff', textAlign: 'center', fontSize: 16, fontWeight: '500' }}>
									Watch On
								</Text>
								<View style={{ marginLeft: 20, marginRight: 10 }}>
									<FlatList
										horizontal
										data={OTTProvidesList}
										//data defined in constructor
										// ItemSeparatorComponent={ItemSeparatorView}
										//Item Separator View
										renderItem={(item) => renderOTTProvider(item)}
										keyExtractor={(item, index) => index.toString()}
									/>
								</View>
							</View>

							<View>
								{/* <Text
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
							Recommendations
						</Text>
						<FlatList
							horizontal
							data={props.trendingCurrentWeek}
							//data defined in constructor
							// ItemSeparatorComponent={ItemSeparatorView}
							//Item Separator View
							renderItem={(item) => renderItem(item)}
							keyExtractor={(item, index) => index.toString()}
						/> */}
								{/* <FlatListStrip
							data={props.trendingCurrentWeek}
							title={'Recommendations'}
							navigation={navigation}
						/> */}
								{/* <FlatListStrip enable this later
									data={props.trendingToday}
									title={'Recommendations'}
									navigation={navigation}
									horizontalFlag={true}
									numColumns={1}
									imageHight={200}
									imageWidth={160}
								/> */}
							</View>
						</View>
					</ScrollView>
				</View>
			) : null}

			<Modal
				animationType="slide"
				transparent={false}
				visible={isVisible}
				onRequestClose={() => {
					alert('Modal has been closed.');
				}}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						alignContent: 'center',
						backgroundColor: 'rgba(0,0,0, .9)'
					}}
				>
					<View
						style={{
							// flex: 1,
							height: 300,
							width: '100%'
						}}
					>
						<WebView
							originWhitelist={[ '*' ]}
							javaScriptEnabled={true}
							domStorageEnabled={true}
							style={{}}
							source={{
								// uri: 'https://www.youtube.com/embed/FzT7-NfkxLA'
								uri: trailerURI
							}}
							renderLoading={ActivityIndicatorElement}
							//Want to show the view or not
							startInLoadingState={true}
						/>
						<TouchableOpacity
							onPress={() => setIsVisible(false)}
							style={{
								borderColor: 'rgba(192,192,192, .9)',
								borderWidth: 1,
								borderRadius: 5,
								// marginTop: 20,
								height: 30,
								width: 90,
								position: 'absolute',
								right: 0,
								bottom: -50
							}}
						>
							<Text style={{ color: '#fff', padding: 5, textAlign: 'center' }}>CLOSE</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	trendingToday: state.AppReducer.trendingToday,
	trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	fsIdToGetDetails: state.AppReducer.fsIdToGetDetails,
	movieDetails: state.AppReducer.movieDetails,
	utilData: state.AppReducer.utilData
});

// const mapDispatchToProps = () => ({
//   setTrendingTodayX,
//   setTrendingCurrentWeekY,
// });
const mapDispatchToProps = {
	setFSIdToGetDetails
};
export default connect(mapStateToProps, mapDispatchToProps)(MovieDetails);

// https://setapp.com/how-to/google-chrome-dark-mode
