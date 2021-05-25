import React, { useEffect, useState, useRef, memo } from 'react';
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
	Modal,
	TouchableHighlight
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
import { ButtonGroup } from 'react-native-elements';
import SearchDisplay from './SearchDisplay';

const RATTING_ARRAY = [ 'Loved It', 'Dumb But Entertaining', 'Just Time Pass', 'Worthless' ];
const FlatListStrip = (props) => {
	const { data, title, navigation, horizontalFlag, numColumns, imageHight, imageWidth } = props;

	const [ modalVisible, setModalVisible ] = useState(false);
	const [ ratingIndex, setRatingIndex ] = useState(-1);
	const [ fsId, setFSId ] = useState(null);
	const [ movieName, setMovieName ] = useState(null);
	const [ displayError, setDisplayError ] = useState(false);

	const openRating = (movie) => {
		// console.log('rating');
		setModalVisible(true);
		setFSId(movie.fs_id);
		setMovieName(movie.title);
	};

	const selectRatingIndex = (index) => {
		setRatingIndex(index);
		setDisplayError(false);
	};

	const myNavigation = (fsId) => {
		props.setFSIdToGetDetails(fsId);
		navigateTo();
	};

	const navigateTo = () => {
		navigation.navigate('MovieDetails');
	};

	const addRatingAndSeenFlag = () => {
		// console.log('addRatingAndSeenFlag called', props.userDetails);
		if (ratingIndex === -1) {
			setDisplayError(true);
			return;
		}

		if (!props.userDetails) {
			navigation.navigate('Login');
			setModalVisible(false);
			return;
		}

		const obj = {
			user_id: props.userDetails.id,
			mobile: props.userDetails.mobile,
			fs_id: fsId,
			rating_code: ratingIndex
		};
		axios('http://192.168.0.100:3000/addRatingAndSeenFlag', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data);
				setRatingIndex(-1);
			},
			(error) => {
				console.log(error);
			}
		);

		setModalVisible(!modalVisible);
	};

	const Row = ({ item }) => {
		// console.log(item);
		return (
			<TouchableOpacity
				activeOpacity={1}
				style={{ flex: 1 }}
				// style={styles.slideInnerContainer}
				onPress={() => myNavigation(item.fs_id)}
			>
				<View style={{ marginLeft: 5, marginBottom: 5 }}>
					<Image
						source={{
							uri: 'https://image.tmdb.org/t/p/w300' + item.poster_path
						}}
						style={{ width: imageWidth || 160, height: imageHight || 200, alignSelf: 'center' }}
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
							{/* <AntDesign name="question" color={'#00FF00'} size={12} /> */}
						</View>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		);
	};

	const renderItem = ({ item }) => {
		// console.log('ItemX:  ', item.poster_path);
		return <Row item={item} />;
	};

	return (
		<View>
			<View>
				{title ? (
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
						{title}
					</Text>
				) : null}
				{horizontalFlag ? (
					<FlatList
						horizontal
						data={data}
						//data defined in constructor
						// ItemSeparatorComponent={ItemSeparatorView}
						//Item Separator View
						renderItem={({ item }) => <Row item={item} />}
						keyExtractor={(item, index) => index.toString()}
					/>
				) : (
					<FlatList
						data={data}
						//data defined in constructor
						// ItemSeparatorComponent={ItemSeparatorView}
						//Item Separator View
						renderItem={({ item }) => <Row item={item} />}
						keyExtractor={(item, index) => index.toString()}
						numColumns={2}
					/>
				)}
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
								fontSize: 15,
								fontWeight: '600'
							}}
						>
							What you feel about movie / series ?
						</Text>
						<Text
							style={{
								marginBottom: 15,
								textAlign: 'center',
								color: 'rgba(255,255,255,.9)',
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
		</View>
	);
};

const mapStateToProps = (state) => ({
	// trendingToday: state.AppReducer.trendingToday,
	// trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
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
export default connect(mapStateToProps, mapDispatchToProps)(FlatListStrip);
