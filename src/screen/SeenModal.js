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
import { SERVER_URL } from './utils/constants';

const RATTING_ARRAY = [ 'Loved It', 'Dumb But Entertaining', 'Just Time Pass', 'Worthless' ];
const SeenModal = (props) => {
	const { fsId, movieTitle, userId, mobile, modalVisible, navigation } = props;

	const [ ratingIndex, setRatingIndex ] = useState(-1);
	const [ displayError, setDisplayError ] = useState(false);

	const selectRatingIndex = (index) => {
		setRatingIndex(index);
		setDisplayError(false);
	};

	const addRatingAndSeenFlag = () => {
		// console.log('addRatingAndSeenFlag called', props.userDetails);
		if (ratingIndex === -1) {
			setDisplayError(true);
			return;
		}

		if (!userId && mobile) {
			navigation.navigate('Login');
			props.setModalVisible(false);
			setDisplayError(false);
			return;
		}

		const obj = {
			user_id: userId,
			mobile: mobile,
			fs_id: fsId,
			rating_code: ratingIndex
		};
		axios(SERVER_URL + '/addRatingAndSeenFlag', {
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

		props.setModalVisible(!modalVisible);
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				// Alert.alert("Modal has been closed.");
				props.setModalVisible(false);
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
							fontSize: 16,
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
						{movieTitle}
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
								props.setModalVisible(!modalVisible);
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
							<Text style={{ color: 'rgba(255,69,0, .9)', fontSize: 14 }}>Please Select Rating !!!</Text>
						</View>
					) : null}
				</View>
			</View>
		</Modal>
	);
};

export default SeenModal;
