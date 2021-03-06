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
	AsyncStorage,
	Keyboard
} from 'react-native';
// import { AsyncStorage } from '@react-native-community/async-storage';
import axios from 'axios';
import { connect } from 'react-redux';
import {
	setTrendingTodayX,
	setDataFor,
	setFSIdToGetDetails,
	setUserMobile,
	setUserDetails,
	setCountryCode,
	setCountry
} from '../../reducers/Action';
import { TextInput, Provider } from 'react-native-paper';
import Dropdown from '../components/dropDown/Dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Snackbar from '../components/SnackbarComponent';

const countryList = [ { value: 'IN ( +91 )' }, { value: 'US ( +1 )' }, { value: 'UK ( +44 )' } ];

const Login = (props) => {
	const { navigation } = props;
	const [ showDropDown, setShowDropDown ] = useState(false);
	const [ country, setCountry ] = useState(null);
	const [ mobile, setMobile ] = useState(null);
	const [ otp, setOTP ] = useState('');
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ isVisible, setIsVisible ] = useState(false);

	const dismissSnackBar = () => {
		setIsVisible(false);
	};
	// const [ userDetails, setUserDetailsX ] = useState(null);

	useEffect(
		() => {
			// console.log("Login");
			// const userDetails = getUserDetails().then(// console.log(userDetails));
			// console.log("userDetails1: " + JSON.stringify(props.userDetails));
			if (props.userDetails !== null) {
				// props.setUserDetails(userDetails);
				// console.log("Login useffect: " + JSON.stringify(props.userDetails));
				navigation.navigate('BottomTabScreen');
			} else {
				getUserDetails();
			}
		},
		[ props.userDetails ]
	);

	const getUserDetails = async () => {
		// AsyncStorage.setItem("agent_details", JSON.stringify(agentDetails));

		// AsyncStorage.clear();

		// userDetailsStr: { "user_details": { "user_type": "agent", "id": "15476a82-997a-4bef-bf1b-b1236f6c177e", "expo_token": null, "name": null, "company_name": null, "mobile": "9833097595", "address": null, "city": null, "access_rights": "all", "works_for": ["15476a82-997a-4bef-bf1b-b1236f6c177e"] } }

		const userDetailsStr = await AsyncStorage.getItem('user_details');
		console.log('userDetailsStr: ' + JSON.stringify(userDetailsStr));
		if (userDetailsStr !== null) {
			props.setUserDetails(JSON.parse(userDetailsStr));
		}
	};

	const onSkip = () => {
		navigation.navigate('BottomTabScreen');
	};

	const onNext = () => {
		console.log(mobile);
		if (country === null) {
			setErrorMessage('Select Country Please!');
			setIsVisible(true);
			return;
		}
		if (mobile === null || mobile.trim().length === 0) {
			setErrorMessage('Enter Mobile Number Please!');
			setIsVisible(true);
			return;
		}
		props.setUserMobile(mobile);
		navigation.navigate('OtpScreen');
	};

	// const selectedItem = (item) => {
	// 	console.log(item);
	// };

	const setMobileNumber = (text) => {
		setMobile(text);
		setIsVisible(false);
	};

	const onChangeText = (text) => {
		console.log(text);
		setCountry(text);
		setIsVisible(false);
		if (text.indexOf('IN') > -1) {
			props.setCountry('IN');
			props.setCountryCode('+91');
		} else if (text.indexOf('US') > -1) {
			props.setCountry('US');
			props.setCountryCode('+1');
		} else if (text.indexOf('UK') > -1) {
			props.setCountry('UK');
			props.setCountryCode('+44');
		}
	};

	return (
		<SafeAreaView style={{ backgroundColor: 'rgba(0,0, 0, .9)', flex: 1 }}>
			<KeyboardAwareScrollView onPress={Keyboard.dismiss}>
				<ScrollView>
					<View style={{ flex: 1, alignItems: 'center' }}>
						<View style={{ marginTop: 30 }}>
							<Image
								source={require('../../../assets/img/flicksick.png')}
								style={{ width: 200, height: 200 }}
							/>
							<Text style={{ color: '#fff', textAlign: 'center', fontSize: 30 }}>Flick / Sick</Text>
						</View>

						{props.loginMessage ? (
							<Text style={{ color: '#A9A9A9', textAlign: 'center', fontSize: 16, marginTop: 20 }}>
								{props.loginMessage}
							</Text>
						) : null}

						{/* <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
				<Image source={require('../../../assets/img/flicksick.png')} style={{ width: 100, height: 100 }} />
				<Text style={{ color: '#fff', textAlign: 'center', fontSize: 44 }}>Flick / Sick</Text>
			</View> */}
						<View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10, marginTop: 90 }}>
							<Dropdown
								icon="chevron-down"
								iconColor="#E1E1E1"
								label="Country"
								data={countryList}
								containerStyle={{ width: 120, borderColor: '#fff', borderWidth: 0 }}
								// selectedItem={(item) => selectedItem(item)}
								onChangeText={onChangeText}
							/>
							<TextInput
								mode="outlined"
								style={{
									backgroundColor: 'rgba(0,0,0, 0.8)',
									borderColor: 'rgba(128,128,128, .9)',
									// borderWidth: 1,
									padding: 0,
									marginLeft: 20
								}}
								label="Mobile"
								value={mobile}
								onChangeText={(text) => setMobileNumber(text)}
								width={200}
								height={20}
								keyboardType={'numeric'}
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
						<View style={{ justifyContent: 'center', marginTop: 50 }}>
							<TouchableOpacity
								onPress={() => onNext()}
								style={{
									borderColor: '#fff',
									borderWidth: 1,
									width: 150,
									height: 40,
									borderRadius: 10
									// justifyContent: 'space-around'
								}}
							>
								<Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>NEXT</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAwareScrollView>
			<View style={{ position: 'absolute', bottom: 15, right: 15 }}>
				<TouchableOpacity onPress={() => onSkip()}>
					<Text style={{ color: '#fff' }}>{'Skip >>'}</Text>
				</TouchableOpacity>
			</View>
			<Snackbar
				visible={isVisible}
				textMessage={errorMessage}
				position={'top'}
				actionHandler={() => dismissSnackBar()}
				actionText="OK"
			/>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	userMobileNumber: state.AppReducer.userMobileNumber,
	userDetails: state.AppReducer.userDetails,
	loginMessage: state.AppReducer.loginMessage
});
const mapDispatchToProps = {
	setUserMobile,
	setUserDetails,
	setCountryCode,
	setCountry
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
// export default Login;
