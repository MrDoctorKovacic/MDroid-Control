import React from 'react';
import {View,Dimensions} from 'react-native';
import reloadStyles from '../styles/screen.js';
import Colors from '../constants/Colors.js';

import IconETC from '../images/icons/etc.js';
import IconLucio from '../images/icons/lucio.js';
import IconLTE from '../images/icons/lte.js';
import IconWireless from '../images/icons/wireless.js';
import IconTablet from '../images/icons/tablet.js';
import IconRecord from '../images/icons/record.js';
import IconPower from '../images/icons/power.js';

const iconHeight = 30;
const iconWidth = 55; 

export default class DataRow extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			ACC_POWER: false,
			BOARDS_ENABLED: true,
			BOARD_ON: false,
			VIDEO_ON: false,
			videoRecording: false,
			TABLET_ENABLED: true,
			WIRELESS_ON: false,
			WIRELESS_ENABLED: true,
			LTE_ON: false,
		};
	}

	componentDidUpdate(prevProps){
		if(prevProps.settings !== this.props.settings && this.props.settings != undefined){
			this.setState({
				BOARDS_ENABLED: ("BOARD" in this.props.settings && "POWER" in this.props.settings["BOARD"]) ? this.props.settings["BOARD"]["POWER"] == "ON" || this.props.settings["BOARD"]["POWER"] == "AUTO" : false,
				TABLET_ENABLED: ("TABLET" in this.props.settings && "POWER" in this.props.settings["TABLET"]) ? this.props.settings["TABLET"]["POWER"] == "ON" || this.props.settings["TABLET"]["POWER"] == "AUTO" : false,
				WIRELESS_ENABLED: ("WIRELESS" in this.props.settings && "LTE" in this.props.settings["WIRELESS"]) ? this.props.settings["WIRELESS"]["LTE"] == "ON" || this.props.settings["WIRELESS"]["LTE"] == "AUTO" : false,
				videoRecording: ("BOARD" in this.props.settings && "VIDEO_RECORDING" in this.props.settings["BOARD"]) ? this.props.settings["BOARD"]["POWER"] == "ON" || this.props.settings["BOARD"]["POWER"] == "AUTO" : false,
			});
		}

		if(prevProps.session !== this.props.session && this.props.session != undefined){
			this.setState({
				ACC_POWER: ("ACC_POWER" in this.props.session) ? this.props.session["ACC_POWER"]["value"] == "TRUE" : false,
				BOARD_ON: ("BOARD_POWER" in this.props.session) ? this.props.session["BOARD_POWER"]["value"] == "TRUE" : false,
				VIDEO_ON: ("BOARD_POWER" in this.props.session) ? this.props.session["BOARD_POWER"]["value"] == "TRUE" : false,
				RAYNOR_ON: ("TABLET_POWER" in this.props.session) ? this.props.session["TABLET_POWER"]["value"] == "TRUE" : false,
				LTE_ON: ("LTE_ON" in this.props.session) ? this.props.session["LTE_ON"]["value"] == "TRUE" : false,
				WIRELESS_ON: ("WIRELESS_POWER" in this.props.session) ? this.props.session["WIRELESS_POWER"]["value"] == "TRUE" : false,
			});
		}
	}
	
	
	render() {

		// Responsive styling
    	var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width, global.isConnected);

		var defaultColor = global.isConnected ? Colors.buttonColorDisabled : "#8b0000";

		var etcColor = defaultColor;
		var lucioColor = defaultColor;
		var raynorColor = defaultColor;
		var videoColor = defaultColor;
		var wirelessColor = defaultColor;
		var lteColor = defaultColor;

		if(!this.state.BOARDS_ENABLED) {
			etcColor = Colors.buttonColorDisabled;
			lucioColor = Colors.buttonColorDisabled;
		} else {
			if(this.state.BOARD_ON) {
				lucioColor = Colors.buttonColorOn;
				videoColor = Colors.buttonColorOn;
			}
			if(this.state.VIDEO_ON) {
				etcColor = Colors.buttonColorOn;
			}
		}

		if(!this.state.videoRecording) {
			videoColor = Colors.buttonColorDisabled;
		}

		if(!this.state.TABLET_ENABLED) {
			raynorColor = Colors.buttonColorDisabled;
		} else {
			if(this.state.RAYNOR_ON) {
				raynorColor = Colors.buttonColorOn;
			}
		}

		if(!this.state.WIRELESS_ENABLED) {
			wirelessColor = Colors.buttonColorDisabled;
			lteColor = Colors.buttonColorDisabled;
		} else {
			if(this.state.WIRELESS_ON) {
				wirelessColor = Colors.buttonColorOn;
			}
			if(this.state.LTE_ON) {
				lteColor = Colors.buttonColorOn;
			}
		}

		return (
            <View style={[styles.container, styles.containerPaddingBottom]}>
				<View style={[styles.buttonsContainer]}>
					<IconPower width={iconWidth} height={iconHeight} fill={this.state.ACC_POWER && global.isConnected ? Colors.buttonColorOn : defaultColor} />
				</View>
				<View style={[styles.buttonsContainer]}>
					<IconETC width={iconWidth} height={iconHeight} fill={etcColor} />
				</View>
				<View style={[styles.buttonsContainer]}>
					<IconLucio width={iconWidth} height={iconHeight} fill={lucioColor} />
				</View>
				<View style={[styles.buttonsContainer]}>
					<IconTablet width={iconWidth} height={iconHeight} fill={raynorColor} />
				</View>
				<View style={[styles.buttonsContainer]}>
					<IconRecord width={iconWidth} height={iconHeight} fill={videoColor} />
				</View>
				<View style={[styles.buttonsContainer]}>
					<IconWireless width={iconWidth} height={iconHeight} fill={wirelessColor} />
				</View>
				<View style={[styles.buttonsContainer]}>
					<IconLTE width={iconWidth} height={iconHeight} fill={lteColor} />
				</View>
            </View>
		);
	}
}