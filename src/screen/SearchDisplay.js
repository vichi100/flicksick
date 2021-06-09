import React, { useEffect, useState, useRef, PureComponent } from 'react';
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
	RefreshControl
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import * as Font from 'expo-font';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Carousel, { Pagination } from './react-native-snap-carousel/index';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import SliderEntry from './components/SliderEntry';
import styles, { colors } from './styles/index.style';
import { ENTRIES1, ENTRIES2 } from './static/entries';
import { scrollInterpolators, animatedStyles } from './utils/animations';
import axios from 'axios';
import { connect } from 'react-redux';
import { setTrendingTodayX, setDataFor, setUserContactDict } from '../reducers/Action';
import FlatListStrip from './FlatListStrip';
import * as Contacts from 'expo-contacts';
import { SERVER_URL } from './utils/constants';

export default class SearchDisplay extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			selectedFriendMobile: null
		};
	}

	render() {
		const { item } = this.props;
		return (
			<TouchableOpacity
				activeOpacity={1}
				// style={styles.slideInnerContainer}
				onPress={() => this.displayFriendMovieList(item)}
			>
				<View style={{ marginTop: 10 }} />

				<View
					style={{
						borderColor:
							this.state.selectedFriendMobile === item.mobile
								? 'rgba(255,255,255, .9)'
								: 'rgba(105,105,105, .4)',
						borderWidth: this.state.selectedFriendMobile === item.mobile ? 0.9 : 0.3,
						borderRadius: 30,
						padding: 15,
						marginLeft: 5,
						marginRight: 5,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<View
						style={{
							paddingLeft: 10,
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '80%',
							alignItems: 'center'
						}}
					>
						<View>
							<Text style={{ color: '#F5F5F5', fontSize: 16, fontWeight: '600' }}>{item.name}</Text>
							<Text style={{ color: '#A9A9A9', fontSize: 12, fontWeight: '400', paddingTop: 5 }}>
								{item.mobile}
							</Text>
						</View>

						<Text
							style={{
								color: 'rgba(0,191,255, .9)',
								fontSize: 16,
								fontWeight: '600',
								textAlign: 'center'
							}}
						>
							Invite
						</Text>
					</View>
					{item.status === 'on' ? (
						<View>
							<FontAwesome name="circle" color={'#3CB371'} size={15} />
						</View>
					) : item.status === 'off' ? (
						<View>
							<FontAwesome name="circle" color={'#FF8C00'} size={17} />
						</View>
					) : (
						<View>
							<FontAwesome name="minus-circle" color={'#DC143C'} size={15} />
						</View>
					)}
				</View>
			</TouchableOpacity>
		);
	}
}
