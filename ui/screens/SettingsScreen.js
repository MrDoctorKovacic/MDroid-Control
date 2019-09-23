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
		this._refreshSettingsData();
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
				wireless: "AUTO",
				toasted: 0,
				refreshing: false
			};
		} else {
			this.state = {
				angelEyes: "N/A",
				sentryMode: "N/A",
				exhaustNoise: "N/A",
				variableSpeedVolume: "N/A",
				wireless: "N/A",
				toasted: 0,
				refreshing: false,
				fails: 0
			};

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
			return fetch("http://"+global.SERVER_HOST+"/settings")
			.then((response) => response.json())
			.then((sessionObject) => {
				if(sessionObject["ok"]) {
					jsonData = sessionObject["output"];
					this.setState({
						wireless: ("BRIGHTWING" in jsonData && "POWER" in jsonData["BRIGHTWING"]) ? jsonData["BRIGHTWING"]["LTE"] : "N/A",
						angelEyes: ("VARIAN" in jsonData && "ANGEL_EYES" in jsonData["VARIAN"]) ? jsonData["VARIAN"]["ANGEL_EYES"] : "N/A",
						sentryMode: ("ARTANIS" in jsonData && "SENTRY_MODE" in jsonData["ARTANIS"]) ? jsonData["ARTANIS"]["SENTRY_MODE"] : "N/A",
						exhaustNoise: ("JAINA" in jsonData && "EXHAUST_NOISE" in jsonData["JAINA"]) ? jsonData["JAINA"]["EXHAUST_NOISE"] : "N/A",
						variableSpeedVolume: ("JAINA" in jsonData && "VSV" in jsonData["JAINA"]) ? jsonData["JAINA"]["VSV"] : "N/A",
					}, function(){
			
					});
				}
			})
			.catch((error) => {
				this.setState({
					fails: this.state.fails + 1
				});
				console.log(error);
				if(this.state.fails > 4 && !this.state.toasted) {
					this.setState({toasted: 1});
					ToastAndroid.show("Failed to fetch settings data.", ToastAndroid.SHORT);
				}
				this._refreshSettingsData();
			});
		}
		catch (error) {
			console.log(error);
			if(!this.state.toasted) {
				this.setState({toasted: 1});
				ToastAndroid.show("Failed to fetch settings data.", ToastAndroid.SHORT);
			}
			this._refreshPowerData();
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
						title="Wireless LTE" 
						reference="wireless" 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdate("BRIGHTWING", "LTE", "OFF", "wireless"), 
							() => this._requestUpdate("BRIGHTWING", "LTE", "AUTO", "wireless"), 
							() => this._requestUpdate("BRIGHTWING", "LTE", "ON", "wireless")]} 
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
				</View>
			</View>
		</ScrollView>
		);
  	}
}
