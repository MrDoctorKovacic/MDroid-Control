import React from 'react';
import {
  Text,
  View,
  ToastAndroid,
  Dimensions,
  ScrollView,
  RefreshControl
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import styles from '../../assets/screenStyles.js';
import ButtonGroup from '../components/ButtonGroup.js';

import { UpdateSetting, SendCommand } from '../../actions/MDroidActions.js'; 

export default class SettingsScreen extends React.Component {
	componentDidMount() {
		loc(this);
	}

	componentWillUnMount() {
		rol();
	}

	constructor(props) {
		super(props);

		if (global.demoMode) {
			this.state = {
				angelEyes: "ON",
				sentryMode: "AUTO",
				exhaustNoise: "AUTO",
				variableSpeedVolume: "ON",
				toasted: 0,
				refreshing: false
			};
		} else {
			this.state = {
				angelEyes: "N/A",
				sentryMode: "N/A",
				exhaustNoise: "N/A",
				variableSpeedVolume: "N/A",
				toasted: 0,
				refreshing: false
			};

			// Continously get sensor data from controller
			this.interval = setInterval(() => {
				this._refreshSettingsData();
			}, 500);
		}
	}

	_onRefreshSettings = () => {
		this.setState({refreshing: true});
		this._refreshSettingsData(this).then(() => {
			this.setState({refreshing: false});
		});
	}

	// Sends a GET request to fetch settings data
	_refreshSettingsData() {
		try {
			componentHandler = this;
			return fetch("http://"+global.SERVER_HOST+"/settings")
			.then(function(response) {
				return response.json();
			})
			.then(function(sessionObject) {
				console.log(sessionObject);
				componentHandler.setState({
					angelEyes: ("VARIAN" in sessionObject && "ANGEL_EYES" in sessionObject["VARIAN"]) ? sessionObject["VARIAN"]["ANGEL_EYES"] : "N/A",
					sentryMode: ("ARTANIS" in sessionObject && "SENTRY_MODE" in sessionObject["ARTANIS"]) ? sessionObject["ARTANIS"]["SENTRY_MODE"] : "N/A",
					exhaustNoise: ("JAINA" in sessionObject && "EXHAUST_NOISE" in sessionObject["JAINA"]) ? sessionObject["JAINA"]["EXHAUST_NOISE"] : "N/A",
					variableSpeedVolume: ("JAINA" in sessionObject && "VSV" in sessionObject["JAINA"]) ? sessionObject["JAINA"]["VSV"] : "N/A",
				});
			}).catch((error) => {
				console.log(error);
				if(!this.state.toasted) {
					this.setState({toasted: 1});
					ToastAndroid.show("Failed to fetch settings data.", ToastAndroid.SHORT);
				}
			});
		}
		catch (error) {
			console.log(error);
			if(!this.state.toasted) {
				this.setState({toasted: 1});
				ToastAndroid.show("Failed to fetch settings data.", ToastAndroid.SHORT);
			}
		}
	}

	// Handler for update
	_requestUpdate = async (component, setting, value, reference) => {
		const httpStatus = await UpdateSetting(component, setting, value);
		if(httpStatus == "200") {
			ToastAndroid.show("Updated.", ToastAndroid.SHORT);
			this.setState({ [reference]:value });
		} else {
			ToastAndroid.show(httpStatus, ToastAndroid.SHORT);
		}
	}

  	render() {
		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width, this.props.isConnected);

		return (
		<ScrollView 
					refreshControl={<RefreshControl 
					refreshing={this.state.refreshing} 
					onRefresh={this._onRefreshSettings} />} 
					removeClippedSubviews={true} 
				>
		<View>
			<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
				<Text style={styles.mainTitleText}>Settings</Text>
			</View>
			<View style={[styles.largeContainer, styles.colContainer]}>
				<ButtonGroup 
					isConnected={this.props.isConnected} 
					title="Angel Eyes" 
					reference="angelEyes" 
					buttons={["Off", "Auto", "On"]} 
					buttonFunctions={[
						() => this._requestUpdate("VARIAN", "ANGEL_EYES", "OFF", "angelEyes"), 
						() => this._requestUpdate("VARIAN", "ANGEL_EYES", "AUTO", "angelEyes"), 
						() => this._requestUpdate("VARIAN", "ANGEL_EYES", "ON", "angelEyes")]} 
					status={this.state.angelEyes} />

				<ButtonGroup 
					isConnected={this.props.isConnected} 
					title="Sentry Mode" 
					reference="sentryMode" 
					buttons={["Off", "Auto", "On"]} 
					buttonFunctions={[
						() => this._requestUpdate("ARTANIS", "SENTRY_MODE", "OFF", "sentryMode"), 
						() => this._requestUpdate("ARTANIS", "SENTRY_MODE", "AUTO", "sentryMode"), 
						() => this._requestUpdate("ARTANIS", "SENTRY_MODE", "ON", "sentryMode")]} 
					status={this.state.sentryMode} />

				<ButtonGroup 
					isConnected={this.props.isConnected} 
					title="Pipe In Exhaust" 
					reference="exhaustNoise" 
					buttons={["Off", "Auto", "On"]} 
					buttonFunctions={[
						() => this._requestUpdate("JAINA", "EXHAUST_NOISE", "OFF", "exhaustNoise"), 
						() => this._requestUpdate("JAINA", "EXHAUST_NOISE", "AUTO", "exhaustNoise"), 
						() => this._requestUpdate("JAINA", "EXHAUST_NOISE", "ON", "exhaustNoise")]} 
					status={this.state.exhaustNoise} />

				<ButtonGroup 
					isConnected={this.props.isConnected} 
					title="Variable Speed Volume" 
					reference="variableSpeedVolume" 
					buttons={["Off", "On"]} 
					buttonFunctions={[
						() => this._requestUpdate("JAINA", "VSV", "OFF", "variableSpeedVolume"), 
						() => this._requestUpdate("JAINA", "VSV", "ON", "variableSpeedVolume")]} 
					status={this.state.variableSpeedVolume} />

				<ButtonGroup 
					isConnected={this.props.isConnected} 
					title="Restart Board" 
					reference="restartBoard" 
					buttons={["Restart Board"]} 
					buttonFunctions={[() => SendCommand("restart")]} />
			</View>
		</View>
		</ScrollView>
		);
  	}
}
