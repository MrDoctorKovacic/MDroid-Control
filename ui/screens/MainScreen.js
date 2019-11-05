import React from 'react';
import {
  Text,
  View,
  Dimensions,
} from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';
import ButtonGroup from '../components/ButtonGroup.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';

// Icons
import IconSun from '../images/icons/sun.js';
import IconLightning from '../images/icons/lightning';
import IconBattery from '../images/icons/battery';
import IconBulb from '../images/icons/bulb';
import IconCurrent from '../images/icons/current';
import IconOutput from '../images/icons/output';
import Colors from '../constants/Colors.js';
const iconHeight = 60;
const iconWidth = 120; 

export default class MainScreen extends React.Component {
	componentDidMount() {
		loc(this);
	}

	componentDidUpdate(prevProps){
		if(prevProps.session !== this.props.session && this.props.session != undefined){
			obj = {};
			Object.keys(this.state).map((item) => {
				if (item != "refreshing" && item != "fails") {
					obj[item] = item in this.props.session ? this.props.session[item] : "N/A";
				}
				if("AUX_VOLTAGE" in this.props.session && "AUX_CURRENT" in this.props.session) {
					obj["BATTERY_PERCENTAGE"] = ((parseFloat(this.props.session["AUX_VOLTAGE"]) - 11.5) * -1) / 1.3;
					obj["BATTERY_REMAINING"] = obj["BATTERY_PERCENTAGE"] * 34;
				}
			})
			this.setState(obj);
		}
	}

	componentWillUnMount() {
		rol();
	}

	constructor(props) {
		super(props);

		this.state = {
			fails: 0,
			MAIN_VOLTAGE: "N/A",
			AUX_VOLTAGE: "N/A",
			AUX_CURRENT: "N/A",
			OUTSIDE_TEMP: "N/A",
			INTERIOR_TEMPERATURE: "N/A",
			ANGEL_EYES_POWER: "N/A",
			AUX_VOLTAGE_OUTPUT: "N/A",
		};
	}

	cToF(degree) {
		return degree * 9 / 5 + 32;
	}

  	render() {
		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width, global.isConnected);

		return (
			<View>
				<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
					<Text style={styles.mainTitleText}>Quinn's M3</Text>
				</View>
				<View style={[styles.largeContainer, styles.colContainer, styles.containerPaddingLeft, styles.containerPaddingBottom]}>					
					<View style={[styles.container]}>
						<IconSun width={iconWidth} height={iconHeight} fill={Colors.buttonColorOn} />
						<View style={[styles.colContainer, styles.containerPaddingTopHalf, styles.containerPaddingLeftHalf], {paddingTop: 17}}>
							<Text style={[styles.secondaryTitleText]}>Interior Temp</Text>
							<Text style={[styles.normalText, styles.bold, styles.textLarge]}>{Math.round(this.cToF(parseInt(this.state.INTERIOR_TEMPERATURE)))} F</Text>
						</View>
					</View>
					<View style={[styles.container, ]}>
						<IconBulb width={iconWidth} height={iconHeight} fill={Colors.buttonColorOn} />
						<View style={[styles.colContainer, styles.containerPaddingTopHalf, styles.containerPaddingLeftHalf], {paddingTop: 17}}>
							<Text style={[styles.secondaryTitleText]}>Angel Eyes</Text>
							<Text style={[styles.normalText, styles.bold, styles.textLarge]}>{this.state.ANGEL_EYES_POWER}</Text>
						</View>
					</View>
					<View style={[styles.container, styles.containerPaddingBottom]}>
						<IconOutput width={iconWidth} height={iconHeight+5} fill={Colors.buttonColorOn} />
						<View style={[styles.colContainer, styles.containerPaddingTopHalf, styles.containerPaddingLeftHalf], {paddingTop: 17}}>
							<Text style={[styles.secondaryTitleText]}>Main Voltage</Text>
							<Text style={[styles.normalText, styles.bold, styles.textLarge]}>{this.state.MAIN_VOLTAGE} V</Text>
						</View>
					</View>
					<View style={[styles.container]}>
						<IconLightning width={iconWidth} height={iconHeight} fill={Colors.buttonColorOn} />
						<View style={[styles.colContainer, styles.containerPaddingTopHalf, styles.containerPaddingLeftHalf], {paddingTop: 17}}>
							<Text style={[styles.secondaryTitleText]}>Aux Voltage</Text>
							<Text style={[styles.normalText, styles.bold, styles.textLarge]}>{this.state.AUX_VOLTAGE} V</Text>
						</View>
					</View>
					<View style={[styles.container]}>
						<IconBattery width={iconWidth} height={iconHeight+15} fill={Colors.buttonColorOn} />
						<View style={[styles.colContainer, styles.containerPaddingTopHalf, styles.containerPaddingLeftHalf], {paddingTop: 17}}>
							<Text style={[styles.secondaryTitleText]}>Battery</Text>
							<Text style={[styles.normalText, styles.bold, styles.textLarge]}>({String(this.state.BATTERY_PERCENTAGE)}%) {String(this.state.BATTERY_REMAINING)} hours left</Text>
						</View>
					</View>
					<View style={[styles.container]}>
						<IconCurrent width={iconWidth} height={iconHeight} fill={Colors.buttonColorOn} />
						<View style={[styles.colContainer, styles.containerPaddingTopHalf, styles.containerPaddingLeftHalf], {paddingTop: 17}}>
							<Text style={[styles.secondaryTitleText]}>Aux Current</Text>
							<Text style={[styles.normalText, styles.bold, styles.textLarge]}>{Number.parseFloat(this.state.AUX_CURRENT).toFixed(3)} A</Text>
						</View>
					</View>
				</View>
			</View>
		);
  	}
}
