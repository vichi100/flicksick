import React, { useState, useEffect, useRef } from 'react';
import {
	StyleSheet,
	Text,
	View,
	SafeAreaView,
	ScrollView,
	TextInput,
	Image,
	TouchableOpacity,
	AsyncStorage,
	ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
// import OtpInputs from "./OtpInputs";
import Counter from './Counter';
// import Button from "../components/Button";
import axios from 'axios';
import { setUserDetails } from '../../reducers/Action';
import OTPTextView from './OTPTextView';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { SERVER_MOVIE_API_URL, SERVER_USER_API_URL } from '../utils/constants';

const OtpScreen = (props) => {
	const { navigation } = props;
	const [ otp, setOTP ] = useState(null);
	const otpInput = useRef(null);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		setLoading(true);
		const otpX = Math.floor(Math.random() * 900000) + 100000;
		const mobileX = props.countryCode + props.userMobile;
		generateOTP(otpX, mobileX);
	}, []);

	const resendOTP = () => {
		const mobileX = props.countryCode + props.userMobile;
		generateOTP(otp, mobileX);
	};

	const generateOTP = (otpX, mobileX) => {
		setOTP(otpX);
		console.log('otp: ', otpX);
		const obj = {
			mobile: mobileX,
			otp: otpX
		};
		axios
			.post(
				SERVER_USER_API_URL + '/generateOTP',
				// SERVER_MOVIE_API_URL + "/addNewResidentialRentProperty",
				// await AsyncStorage.getItem("property")
				// JSON.stringify({ vichi: "vchi" })
				obj
			)
			.then(
				(response) => {
					console.log(response.data);
					setLoading(false);
				},
				(error) => {
					console.log(error);
				}
			);
	};

	const handleSubmit = (code) => {
		console.log(code);
		if (code === otp.toString()) {
			onSubmit();
		}
	};
	const onSubmit = () => {
		const mobileX = props.countryCode + props.userMobile;
		console.log('onSubmit: ', mobileX);
		const userObj = {
			mobile: mobileX,
			country: props.country,
			country_code: props.countryCode
		};
		axios
			.post(
				SERVER_USER_API_URL + '/getUserDetails',
				// SERVER_MOVIE_API_URL + "/addNewResidentialRentProperty",
				// await AsyncStorage.getItem("property")
				// JSON.stringify({ vichi: "vchi" })
				userObj
			)
			.then(
				(response) => {
					console.log(response.data);
					save(response.data).then(() => {
						navigation.navigate('BottomTabScreen');
					});
				},
				(error) => {
					console.log(error);
				}
			);
	};

	const save = async (userData) => {
		// console.log('userData: ' + JSON.stringify(userData));
		AsyncStorage.setItem('user_details', JSON.stringify(userData));
		props.setUserDetails(userData);
	};

	const onSkip = () => {
		navigation.navigate('BottomTabScreen');
	};

	return loading ? (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgba(0,0,0, .9)'
			}}
		>
			<ActivityIndicator animating size="large" color={'#fff'} />
			{/* <ActivityIndicator animating size="large" /> */}
		</View>
	) : (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
			<ScrollView>
				<View
					style={{
						marginTop: 50,
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center'
					}}
				>
					<Text style={{ color: '#F5F5F5', fontSize: 18, fontWeight: '500' }}>OTP sent to mobile</Text>
					<Text style={{ color: '#F5F5F5', fontSize: 16, fontWeight: '500', marginTop: 10 }}>
						{props.countryCode + ' ' + props.userMobile}
					</Text>
				</View>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						// width: '100%',
						marginLeft: 15,
						marginRight: 15,
						marginTop: 40
					}}
				>
					{/* <OTPTextView
						handleTextChange={(e) => {
							handleSubmit(e);
						}}
						// containerStyle={{ marginBottom: 20 }}
						// textInputStyle={{
						// 	borderRadius: 10,
						// 	borderWidth: 4
						// }}
						inputCount={6}
						inputCellLength={1}
					/> */}

					<OTPInputView
						// style={{ width: '80%', height: 200 }}
						pinCount={6}
						// code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
						// onCodeChanged = {code => { this.setState({code})}}
						autoFocusOnLoad
						codeInputFieldStyle={{
							width: 40,
							height: 40,
							borderWidth: 0.9,
							borderColor: '#fff',
							borderRadius: 5,
							fontSize: 18
						}}
						codeInputHighlightStyle={{ borderColor: '#03DAC6' }}
						onCodeFilled={(code) => {
							console.log(`Code is ${code}, you are good to go!`);
							handleSubmit(code);
						}}
						// placeholderCharacter={'*'}
						// placeholderTextColor={'red'}
						// selectionColor={"#03DAC6"}
					/>
				</View>

				<View style={{ margin: 20 }}>
					{/* <Text>Resend OTP in </Text> */}
					<Counter resendOTP={resendOTP} />
					{/* <Text>s</Text> */}
					{/* <Button title="NEXT" onPress={() => onSubmit()} /> */}
				</View>
			</ScrollView>
			<View style={{ position: 'absolute', bottom: 15, right: 15 }}>
				<TouchableOpacity onPress={() => onSkip()}>
					<Text style={{ color: '#fff' }}>{'Skip >>'}</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	userMobile: state.AppReducer.userMobile,
	country: state.AppReducer.country,
	countryCode: state.AppReducer.countryCode
});
const mapDispatchToProps = {
	setUserDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(OtpScreen);
// export default OtpScreen; XXXXXX is your OTP for mobile verification at Flick Sick
