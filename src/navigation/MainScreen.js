import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screen/login/Login';
import OtpScreen from '../screen/login/OtpScreen';
import BottomTabScreen from './BottomTabScreen';
// import ProfileForm from "../screen/ProfileForm";

export default function MainScreen() {
	const RootStack = createStackNavigator();

	return (
		<NavigationContainer>
			<RootStack.Navigator
				screenOptions={{
					headerShown: true,
					headerTitleAlign: 'center',
					headerTintColor: '#000',
					headerStyle: {
						backgroundColor: '#000'
					},
					headerBackTitleVisible: false,
					headerTintColor: 'rgba(255,255,255, .9)',
					headerTransparent: true
				}}
			>
				<RootStack.Screen
					name="Login"
					component={Login}
					options={{
						headerShown: false,
						headerBackTitleVisible: false
					}}
				/>
				<RootStack.Screen
					name="BottomTabScreen"
					component={BottomTabScreen}
					options={{
						headerShown: false,
						headerBackTitleVisible: false
					}}
				/>

				<RootStack.Screen
					name="OtpScreen"
					component={OtpScreen}
					options={{
						tabBarLabel: 'Home!',
						tabBarVisible: false,
						headerShown: true,
						title: null
					}}
				/>
				{/* <RootStack.Screen
                    name="ProfileForm"
                    component={ProfileForm}
                    options={{
                        headerTitle: "Profile Form",
                        headerShown: true,
                        // tabBarLabel: "Home!",
                        // tabBarVisible: false,
                        // headerTintColor: "rgba(0,0,0, .9)",
                        headerBackTitleVisible: false
                    }}
                /> */}
			</RootStack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0, .9)',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
