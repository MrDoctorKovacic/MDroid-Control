import React from 'react';
import {
  Text,
  View,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import styles from '../../assets/screenStyles.js';
import ButtonGroup from '../components/ButtonGroup.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';

import { UpdateSetting, SendCommand, SendToSocket } from '../../actions/MDroidActions.js'; 

export default class SettingsScreen extends React.Component {
	componentDidMount() {
		loc(this);
	}

	componentDidUpdate(prevProps){
		if(prevProps.settings !== this.props.settings && this.props.settings != undefined){
			console.log("updating props");
			this.setState({
				wireless: ("BRIGHTWING" in this.props.settings && "LTE" in this.props.settings["BRIGHTWING"]) ? this.props.settings["BRIGHTWING"]["LTE"] : "N/A",
				angelEyes: ("VARIAN" in this.props.settings && "ANGEL_EYES" in this.props.settings["VARIAN"]) ? this.props.settings["VARIAN"]["ANGEL_EYES"] : "N/A",
				videoRecording: ("LUCIO" in this.props.settings && "VIDEO_RECORDING" in this.props.settings["LUCIO"]) ? this.props.settings["LUCIO"]["VIDEO_RECORDING"] : "N/A",
				exhaustNoise: ("JAINA" in this.props.settings && "EXHAUST_NOISE" in this.props.settings["JAINA"]) ? this.props.settings["JAINA"]["EXHAUST_NOISE"] : "N/A",
				variableSpeedVolume: ("JAINA" in this.props.settings && "VSV" in this.props.settings["JAINA"]) ? this.props.settings["JAINA"]["VSV"] : "N/A",
			});
		}
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
			};
		} else {
			this.state = {
				angelEyes: "N/A",
				sentryMode: "N/A",
				exhaustNoise: "N/A",
				variableSpeedVolume: "N/A",
				wireless: "N/A",
				toasted: 0,
				fails: 0
			};

		}
	}

	// Handler for update
	_requestUpdate = async (component, setting, value) => {
		this.props.postRequest("/settings/"+component+"/"+setting+"/"+value, "");
	}

  	render() {
		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width, this.props.isConnected);

		return (
			<View>
				<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
					<Text style={styles.mainTitleText}>Settings</Text>
				</View>
				<View style={[styles.largeContainer, styles.colContainer]}>
					<ButtonGroupTitle isConnected={this.props.isConnected} title="Video Recording"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "On"]} 
						buttonFunctions={[
							() => this._requestUpdate("LUCIO", "VIDEO_RECORDING", "OFF"), 
							() => this._requestUpdate("LUCIO", "VIDEO_RECORDING", "ON")]} 
						status={this.state.videoRecording} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Wireless LTE"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "On"]} 
						buttonFunctions={[
							() => this._requestUpdate("BRIGHTWING", "LTE", "OFF"),
							() => this._requestUpdate("BRIGHTWING", "LTE", "ON")]} 
						status={this.state.wireless} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Pipe In Exhaust"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdate("JAINA", "EXHAUST_NOISE", "OFF"), 
							() => this._requestUpdate("JAINA", "EXHAUST_NOISE", "AUTO"), 
							() => this._requestUpdate("JAINA", "EXHAUST_NOISE", "ON")]} 
						status={this.state.exhaustNoise} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Angel Eyes"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdate("VARIAN", "ANGEL_EYES", "OFF"), 
							() => this._requestUpdate("VARIAN", "ANGEL_EYES", "AUTO"), 
							() => this._requestUpdate("VARIAN", "ANGEL_EYES", "ON")]} 
						status={this.state.angelEyes} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Variable Speed Volume"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "On"]} 
						buttonFunctions={[
							() => this._requestUpdate("JAINA", "VSV", "OFF"), 
							() => this._requestUpdate("JAINA", "VSV", "ON")]} 
						status={this.state.variableSpeedVolume} />
				</View>
			</View>
		);
  	}
}
