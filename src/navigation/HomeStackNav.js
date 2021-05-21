import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screen/Home';
import MovieDetails from '../screen/MovieDetails';

const HomeStack = createStackNavigator();

const HomeStackNav = () => {
	return (
		<HomeStack.Navigator
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
			<HomeStack.Screen
				name="Home"
				component={Home}
				options={{
					tabBarLabel: 'Home!',
					tabBarVisible: false,
					headerShown: false
				}}
			/>
			{/* <HomeStack.Screen
        name="MovieDetails"
        component={MovieDetails}
        options={{
          tabBarLabel: "Home!",
          tabBarVisible: false,
          headerShown: true,
          title: null,
        }}
      /> */}
		</HomeStack.Navigator>
	);
};

export default HomeStackNav;
