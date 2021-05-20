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
	AsyncStorage
} from 'react-native';
import { connect } from 'react-redux';
// import OtpInputs from "./OtpInputs";
import Counter from './Counter';
// import Button from "../components/Button";
import axios from 'axios';
import { setUserDetails } from '../../reducers/Action';
import OTPTextView from './OTPTextView';

const OtpScreen = (props) => {
	const { navigation } = props;
	const [ otp, setOTP ] = useState('');
	const otpInput = useRef(null);

	const getOtp = (otp) => {
		// console.log(otp);
		setOTP(otp);
	};

	const handleSubmit = (text) => {
		console.log(text);
		if (text.length === 6) {
			onSubmit();
		}
	};
	const onSubmit = () => {
		console.log('onSubmit: ', props.userMobile);
		const userObj = {
			mobile: props.userMobile,
			country: 'IN'
		};
		axios
			.post(
				'http://192.168.0.100:3000/getUserDetails',
				// SERVER_URL + "/addNewResidentialRentProperty",
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
		console.log('userData: ' + JSON.stringify(userData));
		AsyncStorage.setItem('user_details', JSON.stringify(userData));
		props.setUserDetails(userData);
	};

	return (
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
					<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>OTP sent to mobile</Text>
					<Text style={{ color: '#fff', fontSize: 16, fontWeight: '500', marginTop: 10 }}>
						+91 9833097595
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
					<OTPTextView
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
					/>
				</View>

				<View style={{ margin: 20 }}>
					{/* <Text>Resend OTP in </Text> */}
					<Counter />
					{/* <Text>s</Text> */}
					{/* <Button title="NEXT" onPress={() => onSubmit()} /> */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const mapStateToProps = (state) => ({
	userMobile: state.AppReducer.userMobile
});
const mapDispatchToProps = {
	setUserDetails
};

export default connect(mapStateToProps, mapDispatchToProps)(OtpScreen);
// export default OtpScreen;
