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
				artanisPower: "AUTO",
				brightwingPower: "AUTO",
			};
		} else {
			this.state = {
				raynorPower: "N/A",
				artanisPower: "N/A",
				brightwingPower: "N/A",
				toasted: 0,
				refreshing: false
			};
		}
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
			componentHandler = this;
			return fetch("http://"+global.SERVER_HOST+"/settings")
			.then(function(response) {
				return response.json();
			})
			.then(function(sessionObject) {
				console.log(sessionObject);
				componentHandler.setState({
					brightwingPower: ("BRIGHTWING" in sessionObject && "POWER" in sessionObject["BRIGHTWING"]) ? sessionObject["BRIGHTWING"]["POWER"] : "N/A",
					artanisPower: ("ARTANIS" in sessionObject && "POWER" in sessionObject["ARTANIS"]) ? sessionObject["ARTANIS"]["POWER"] : "N/A",
					raynorPower: ("RAYNOR" in sessionObject && "POWER" in sessionObject["RAYNOR"]) ? sessionObject["RAYNOR"]["POWER"] : "N/A",
				});
			}).catch((error) => {
				console.log(error);
				if(!this.state.toasted) {
					this.setState({toasted: 1});
					ToastAndroid.show("Failed to fetch settings data.", ToastAndroid.SHORT);
				}
				componentHandler._refreshPowerData();
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
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						title="Artanis" 
						reference="artanisPower" 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("ARTANIS", "POWER", "OFF", "artanisPower"), 
							() => this._requestUpdatePower("ARTANIS", "POWER", "AUTO", "artanisPower"), 
							() => this._requestUpdatePower("ARTANIS", "POWER", "ON", "artanisPower")]} 
						status={this.state.artanisPower} />

					<ButtonGroup 
						isConnected={this.props.isConnected} 
						title="Brightwing" 
						reference="brightwingPower" 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "OFF", "brightwingPower"), 
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "AUTO", "brightwingPower"), 
							() => this._requestUpdatePower("BRIGHTWING", "POWER", "ON", "brightwingPower")]} 
						status={this.state.brightwingPower} />

					<ButtonGroup 
						isConnected={this.props.isConnected} 
						title="Raynor" 
						reference="raynorPower" 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("RAYNOR", "POWER", "OFF", "raynorPower"), 
							() => this._requestUpdatePower("RAYNOR", "POWER", "AUTO", "raynorPower"), 
							() => this._requestUpdatePower("RAYNOR", "POWER", "ON", "raynorPower")]} 
						status={this.state.raynorPower} />
				</View>
			</View>
		</ScrollView>
		);
  	}
}
