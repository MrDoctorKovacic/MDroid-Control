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

import DataRow from '../components/DataRow.js';

export default class SystemScreen extends React.Component {

	componentDidUpdate(prevProps){
		if(prevProps.settings !== this.props.settings && this.props.settings != undefined){
			obj = {};
			Object.keys(this.state).map((item) => {
				if (item != "refreshing" && item != "fails") {
					obj[item] = item in this.props.settings ? this.props.settings[item]["value"] : "N/A";
				}
			})
			this.setState(obj);
		}
	}

	componentDidMount() {
		loc(this);
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
			ACC_POWER: "N/A",
			ANGEL_EYES_POWER: "N/A",
			BOARD_POWER: "N/A",
			TABLET_POWER: "N/A",
			WIRELESS_POWER: "N/A",
			WIFI_CONNECTED: "N/A",
			LTE_ON: "N/A",
			KEY_DETECTED: "N/A",
			KEY_STATE: "N/A",
			DOORS_OPEN: "N/A",
			OUTSIDE_TEMP: "N/A",
			INTERIOR_TEMPERATURE: "N/A",
			INTERIOR_HUMIDITY: "N/A",
		};
	}

	render() {
		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width, global.isConnected);

		return (
				<View>
					<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
						<Text style={styles.mainTitleText}>System</Text>
					</View>
					<View style={[styles.containerPadding]}>
					{
						Object.keys(this.state).map((item) => {
							if (typeof this.state[item] == "string" && item != "refreshing" && item != "fails" && item != "orientation") {
								return (
									<DataRow title={item} value={this.state[item]} />
								);
							}
						})
					}
					</View>
				</View>
		);
		}
}
