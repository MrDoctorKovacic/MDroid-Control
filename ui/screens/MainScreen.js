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
		};
	}

  	render() {
		// Responsive styling
		var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width, global.isConnected);

		return (
			<View>
				<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
					<Text style={styles.mainTitleText}>Settings</Text>
				</View>
				<View style={[styles.largeContainer, styles.colContainer]}>
					<ButtonGroupTitle title="Angel Eyes"></ButtonGroupTitle>
					<ButtonGroup 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdate("ANGEL_EYES", "POWER", "OFF"), 
							() => this._requestUpdate("ANGEL_EYES", "POWER", "AUTO"), 
							() => this._requestUpdate("ANGEL_EYES", "POWER", "ON")]} 
						status={this.state.angelEyes} />
				</View>
			</View>
		);
  	}
}
