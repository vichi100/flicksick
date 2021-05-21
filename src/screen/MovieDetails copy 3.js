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
	const [ OTTProvidesList, setOTTProvidesList ] = useState([
		require('../../assets/img/netflix.jpeg'),
		require('../../assets/img/prime.jpeg'),
		require('../../assets/img/erosnow.jpeg'),
		require('../../assets/img/hotstar.jpeg'),
		require('../../assets/img/jiocinema.jpeg'),
		require('../../assets/img/sonyliv.jpeg'),
		require('../../assets/img/zee5.jpeg')
	]);

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
				<ActivityIndicator color="#FF8C00" size="large" />
			</View>
		);
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
		// scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
		console.log('getMovieDetails called');

		const obj = {
			id: props.fsIdToGetDetails
		};
		axios('http://192.168.0.100:3000/getMovieDetailData', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				console.log(response.data);
				setMovieDetails(response.data);
				if (response.data) {
					{
						console.log(response.data.genres.length);
						const genresX = [];
						response.data.genres.map((item) => {
							console.log(item.name);
							genresX.push(item.name);
						});
						setGenres(genresX);
					}
				}
			},
			(error) => {
				console.log(error);
			}
		);
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
		console.log('playTrailer: ', 'https://www.youtube.com/embed/' + JSON.stringify(trailerLink));

		setTrailerURI('https://www.youtube.com/embed/' + trailerLink);
		setIsVisible(true);
	};

	const renderOTTProvider = ({ item }) => {
		console.log(item);
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					marginRight: 20,
					borderWidth: 0.5,
					borderColor: '#fff',
					padding: 10,
					borderRadius: 10
				}}
			>
				{/* <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{item}</Text> */}
				<Image source={item} style={{ width: 40, height: 40 }} />
			</View>
		);
	};

	return (
		<SafeAreaView style={{ backgroundColor: 'rgba(0,0,0, .9)', flex: 1 }}>
			{movieDetails ? (
				<View>
					<View
						style={{
							height: 200,
							// flex: 1,
							alignItems: 'stretch',
							justifyContent: 'center'
						}}
					>
						<Image
							source={{ uri: 'https://image.tmdb.org/t/p/w300' + movieDetails.backdrop_path }}
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

					<ScrollView>
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
								<Text style={{ fontSize: 18, fontWeight: '600', color: '#FFA500' }}>
									{movieDetails.adult ? 'A' : 'UA'}
								</Text>
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
									{genres.join(' ,')}
								</Text>
								<Text
									style={{
										fontSize: 14,
										fontWeight: '400',
										color: '#b9b9c0',
										paddingTop: 5
									}}
								>
									{movieDetails.runtime + ' min'}
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

						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingLeft: 15,
								paddingRight: 15,
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
										style={{ color: '#fff', fontSize: 14, fontWeight: '500', textAlign: 'center' }}
									>
										{Number(movieDetails.imdb_rating) / 10 || 'NA'}
									</Text>
								</View>
								<View
									style={{
										backgroundColor: 'rgba(218,165,32,.8)',
										padding: 5,
										borderColor: 'rgba(218,165,32,.8)',
										borderWidth: 0.3,
										borderRadius: 10,
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<Text
										style={{
											color: 'rgb(0,0,0)',
											fontSize: 12,
											fontWeight: '800',
											textAlign: 'center'
										}}
									>
										IMDb
									</Text>
								</View>
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
										style={{ color: '#fff', fontSize: 14, fontWeight: '500', textAlign: 'center' }}
									>
										{Number(movieDetails.rotten_tomatoes_rating) / 10 || 'NA'}
									</Text>
								</View>
								<View
									style={{
										backgroundColor: 'rgba(255,69,0,.8)',
										padding: 5,
										borderColor: 'rgba(255,69,0,.8)',
										borderWidth: 0.3,
										borderRadius: 10

										// alignItems: 'center',
										// justifyContent: 'center',
										// alignContent: 'center',
										// flex: 1
									}}
								>
									<Text
										adjustsFontSizeToFit={true}
										style={{
											color: 'rgb(0,0,0)',
											fontSize: 12,
											fontWeight: '800',
											paddingTop: 3
										}}
									>
										Rotten Tomato
									</Text>
								</View>
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
										style={{ color: '#fff', fontSize: 14, fontWeight: '500', textAlign: 'center' }}
									>
										{Number(movieDetails.tmdb_rating) / 10 || 'NA'}
									</Text>
								</View>
								<View
									style={{
										backgroundColor: 'rgba(0,206,209,.8)',
										padding: 5,
										borderColor: 'rgba(0,206,209,.8)',
										borderWidth: 0.3,
										borderRadius: 10,
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
									<Text
										style={{
											color: 'rgb(0,0,0)',
											fontSize: 12,
											fontWeight: '800',
											paddingTop: 3
										}}
									>
										TMDB
									</Text>
								</View>
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
									<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>70%</Text>
								</View>
								<Text
									style={{
										color: 'rgb(169,169,169)',
										fontSize: 12,
										fontWeight: '500',
										paddingTop: 3
									}}
								>
									Loved It
								</Text>
							</View>
							<View style={{ flex: 1, alignItems: 'center' }}>
								<View style={{ flexDirection: 'row' }}>
									{/* <MaterialCommunityIcons name="stack-overflow" color={'#00FFFF'} size={20} /> */}
									<View style={{ marginLeft: 0 }} />
									<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>40%</Text>
								</View>
								<Text
									style={{
										color: 'rgb(169,169,169)',
										fontSize: 12,
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
									<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>10%</Text>
								</View>
								<Text
									style={{
										color: 'rgb(169,169,169)',
										fontSize: 12,
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
									<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>5%</Text>
								</View>
								<Text
									style={{
										color: 'rgb(169,169,169)',
										fontSize: 12,
										fontWeight: '500',
										paddingTop: 3
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
							<View style={{ marginLeft: 10, marginRight: 10 }}>
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
							<FlatListStrip
								data={props.trendingToday}
								title={'Recommendations'}
								navigation={navigation}
								horizontalFlag={true}
								numColumns={1}
								imageHight={200}
								imageWidth={160}
							/>
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
	fsIdToGetDetails: state.AppReducer.fsIdToGetDetails
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