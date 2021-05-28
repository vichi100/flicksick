import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import OTPInputView from '@twotalltotems/react-native-otp-input';

export default class App extends React.Component {
	state = {
		code: ''
	};

	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity
					style={{ marginTop: 30 }}
					onPress={() => {
						this.setState({ code: '' });
					}}
				>
					<Text style={{ color: '#fff' }}>Resend</Text>
				</TouchableOpacity>

				<OTPInputView
					style={{ width: '80%', height: 200 }}
					pinCount={6}
					// code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
					// onCodeChanged = {code => { this.setState({code})}}
					autoFocusOnLoad
					codeInputFieldStyle={{
						width: 40,
						height: 40,
						borderWidth: 0.9,
						borderColor: '#fff',
						borderRadius: 5
					}}
					codeInputHighlightStyle={{ borderColor: '#03DAC6' }}
					onCodeFilled={(code) => {
						console.log(`Code is ${code}, you are good to go!`);
					}}
					// placeholderCharacter={'*'}
					// placeholderTextColor={'red'}
					// selectionColor={"#03DAC6"}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center'
	},

	borderStyleBase: {
		width: 30,
		height: 45,
		borderColor: '#fff',
		borderWidth: 1
	},

	borderStyleHighLighted: {
		borderColor: '#03DAC6'
	},

	underlineStyleBase: {
		width: 40,
		height: 40,
		borderWidth: 0.9,
		borderColor: '#fff',
		borderRadius: 5
		// borderBottomWidth: 1
	},

	underlineStyleHighLighted: {
		borderColor: '#03DAC6'
	}
});
