import React from 'react';
import {Dimensions, StatusBar, StyleSheet, View, ScrollView, Image, RefreshControl} from 'react-native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
	listenOrientationChange as loc,
	removeOrientationListener as rol
} from 'react-native-responsive-screen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Swiper from 'react-native-swiper';

// Actions
import { PingHost } from './actions/MDroidActions.js';

// Screens
import ControlsScreen from './ui/screens/ControlsScreen.js';
import SettingsScreen from './ui/screens/SettingsScreen.js';
import SystemScreen from './ui/screens/SystemScreen.js';
import {serverHost} from './config.json';

// Config
global.SERVER_HOST = serverHost;
global.demoMode = false;

export default class App extends React.Component {

	componentDidMount() {
		loc(this);

		if (global.demoMode) {
			this.setState({
				isConnected: true
			});
		} else {
			PingHost(this);

			// We check less frequently if we're already connected
			var pingHostInvervalDuration = this.state.isConnected ? 10000 : 2000 

			// Clear interval first, to make sure we're not creating duplicate loops
			if (this.interval) {
				clearInterval(this.interval);
			}

			// Continously get sensor data from controller
			this.interval = setInterval(() => {
				PingHost(this);
			}, pingHostInvervalDuration);
		}
	}

	componentWillUnMount() {
		rol();
	}

	constructor(props) {
		super(props);

		this.state = {
			isConnected: false,
			refreshing: false,
		};
	}
	
	_onRefresh = () => {
		this.setState({refreshing: true});
		PingHost(this).then(() => {
			this.setState({refreshing: false});
		});
	}

	render() {
		changeNavigationBarColor('#000000', false);

		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var isVertical = (width < height);
		var image = isVertical ? require('./assets/images/1.png') : require('./assets/images/3-rotated.png');
		var styles = StyleSheet.create({
			container: {
				backgroundColor: '#000',
				height: hp('100%'),
				width: wp('100%'),
				maxHeight: isVertical ? 'auto' : 650,
				flexDirection: isVertical ? 'column' : 'row'
			},
			swiperContainer: {
				marginTop: 30,
			},
			imageContainer: {
				width: isVertical ? wp('80%') : wp('30%'),
				height: isVertical ? 'auto' : hp('80%'),
				marginTop: isVertical ? hp('5%') : hp('15%'),
				marginLeft: isVertical ? wp('10%') : 0,
				color: "#FFF",
				flexDirection: 'row',
				zIndex: isVertical ? 0 : 2
			},
			mainLeftImage: {
				height: isVertical ? hp('20%') : hp('80%'),
				width: isVertical ? wp("80%") : wp('20%'),
				marginLeft: isVertical ? 0 : wp('7.5%'),
				flexDirection: 'column',
				resizeMode:'contain'
			},
			mainContainer: {
				width: isVertical ? wp('100%') : wp('70%'),
				height: hp('60%'),
			},
			viewBlocker: isVertical ? {} : {
				backgroundColor: '#000000',
				width: wp('30%'),
				height: hp('100%'),
				left: 0,
				position: 'absolute'
			}
		});

		console.log(JSON.stringify(this.props));
		return (
			<View style={[styles.container]} onLayout={this._onLayout}>
				<StatusBar barStyle="dark-content" backgroundColor="#000000" translucent={true} />
				<View style={styles.imageContainer}>
					<Image style={styles.mainLeftImage} source={image} />
				</View>
				<Swiper
					index={0}
					style={styles.swiperContainer}
					showsPagination={true}
					opacity={this.state.isConnected ? 1 : 0.7}
					dotColor='rgba(255,255,255,.2)'
					activeDotColor='rgba(255,255,255,1)'>
					<ScrollView 
						removeClippedSubviews={true} 
						style={styles.mainContainer}>
						<ControlsScreen isConnected={this.state.isConnected} />
					</ScrollView>
						<SystemScreen isConnected={this.state.isConnected} />
					
					<ScrollView 
						refreshControl={<RefreshControl 
						refreshing={this.state.refreshing} 
						onRefresh={this._onRefresh} />} 
						removeClippedSubviews={true} 
						style={styles.mainContainer}>
						<SettingsScreen isConnected={this.state.isConnected} />
					</ScrollView>
				</Swiper>
				<View style={styles.viewBlocker} />
			</View>
		);
	}
}
