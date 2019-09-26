import React from 'react';
import {
  Text,
  View,
  Dimensions,
  Alert
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

import { UpdateSetting, SendCommand, SendRestart } from '../../actions/MDroidActions.js'; 

export default class PowerScreen extends React.Component {
	componentDidMount() {
		loc(this);
	}

	componentDidUpdate(prevProps){
		if(prevProps.settings !== this.props.settings){
			if (this.props.settings != undefined) {
				this.setState({
					brightwingPower: ("BRIGHTWING" in this.props.settings && "POWER" in this.props.settings["BRIGHTWING"]) ? this.props.settings["BRIGHTWING"]["POWER"] : "N/A",
					lucioPower: ("LUCIO" in this.props.settings && "POWER" in this.props.settings["LUCIO"]) ? this.props.settings["LUCIO"]["POWER"] : "N/A",
					raynorPower: ("RAYNOR" in this.props.settings && "POWER" in this.props.settings["RAYNOR"]) ? this.props.settings["RAYNOR"]["POWER"] : "N/A",
				});
			}
		}
	}

	componentWillUnMount() {
		rol();
	}

	constructor(props) {
		super(props);

		if (global.demoMode) {
			this.state = {
				raynorPower: "AUTO",
				lucioPower: "AUTO",
				brightwingPower: "AUTO",
			};
		} else {
			this.state = {
				raynorPower: "N/A",
				lucioPower: "N/A",
				brightwingPower: "N/A",
				toasted: 0,
				refreshing: false,
				fails: 0
			};
		}
	}

	// Handler for update
	_requestUpdatePower = async (component, setting, value) => {
		this.props.postRequest("/settings/"+component+"/"+setting+"/"+value, "");
	}

	_confirmRestart(target) {
		address = target == "local" ? "/restart" : "/"+target+"/restart";
		Alert.alert(
			'Confirm Restart',
			'Are you sure you want to restart '+target+'?',
			[
			  {
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			  },
			  {text: 'OK', onPress: () => this.props.getRequest(address) },
			],
			{cancelable: true},
		);
	}

  	render() {
		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width, this.props.isConnected);

		return (
			<View>
				<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
					<Text style={styles.mainTitleText}>Power</Text>
				</View>
				<View style={[styles.largeContainer, styles.colContainer]}>
					<ButtonGroupTitle isConnected={this.props.isConnected} title="Lucio / ETC"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("LUCIO", "POWER", "OFF"), 
							() => this._requestUpdatePower("LUCIO", "POWER", "AUTO"), 
							() => this._requestUpdatePower("LUCIO", "POWER", "ON")]} 
						status={this.state.lucioPower} />
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Restart Lucio", "Restart ETC"]} 
						buttonFunctions={[() => this._confirmRestart("lucio"), () => this._confirmRestart("etc")]} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Brightwing"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "OFF"), 
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "AUTO"), 
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "ON")]} 
						status={this.state.brightwingPower} />
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Restart Brightwing"]} 
						buttonFunctions={[() => this._confirmRestart("brightwing")]} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Raynor"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("RAYNOR", "POWER", "OFF"), 
							() => this._requestUpdatePower("RAYNOR", "POWER", "AUTO"), 
							() => this._requestUpdatePower("RAYNOR", "POWER", "ON")]} 
						status={this.state.raynorPower} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Restart Board"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Restart Board"]} 
						buttonFunctions={[() => this._confirmRestart("local")]} />
				</View>
			</View>
		);
  	}
}
