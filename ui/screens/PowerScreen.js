import React from 'react';
import {
  Text,
  View,
  ToastAndroid,
  Dimensions,
  ScrollView,
  RefreshControl,
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

import { UpdateSetting, SendCommand, SendRestart } from '../../actions/MDroidActions.js'; 

export default class PowerScreen extends React.Component {
	componentDidMount() {
		loc(this);
		this._refreshPowerData();
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
		this._refreshPowerData = this._refreshPowerData.bind(this);
	}

	_onRefreshPower = () => {
		this.setState({refreshing: true});
		this._refreshPowerData(this).then(() => {
			this.setState({refreshing: false});
		});
	}

	// Sends a GET request to fetch power data
	_refreshPowerData() {
		try {
			return fetch("http://"+global.SERVER_HOST+"/settings")
			.then((response) => response.json())
			.then((sessionObject) => {
				if(sessionObject["ok"]) {
					jsonData = sessionObject["output"];
					this.setState({
						brightwingPower: ("BRIGHTWING" in jsonData && "POWER" in jsonData["BRIGHTWING"]) ? jsonData["BRIGHTWING"]["POWER"] : "N/A",
						lucioPower: ("LUCIO" in jsonData && "POWER" in jsonData["LUCIO"]) ? jsonData["LUCIO"]["POWER"] : "N/A",
						raynorPower: ("RAYNOR" in jsonData && "POWER" in jsonData["RAYNOR"]) ? jsonData["RAYNOR"]["POWER"] : "N/A",
					}, function(){
			
					});
				}
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					fails: this.state.fails + 1
				});
				if(this.state.fails > 4 && !this.state.toasted) {
					this.setState({toasted: 1});
					ToastAndroid.show("Failed to fetch power data.", ToastAndroid.SHORT);
				}
				this._refreshPowerData();
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
	_requestUpdatePower = async (component, setting, value, reference) => {
		const httpStatus = await UpdateSetting(component, setting, value);
		if(httpStatus == "200") {
			ToastAndroid.show("Updated.", ToastAndroid.SHORT);
			this.setState({ [reference]:value });
		} else {
			ToastAndroid.show(httpStatus, ToastAndroid.SHORT);
		}
	}

	_confirmRestart(target) {
		Alert.alert(
			'Confirm Restart',
			'Are you sure you want to restart '+target+'?',
			[
			  {
				text: 'Cancel',
				onPress: () => console.log('Cancel Pressed'),
				style: 'cancel',
			  },
			  {text: 'OK', onPress: () => SendRestart(target)},
			],
			{cancelable: true},
		);
	}

  	render() {
		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width, this.props.isConnected);

		return (
		<ScrollView 
					refreshControl={<RefreshControl 
					refreshing={this.state.refreshing} 
					onRefresh={this._onRefreshPower} />} 
					removeClippedSubviews={true} 
				>
			<View>
				<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
					<Text style={styles.mainTitleText}>Power</Text>
				</View>
				<View style={[styles.largeContainer, styles.colContainer]}>
					<ButtonGroupTitle title="Lucio / ETC"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						reference="lucioPower" 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("LUCIO", "POWER", "OFF", "lucioPower"), 
							() => this._requestUpdatePower("LUCIO", "POWER", "AUTO", "lucioPower"), 
							() => this._requestUpdatePower("LUCIO", "POWER", "ON", "lucioPower")]} 
						status={this.state.lucioPower} />
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						reference="restartBoard" 
						buttons={["Restart Lucio"]} 
						buttonFunctions={[() => this._confirmRestart("lucio")]} />
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						reference="restartBoard" 
						buttons={["Restart ETC"]} 
						buttonFunctions={[() => this._confirmRestart("etc")]} />

					<ButtonGroupTitle title="Brightwing"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						reference="brightwingPower" 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "OFF", "brightwingPower"), 
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "AUTO", "brightwingPower"), 
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "ON", "brightwingPower")]} 
						status={this.state.brightwingPower} />
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						reference="restartBoard" 
						buttons={["Restart Brightwing"]} 
						buttonFunctions={[() => this._confirmRestart("brightwing")]} />

					<ButtonGroupTitle title="Raynor"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						reference="raynorPower" 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("RAYNOR", "POWER", "OFF", "raynorPower"), 
							() => this._requestUpdatePower("RAYNOR", "POWER", "AUTO", "raynorPower"), 
							() => this._requestUpdatePower("RAYNOR", "POWER", "ON", "raynorPower")]} 
						status={this.state.raynorPower} />

					<ButtonGroupTitle title="Restart Board"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						reference="restartBoard" 
						buttons={["Restart Board"]} 
						buttonFunctions={[() => this._confirmRestart("local")]} />
				</View>
			</View>
		</ScrollView>
		);
  	}
}
