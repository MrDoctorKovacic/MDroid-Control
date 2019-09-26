import React from 'react';
import {
	Dimensions, 
	StatusBar, 
	ToastAndroid, 
	RefreshControl, 
	ScrollView, 
	StyleSheet, 
	View, 
	Image
} from 'react-native';
import {
	widthPercentageToDP as wp,
	heightPercentageToDP as hp,
	listenOrientationChange as loc,
	removeOrientationListener as rol
} from 'react-native-responsive-screen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Swiper from 'react-native-swiper';

// Actions
import { PingHost, CreateSocket, SendToSocket, postRequest, getRequest } from './actions/MDroidActions.js';

// Screens
import ControlsScreen from './ui/screens/ControlsScreen.js';
import SettingsScreen from './ui/screens/SettingsScreen.js';
import GpsScreen from './ui/screens/GpsScreen.js';
import SystemScreen from './ui/screens/SystemScreen.js';
import PowerScreen from './ui/screens/PowerScreen.js';

// Config
import {serverHost, token} from './config.json';
global.SERVER_HOST = serverHost;
global.TOKEN = token;
global.demoMode = false;
global.ws = undefined;

export default class App extends React.Component {
	createWebsocket() {
		global.ws = CreateSocket();
		global.ws.onclose = (e) => {
			// connection closed
			console.log("Websocket closed. "+e.message);
			console.log(e.code, e.reason);
			ToastAndroid.show("Websocket closed: "+e.message, ToastAndroid.SHORT);
		
			this.setState({
				isConnected: false
			});

			// Try reconnecting
			setTimeout(() => {
				this.createWebsocket();
			}, 1500);
		};
		global.ws.onopen = () => {
			this.socketReady = false;
			this.queue = [];
		}
		global.ws.onmessage = (e) => {
			// a message was received
			console.log(e.data);
			try {
				this.handleSocketMessage(JSON.parse(e.data))
			} catch (error) {
				console.log(error);
			}
		};
		global.ws.onerror = (e) => {
			// an error occurred
			console.log(e.message);
			console.log(e.reason);
			global.ws.close();
		};
	}

	handleSocketMessage(message) {
		if ("output" in message && "method" in message && message["method"] != "request") {
			if (!this.state.isConnected) {
				this.setState({
					isConnected: true
				});
			} else if("status" in message && "ok" in message && message["ok"]) {
				if (message["status"] == "/settings") {
					this.setState({
						settings: message["output"]
					});
				} else if (message["status"] == "/session") {
					this.setState({
						session: message["output"]
					});
				} else if (message["status"] == "/session/gps") {
					this.setState({
						gps: message["output"]
					});
				} else if (message["status"] != "success") {
					// Attempt to only update the changed section
					path = message["status"].split("/");
					if(path[1] == "session") {
						this.messageQueue.push(["GET", "/session", ""])
					} else if (path[1] == "settings") {
						this.messageQueue.push(["GET", "/settings", ""])
					} else {
						this._requestFullUpdate();
					}
				}
			}
		}
		// Send next message
		if (this.messageQueue.length > 0) {
			dataArray = this.messageQueue.pop();
			SendToSocket(global.ws, dataArray[0], dataArray[1], dataArray[2])
		} else {
			this.socketReady = true;
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextState.isConnected && this.state.isConnected == false) {
			this._requestFullUpdate();
		}
	}

	_requestFullUpdate = async () => {
		console.log("Requesting full update");
		this.messageQueue.push(["GET", "/settings", ""])
		this.messageQueue.push(["GET", "/session", ""])
		this.messageQueue.push(["GET", "/session/gps", ""])
		//this.messageQueue.push(["POST", "/session/LTE_ON", "{\"value\": \"FALSE\"}"])
		this.checkQueue();
	}

	checkQueue() {
		if(this.socketReady && this.messageQueue.length != 0) {
			this.socketReady = false;
			dataArray = this.messageQueue.pop();
			SendToSocket(global.ws, dataArray[0], dataArray[1], dataArray[2])
		}
	}

	componentDidMount() {
		loc(this);

		if (global.demoMode) {
			this.setState({
				isConnected: true
			});
		} else {
			this.checkQueue();
			//PingHost(this);

			// We check less frequently if we're already connected
			/*var pingHostInvervalDuration = this.state.isConnected ? 10000 : 2000 

			// Clear interval first, to make sure we're not creating duplicate loops
			if (this.interval) {
				clearInterval(this.interval);
			}

			// Continously get sensor data from controller
			this.interval = setInterval(() => {
				PingHost(this);
			}, pingHostInvervalDuration);*/
		}
	}

	componentWillUnMount() {
		rol();
	}

	constructor(props) {
		super(props);

		this.createWebsocket();

		this.messageQueue = [];

		this.state = {
			isConnected: false,
			refreshing: false,
		};
	}

	_onRefresh = () => {
		this.setState({refreshing: true});
		this._requestFullUpdate(this).then(() => {
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
					
					<ControlsScreen postRequest={postRequest} getRequest={getRequest} isConnected={this.state.isConnected} />
					
					<ScrollView 
						refreshControl={<RefreshControl 
						refreshing={this.state.refreshing} 
						onRefresh={this._onRefresh} />} 
						removeClippedSubviews={true} 
					>
						<GpsScreen postRequest={postRequest} getRequest={getRequest} settings={this.state.gps} isConnected={this.state.isConnected} />
					</ScrollView>

					<ScrollView 
						refreshControl={<RefreshControl 
						refreshing={this.state.refreshing} 
						onRefresh={this._onRefresh} />} 
						removeClippedSubviews={true} 
					>
						<SystemScreen postRequest={postRequest} getRequest={getRequest} settings={this.state.session} isConnected={this.state.isConnected} />
					</ScrollView>

					<ScrollView 
						refreshControl={<RefreshControl 
						refreshing={this.state.refreshing} 
						onRefresh={this._onRefresh} />} 
						removeClippedSubviews={true} 
					>
						<SettingsScreen postRequest={postRequest} getRequest={getRequest} settings={this.state.settings} isConnected={this.state.isConnected} />
					</ScrollView>

					<ScrollView 
						refreshControl={<RefreshControl 
						refreshing={this.state.refreshing} 
						onRefresh={this._onRefresh} />} 
						removeClippedSubviews={true} 
					>
						<PowerScreen postRequest={postRequest} getRequest={getRequest} settings={this.state.settings} isConnected={this.state.isConnected} />
					</ScrollView>
				</Swiper>
				<View style={styles.viewBlocker} />
			</View>
		);
	}
}
