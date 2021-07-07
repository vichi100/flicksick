import React, { useState, useEffect } from 'react';
import {
	View,
	SafeAreaView,
	StyleSheet,
	Modal,
	TouchableHighlight,
	Share,
	Linking,
	FlatList,
	Image,
	AsyncStorage
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { Title, Caption, Text, TouchableRipple } from 'react-native-paper';
import { connect } from 'react-redux';
// import Button from "../components/Button";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TextInput, Provider } from 'react-native-paper';

import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import { setUserDetails } from '../reducers/Action';
import axios from 'axios';
import { SERVER_MOVIE_API_URL, SERVER_USER_API_URL, FLICKSICK_IMAGE_URL } from './utils/constants';
// import Share from "react-native-share";

// import files from '../assets/filesBase64';

// https://github.com/itzpradip/Food-Finder-React-Native-App/blob/master/screens/EditProfileScreen.js
// https://www.youtube.com/watch?v=mjJzaiGkaQA

// const OTTProvidesList = [
// {netflix: require('../../assets/img/netflix.jpeg')},
// 		{prime: require('../../assets/img/prime.jpeg')},
// 		{erosnow: require('../../assets/img/erosnow.jpeg')},
// 		{hotstar: require('../../assets/img/hotstar.jpeg')},
// 		{jiocinema: require('../../assets/img/jiocinema.jpeg')},
// 		{sonyliv: require('../../assets/img/sonyliv.jpeg')},
// 		{zee5: require('../../assets/img/zee5.jpeg')}
// ];

const Profile = (props) => {
	const { navigation } = props;
	const [ modalVisible, setModalVisible ] = useState(false);
	const [ OTTProvidesList, setOTTProvidesList ] = useState([
		require('../../assets/img/netflix.jpeg'),
		require('../../assets/img/prime.jpeg'),
		require('../../assets/img/erosnow.jpeg'),
		require('../../assets/img/hotstar.jpeg'),
		require('../../assets/img/jiocinema.jpeg'),
		require('../../assets/img/sonyliv.jpeg'),
		require('../../assets/img/zee5.jpeg')
	]);

	const [ selectedList, setSelectedList ] = useState([
		require('../../assets/img/netflix.jpeg'),
		require('../../assets/img/prime.jpeg')
	]);

	const [ name, setName ] = useState(null);

	const updateName = () => {
		if (name === null) {
			return;
		}
		const obj = {
			name: name,
			mobile: props.userDetails.mobile
		};
		axios(SERVER_USER_API_URL + '/updateName', {
			method: 'post',
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			},
			data: obj
		}).then(
			(response) => {
				// console.log(response.data);
				if (response.data === 'success') {
					save();
				}
				setModalVisible(false);
			},
			(error) => {
				setModalVisible(false);
				console.log(error);
			}
		);
	};

	const save = async () => {
		props.userDetails.name = name;
		AsyncStorage.setItem('user_details', JSON.stringify(props.userDetails));
		// props.setUserDetails(userData);
	};

	const makeCall = async () => {
		const url = 'tel://9833097595';
		Linking.openURL(url);
	};

	const onShare = async () => {
		// https://docs.expo.io/versions/latest/react-native/share/
		try {
			const result = await Share.share({
				message: 'React Native | A framework for building native apps using React'
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const renderOTTProvider = ({ item }) => {
		// console.log(item);
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					marginRight: 20,
					borderWidth: 0.8,
					borderColor: '#696969',
					padding: 10,
					borderRadius: 10
				}}
			>
				{/* <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>{item}</Text> */}
				<Image
					source={{
						uri: FLICKSICK_IMAGE_URL + item
					}}
					style={{ width: 40, height: 40 }}
				/>
			</View>
		);
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: '#000'
			}}
		>
			<View style={styles.userInfoSection}>
				<View style={{ flexDirection: 'row', marginTop: 25 }}>
					<Avatar
						// source={{
						// 	uri: 'https://api.adorable.io/avatars/800/abott@adorable.png'
						// }}
						avatarStyle={{ borderWidth: 0.7, borderColor: '#00FFFF' }}
						rounded
						title={
							props.userDetails.name ? (
								<Text style={{ color: '#D3D3D3' }}>{props.userDetails.name[0]}</Text>
							) : (
								<Text style={{ color: '#D3D3D3' }}>G</Text>
							)
						}
						size={80}
					/>
					<View style={{ marginLeft: 20 }}>
						<Title
							style={[
								styles.title,
								{
									marginTop: 15,
									marginBottom: 5,
									color: '#DCDCDC'
								}
							]}
						>
							{props.userDetails && props.userDetails.name ? props.userDetails.name : 'Guest'}
						</Title>
						<Caption style={styles.caption}>
							{props.userDetails && props.userDetails.mobile ? props.userDetails.mobile : null}
						</Caption>
					</View>
				</View>
				<TouchableRipple
					onPress={() => setModalVisible(true)}
					style={{ marginTop: 10, position: 'absolute', top: 10, right: 10 }}
				>
					<Feather name="edit" color="#696969" size={23} />
				</TouchableRipple>
			</View>

			<View style={{}}>
				<TouchableRipple onPress={() => onShare()}>
					<View style={styles.menuItem}>
						<Icon name="share-outline" color="#FF6347" size={25} />
						<Text style={styles.menuItemText}>Tell Your Friends</Text>
					</View>
				</TouchableRipple>
				<View>
					<View style={styles.menuItem}>
						<FontAwesome5 name="play" color="#FF6347" size={25} />
						<Text style={styles.menuItemText}>OTT Platforms</Text>
					</View>
					<View style={{ marginLeft: 50 }}>
						<FlatList
							horizontal
							data={Object.values(props.utilData.ott_provider)}
							//data defined in constructor
							// ItemSeparatorComponent={ItemSeparatorView}
							//Item Separator View
							renderItem={(item) => renderOTTProvider(item)}
							keyExtractor={(item, index) => index.toString()}
						/>
					</View>
				</View>

				<TouchableRipple onPress={() => makeCall()} style={{ marginTop: 10 }}>
					<View style={styles.menuItem}>
						<AntDesign name="customerservice" color="#FF6347" size={25} />
						<Text style={styles.menuItemText}>Support</Text>
					</View>
				</TouchableRipple>
				{/* <TouchableRipple onPress={() => {}}>
					<View style={styles.menuItem}>
						<Icon name="settings-outline" color="#FF6347" size={25} />
						<Text style={styles.menuItemText}>Settings</Text>
					</View>
				</TouchableRipple> */}
				<TouchableRipple onPress={() => {}}>
					<View style={styles.menuItem}>
						<MaterialIcons name="local-police" color="#FF6347" size={25} />
						<Text style={styles.menuItemText}>Privacy Policy</Text>
					</View>
				</TouchableRipple>
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
							height: 200,
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
						<View style={{ height: 30, width: 300 }}>
							<TextInput
								mode="outlined"
								style={{
									backgroundColor: 'rgba(0,0,0, 0.8)',
									// borderColor: 'rgba(128,128,128, .9)',
									// borderWidth: 1,
									padding: 0
									// height: 20
									// marginLeft: 20
								}}
								label="Name"
								value={name}
								onChangeText={(text) => setName(text)}
								width={300}
								// height={5}
								// keyboardType={'numeric'}
								returnKeyType={'done'}
								theme={{
									colors: {
										placeholder: 'rgba(220,220,220,.9)',
										text: 'white',
										primary: 'rgba(0,191,255, .9)',
										underlineColor: 'rgba(0,0,0, 0.8)',
										backgroundColor: 'rgba(0,0,0, 0.8)'
									}
								}}
							/>
						</View>

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
									Cancel
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								// styles={{ ...stylesX.applyButton }}
								onPress={() => {
									updateName();
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
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	userDetails: state.AppReducer.userDetails,
	utilData: state.AppReducer.utilData
});

const mapDispatchToProps = {
	// setUserMobile,
	setUserDetails
	// setPropReminderList
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	userInfoSection: {
		paddingHorizontal: 30,
		marginBottom: 25
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold'
	},
	caption: {
		fontSize: 14,
		lineHeight: 14,
		fontWeight: '500',
		color: '#dddddd'
	},
	row: {
		flexDirection: 'row',
		marginBottom: 10
	},
	infoBoxWrapper: {
		borderBottomColor: '#dddddd',
		borderBottomWidth: 1,
		borderTopColor: '#dddddd',
		borderTopWidth: 1,
		flexDirection: 'row',
		height: 100
	},
	infoBox: {
		width: '50%',
		alignItems: 'center',
		justifyContent: 'center'
	},
	menuWrapper: {
		marginTop: 10
	},
	menuItem: {
		flexDirection: 'row',
		paddingVertical: 15,
		paddingHorizontal: 30
	},
	menuItemText: {
		color: '#777777',
		marginLeft: 20,
		fontWeight: '600',
		fontSize: 16,
		lineHeight: 26
	},
	dealChart: {
		marginTop: 10
	},
	componentContainer: {
		// flex: 1,
		marginBottom: 20
	},
	cardContainer: {
		flexDirection: 'row',
		margin: (10, 10, 10, 3)
		// width: "90%"
	},
	bar: {
		shadowOpacity: 0.0015 * 5 + 0.18,
		shadowRadius: 0.54 * 1,
		shadowOffset: {
			height: 0.6 * 1
		},
		backgroundColor: '#ffffff'
		// width: "90%"
		// marginLeft: 15,
		// marginRight: 15
	},
	barHeader: {
		fontSize: 16,
		fontWeight: '600',
		alignContent: 'center',
		padding: 5,
		width: '100%',
		textAlign: 'center'
	},
	card: {
		padding: 15,
		shadowOpacity: 0.0015 * 5 + 0.18,
		shadowRadius: 0.54 * 5,
		shadowOffset: {
			height: 0.6 * 5
		},
		backgroundColor: '#ffffff'
	},
	cardContent: {
		flexDirection: 'row',
		margin: 10
	},
	innerCard: {
		shadowOpacity: 0.0015 * 5 + 0.18,
		shadowRadius: 0.54 * 5,
		shadowOffset: {
			height: 0.6 * 5
		},
		backgroundColor: '#ffffff',
		padding: 20
	},
	cardHeader1: {
		fontSize: 16,
		fontWeight: '600',
		alignContent: 'center',
		textAlign: 'left'
	},
	cardHeader2: {
		fontSize: 16,
		fontWeight: '600',
		alignContent: 'center',
		textAlign: 'right'
	},
	text: {
		color: '#101010',
		fontSize: 24,
		fontWeight: 'bold',
		margin: 5
	},
	space: {
		margin: 5
	},
	buttonContainer: {
		backgroundColor: '#222',
		borderRadius: 5,
		padding: 10,
		margin: 20
	},
	buttonText: {
		fontSize: 20,
		color: '#fff'
	},
	card: {
		flex: 1,
		justifyContent: 'center',
		shadowOpacity: 0.0015 * 5 + 0.18,
		shadowRadius: 0.54 * 5,
		shadowOffset: {
			height: 0.6 * 5
		},
		backgroundColor: 'white'
	},
	cardImage: {
		// alignSelf: "stretch",
		marginBottom: 16,
		flex: 1,
		width: '100%',
		height: 'auto'
		// justifyContent: "center",
		// alignItems: "stretch"
	},
	headerContainer: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		paddingRight: 16,
		paddingLeft: 16,
		paddingBottom: 16,
		paddingTop: 16,
		width: '100%',
		backgroundColor: '#ffffff'
	},
	title: {
		fontSize: 16,
		fontWeight: '600'
	},
	subTitle: {
		fontSize: 14,
		fontWeight: '400',
		color: 'rgba(255 ,255 ,255 , 0.87)'
	},
	detailsContainer: {
		// borderBottomWidth: 1,
		borderTopColor: '#fff59d',
		borderTopWidth: 1
	},

	details: {
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	subDetailsTitle: {
		fontSize: 12,
		fontWeight: '400'
	},
	subDetailsValue: {
		fontSize: 14,
		fontWeight: '600'
	},
	verticalLine: {
		height: '100%',
		width: 1,
		backgroundColor: '#909090'
	},
	MainContainer: {
		// flex: 1,
		// justifyContent: "center",
		// alignItems: "center"
	},

	Main_Sliding_Drawer_Container: {
		// flex: 1,
		flexDirection: 'row',
		backgroundColor: '#616161',
		height: 67
		// paddingHorizontal: 10
		// justifyContent: "center",
		// alignItems: "center"
	},

	TextStyle: {
		fontSize: 25,
		padding: 10,
		textAlign: 'center',
		color: '#FF5722'
	},
	centeredView1: {
		flex: 1,
		justifyContent: 'center',
		alignContent: 'center',
		marginTop: 22,
		marginBottom: 20
	},
	modalView: {
		margin: 20,
		height: 230,
		backgroundColor: 'white',
		borderRadius: 20,
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
	},
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
		// marginTop: 20,
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
		// marginTop: 20,
		marginLeft: 10,
		marginRight: 30
	},
	modalText: {
		// marginBottom: 15,
		textAlign: 'center'
	}
});
