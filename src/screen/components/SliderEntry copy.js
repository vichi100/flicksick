import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from '../react-native-snap-carousel/index';
import styles from '../styles/SliderEntry.style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { setTMDBIdToGetDetails } from '../../reducers/Action';

// https://snack.expo.io/@vichi/45c79d   image overlay text

class SliderEntry extends Component {
	get image() {
		const { data, parallax, parallaxProps, even } = this.props;

		//  console.log("https://image.tmdb.org/t/p/w300" + poster_path)

		return false ? (
			<View
				style={{
					flex: 1,
					alignItems: 'stretch',
					justifyContent: 'center',
					paddingTop: 90,
					backgroundColor: '#ecf0f1'
				}}
			>
				<ParallaxImage
					source={{ uri: data.poster_path }}
					dataText={'vichi'}
					containerStyle={[ styles.imageContainer, even ? styles.imageContainerEven : {} ]}
					style={styles.image}
					parallaxFactor={0.35}
					showSpinner={true}
					spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
					{...parallaxProps}
				/>
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 300,
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<Text>Your overlay text</Text>
				</View>
			</View>
		) : (
			<View
				style={{
					flex: 1,
					alignItems: 'stretch',
					justifyContent: 'center',
					// paddingTop: 90,
					backgroundColor: '#ecf0f1'
				}}
			>
				<Image
					source={{ uri: 'https://image.tmdb.org/t/p/w300' + data.poster_path }}
					style={{ flexGrow: 1 }}
					resizeMode={'cover'}
				/>
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						// height: 100,
						// width: 70,
						// backgroundColor: "rgba(0,0,0, .4)",
						borderTopRightRadius: 10,
						borderBottomRightRadius: 10,
						flexDirection: 'row',
						justifyContent: 'space-between',
						padding: 5,
						width: '100%',
						height: '100%'
						// bo
						// paddingLeft: 15,
						// paddingRight: 15
					}}
				>
					{/* <LinearGradient
            colors={["rgba(0,0,0, .2)", "transparent"]}
            start={[0, 0]}
            end={[1, 1]}
            locations={[0.01, 0.99]}
            style={{
              flex: 1,
              // height: 50,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          > */}
					<View style={{ flexDirection: 'row' }}>
						<AntDesign name="eyeo" color={'#7CFC00'} size={20} />
						<View style={{ marginLeft: 5 }} />
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>100</Text>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<Entypo name="list" color={'#00FFFF'} size={20} />
						<View style={{ marginLeft: 5 }} />
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>250</Text>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<AntDesign name="hearto" color={'red'} size={20} />
						<View style={{ marginLeft: 5 }} />
						<Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>90%</Text>
					</View>
					{/* </LinearGradient> */}
				</View>
				<View style={{ position: 'absolute', bottom: 15, right: 10 }}>
					<Text
						style={{
							color: '#fff',
							fontSize: 14,
							fontWeight: '500',
							textTransform: 'capitalize'
						}}
					>
						{data.media_type.toUpperCase() === 'tv'.toUpperCase() ? 'Series' : data.media_type}
					</Text>
				</View>
			</View>
		);
	}

	navigateTo(tmdbId) {
		// console.log("navi");
		this.props.setTMDBIdToGetDetails(tmdbId);
		this.props.navigateTo();
	}

	render() {
		const { data, even } = this.props;

		return (
			<TouchableOpacity
				activeOpacity={1}
				style={styles.slideInnerContainer}
				onPress={() => this.navigateTo(data.id)}
			>
				{/* <View style={styles.shadow} /> */}
				<View style={[ styles.imageContainer, even ? styles.imageContainerEven : {} ]}>
					{this.image}

					<View style={[ styles.radiusMask, even ? styles.radiusMaskEven : {} ]} />
				</View>
			</TouchableOpacity>
		);
	}
}

// const mapStateToProps = (state) => ({
//   trendingToday: state.AppReducer.trendingToday,
//   trendingCurrentWeek: state.AppReducer.trendingCurrentWeek,
// });

// const mapDispatchToProps = () => ({
//   setTrendingTodayX,
//   setTrendingCurrentWeekY,
// });
const mapDispatchToProps = {
	setTMDBIdToGetDetails
};
export default connect(null, mapDispatchToProps)(SliderEntry);
