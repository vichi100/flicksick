import React, { Component, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, StyleSheet, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from '../react-native-snap-carousel/index';
import styles from '../styles/SliderEntry.style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { setFSIdToGetDetails, setMovieDetails, setLoginMessage, setSeenMovies } from '../../reducers/Action';
// import { RATTING_ARRAY } from '../utils/constants';
import { ButtonGroup } from 'react-native-elements';
import axios from 'axios';
import { SERVER_MOVIE_API_URL, FLICKSICK_IMAGE_URL, TMDB_IMAGE_URL } from '../utils/constants';
import { getFSMovieRating } from '../utils/methods';

// https://snack.expo.io/@vichi/45c79d   image overlay text

const RATTING_ARRAY = [ 'Loved it', 'Dumb but entertaining', 'Just time pass', 'Worthless' ];

const SliderEntry = (props) => {
	const { data, parallax, parallaxProps, even } = props;
	const [ modalVisible, setModalVisible ] = useState(false);
	const [ ratingIndex, setRatingIndex ] = useState(-1);
	const [ fsId, setFSId ] = useState(null);
	const [ movieName, setMovieName ] = useState(null);
	const [ displayError, setDisplayError ] = useState(false);

	const openRating = (movie) => {
		// console.log('rating', movie);
		setModalVisible(true);
		setFSId(movie.fs_id);
		setMovieName(movie.title);
	};

	const selectRatingIndex = (index) => {
		setRatingIndex(index);
		setDisplayError(false);
	};

	const image = () => {
		//  console.log("https://image.tmdb.org/t/p/w300" + poster_path)

		return false ? (
			<View
				style={{
					flex: 1,
					alignItems: 'stretch',
					justifyContent: 'center',
					paddingTop: 90,
					backgroundColor: '#ecf0f1'
				}}
			>
				<ParallaxImage
					source={{ uri: data.poster_path }}
					dataText={'vichi'}
					containerStyle={[ styles.imageContainer, even ? styles.imageContainerEven : {} ]}
					style={styles.image}
					parallaxFactor={0.35}
					showSpinner={true}
					spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
					{...parallaxProps}
				/>
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 300,
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Text>Your overlay text</Text>
				</View>
			</View>
		) : (
			<View
				style={{
					flex: 1,
					alignItems: 'stretch',
					justifyContent: 'center',
					// paddingTop: 90,
					backgroundColor: '#ecf0f1'
				}}
			>
				<Image
					source={{
						uri:
							data.poster_path.indexOf('image') > -1
								? FLICKSICK_IMAGE_URL + data.poster_path
								: TMDB_IMAGE_URL + data.poster_path
					}}
					style={{ flexGrow: 1 }}
					resizeMode={'cover'}
				/>
				<View
					style={{
						position: 'absolute',
						// top: 0,
						// right: 0,
						// height: 100,
						// width: 70,
						// backgroundColor: "rgba(0,0,0, .4)",
						// borderTopRightRadius: 10,
						// borderBottomRightRadius: 10,
						// flexDirection: 'row',
						// justifyContent: 'space-between',
						padding: 5,
						// width: '100%',
						height: '100%'
						// bo
						// paddingLeft: 15,
						// paddingRight: 15
					}}
				>
					{/* <LinearGradient
            colors={["rgba(0,0,0, .2)", "transparent"]}
            start={[0, 0]}
            end={[1, 1]}
            locations={[0.01, 0.99]}
            style={{
              flex: 1,
              // height: 50,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          > */}
					{/* <View style={{ flexDirection: 'row' }}>
						<AntDesign name="eyeo" color={'#7CFC00'} size={20} />
						<View style={{ marginLeft: 5 }} />
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>100</Text>
					</View> */}
					{/* <View style={{ flexDirection: 'row' }}>
						<Entypo name="list" color={'#00FFFF'} size={20} />
						<View style={{ marginLeft: 5 }} />
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>250</Text>
					</View> */}
					{/* <View style={{ flexDirection: 'row' }}>
						<AntDesign name="hearto" color={'red'} size={20} />
						<View style={{ marginLeft: 5 }} />
						<Text style={{ color: '#F5F5F5', fontSize: 14, fontWeight: '500' }}>
							{getFSMovieRating(data)}%
						</Text>
					</View> */}
					{/* </LinearGradient> */}
				</View>
				<View style={{ flexDirection: 'row', position: 'absolute', top: 5, right: 5 }}>
					<AntDesign name="hearto" color={'red'} size={20} />
					<View style={{ marginLeft: 5 }} />
					<Text style={{ color: '#F5F5F5', fontSize: 14, fontWeight: '900' }}>
						{getFSMovieRating(data) && getFSMovieRating(data).loved_it}%
					</Text>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<View style={{ position: 'absolute', bottom: 15, left: 10 }}>
						<Text
							style={{
								color: '#fff',
								fontSize: 14,
								fontWeight: '500',
								textTransform: 'capitalize'
							}}
						>
							{data.media_type && data.media_type.toUpperCase() === 'tv'.toUpperCase() ? (
								'Series'
							) : (
								data.media_type
							)}
						</Text>
					</View>

					<View
						style={{
							position: 'absolute',
							bottom: 15,
							right: 10,
							borderColor: 'rgba(211,211,211, .6)',
							borderWidth: 1,
							padding: 5,
							borderRadius: 5,
							backgroundColor: 'rgba(0,0,0, .4)',

							alignItems: 'center'
						}}
					>
						<TouchableOpacity
							onPress={() => openRating(data)}
							style={{
								flexDirection: 'row',
								justifyContent: 'center'
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
								Seen |
							</Text>
							{props.seenMovies[data.fs_id] === 1 ? (
								<AntDesign name="check" color={'#00FF00'} size={12} />
							) : (
								<Text
									style={{
										color: '#00FF00',
										fontSize: 12,
										fontWeight: '700',
										textTransform: 'capitalize'
									}}
								>
									{' ?'}
								</Text>
							)}
							{/* <Ionicons name="checkmark" color={'#00FF00'} size={15} /> */}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	};

	const navigateTo = (fsId, movieData) => {
		// console.log("navi");
		props.setFSIdToGetDetails(fsId);
		props.setMovieDetails(movieData);
		props.navigateTo('MovieDetails');
	};

	const addRatingAndSeenFlag = () => {
		// console.log('addRatingAndSeenFlag called', props.userDetails);
		if (ratingIndex === -1) {
			setDisplayError(true);
			return;
		}
		if (!props.userDetails) {
			// navigation.navigate('Login');
			props.setLoginMessage('Please login before start rating');
			setModalVisible(false);
			setDisplayError(false);
			props.navigateTo('Login');
			return;
		}

		const obj = {
			user_id: props.userDetails.id,
			mobile: props.userDetails.mobile,
			fs_id: fsId,
			rating_code: ratingIndex
		};
		axios(SERVER_MOVIE_API_URL + '/addRatingAndSeenFlag', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data);
				const temp = { ...props.seenMovies };
				temp[fsId] = 1;
				props.setSeenMovies(temp);
				setRatingIndex(-1);
			},
			(error) => {
				console.log(error);
			}
		);

		setModalVisible(!modalVisible);
	};

	return (
		<TouchableOpacity
			activeOpacity={1}
			style={styles.slideInnerContainer}
			onPress={() => navigateTo(data.fs_id, data)}
		>
			{/* <View style={styles.shadow} /> */}
			<View style={[ styles.imageContainer, even ? styles.imageContainerEven : {} ]}>
				{image()}

				<View style={[ styles.radiusMask, even ? styles.radiusMaskEven : {} ]} />
			</View>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					// Alert.alert("Modal has been closed.");
					setModalVisible(false);
				}}
			>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignContent: 'center',
						marginTop: 22,
						marginBottom: 20
					}}
				>
					<View
						style={{
							margin: 20,
							height: 370,
							backgroundColor: '#000',
							borderRadius: 20,
							borderColor: 'rgba(105,105,105, .8)',
							borderWidth: 0.5,
							padding: 35,
							alignItems: 'center',
							shadowColor: '#000',
							shadowOffset: {
								width: 0,
								height: 2
							},
							shadowOpacity: 0.25,
							shadowRadius: 3.84,
							elevation: 5
						}}
					>
						<Text
							style={{
								marginBottom: 10,
								textAlign: 'center',
								color: 'rgba(255,255,255,.9)',
								fontSize: 18,
								fontWeight: '600'
							}}
						>
							What you feel about ?
						</Text>
						<Text
							style={{
								marginBottom: 15,
								textAlign: 'center',
								color: 'rgba(218,165,32,.9)',
								fontSize: 16,
								fontWeight: '600'
							}}
						>
							{movieName}
						</Text>
						<ButtonGroup
							vertical
							selectedBackgroundColor="rgba(27, 106, 158, 0.85)"
							onPress={selectRatingIndex}
							selectedIndex={ratingIndex}
							buttons={RATTING_ARRAY}
							// containerStyle={{ height: 30 }}
							textStyle={{ textAlign: 'center', color: 'rgba(245,245,245,.9)' }}
							selectedTextStyle={{ color: '#fff' }}
							containerStyle={{
								borderWidth: 0.5,
								borderRadius: 5,
								borderColor: 'rgba(128,128,128,.9)',
								borderBottomColor: 'rgba(128,128,128,.9)',
								borderBottomWidth: 1,
								height: 180,
								width: 300,
								backgroundColor: 'rgba(0,0,0, .7)'
							}}
							containerBorderRadius={10}
						/>

						<View
							style={{
								position: 'absolute',
								flexDirection: 'row',
								right: 0,
								bottom: 0,
								marginTop: 20,
								marginBottom: 15,
								paddingRight: 20
								// justifyContent: "flex-end"
							}}
						>
							<TouchableHighlight
								// stylesX={{ ...stylesX.cancelButton }}
								onPress={() => {
									setModalVisible(!modalVisible);
									setDisplayError(false);
									setRatingIndex(-1);
								}}
							>
								<Text
									style={{
										marginBottom: 15,
										marginRight: 20,
										textAlign: 'center',
										color: '#fff'
									}}
								>
									Not Seen
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								// styles={{ ...stylesX.applyButton }}
								onPress={() => {
									addRatingAndSeenFlag();
								}}
							>
								<Text
									style={{
										marginBottom: 15,
										textAlign: 'center',
										color: '#fff'
									}}
								>
									Apply
								</Text>
							</TouchableHighlight>
						</View>
						{displayError ? (
							<View style={{ position: 'absolute', bottom: 5, left: 15 }}>
								<Text style={{ color: 'rgba(255,69,0, .9)', fontSize: 14 }}>
									Please Select Rating !!!
								</Text>
							</View>
						) : null}
					</View>
				</View>
			</Modal>
		</TouchableOpacity>
	);
};

const mapStateToProps = (state) => ({
	trendingToday: state.AppReducer.trendingToday,
	trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
	userDetails: state.AppReducer.userDetails,
	seenMovies: state.AppReducer.seenMovies
});

// const mapDispatchToProps = () => ({
//   setTrendingTodayX,
//   setTrendingCurrentWeekY,
// });
const mapDispatchToProps = {
	setFSIdToGetDetails,
	setMovieDetails,
	setLoginMessage,
	setSeenMovies
};
export default connect(mapStateToProps, mapDispatchToProps)(SliderEntry);

const stylesX = StyleSheet.create({
	applyButton: {
		// backgroundColor: "#F194FF",
		// width: 150,
		// textAlign: "center",
		// borderRadius: 20,
		// paddingLeft: 60,
		// paddingRight: 20,
		// paddingTop: 10,
		// paddingBottom: 10,
		// elevation: 2,
		marginLeft: 10,
		marginRight: 10
	},

	cancelButton: {
		// backgroundColor: "#F194FF",
		// width: 150,
		// textAlign: "center",
		// borderRadius: 20,
		// paddingLeft: 55,
		// paddingRight: 20,
		// paddingTop: 10,
		// paddingBottom: 10,
		// elevation: 2,
		marginLeft: 10,
		marginRight: 30
	}
});
