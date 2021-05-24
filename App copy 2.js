// import { StatusBar } from "expo-status-bar";
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainScreen from './src/navigation/MainScreen';
import { Provider } from 'react-redux';
import configureStore from './Store';

const store = configureStore();

export default function App() {
	return (
		<Provider store={store}>
			<MainScreen />
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
