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

export default class PowerScreen extends React.Component {
	componentDidMount() {
		loc(this);
	}

	componentDidUpdate(prevProps){
		if(prevProps.settings !== this.props.settings){
			if (this.props.settings != undefined) {
				this.setState({
					wirelessPower: ("WIRELESS" in this.props.settings && "POWER" in this.props.settings["WIRELESS"]) ? this.props.settings["WIRELESS"]["POWER"] : "N/A",
					boardPower: ("BOARD" in this.props.settings && "POWER" in this.props.settings["BOARD"]) ? this.props.settings["BOARD"]["POWER"] : "N/A",
					tabletPower: ("TABLET" in this.props.settings && "POWER" in this.props.settings["TABLET"]) ? this.props.settings["TABLET"]["POWER"] : "N/A",
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
				tabletPower: "AUTO",
				boardPower: "AUTO",
				wirelessPower: "AUTO",
			};
		} else {
			this.state = {
				tabletPower: "N/A",
				boardPower: "N/A",
				wirelessPower: "N/A",
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
					<ButtonGroupTitle isConnected={this.props.isConnected} title="Video Boards"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("BOARD", "POWER", "OFF"), 
							() => this._requestUpdatePower("BOARD", "POWER", "AUTO"), 
							() => this._requestUpdatePower("BOARD", "POWER", "ON")]} 
						status={this.state.boardPower} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Tablet"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Off", "Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("TABLET", "POWER", "OFF"), 
							() => this._requestUpdatePower("TABLET", "POWER", "AUTO"), 
							() => this._requestUpdatePower("TABLET", "POWER", "ON")]} 
						status={this.state.tabletPower} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Wireless"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Auto", "On"]} 
						buttonFunctions={[
							() => this._requestUpdatePower("WIRELESS", "POWER", "AUTO"), 
							() => this._requestUpdatePower("WIRELESS", "POWER", "ON")]} 
						status={this.state.wirelessPower} />

					<ButtonGroupTitle isConnected={this.props.isConnected} title="Restart Boards"></ButtonGroupTitle>
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Restart MDroid"]} 
						buttonFunctions={[() => this._confirmRestart("local")]} />
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Restart Wireless"]} 
						buttonFunctions={[() => this._confirmRestart("wireless")]} />
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Restart Board"]} 
						buttonFunctions={[() => this._confirmRestart("board")]} />
					<ButtonGroup 
						isConnected={this.props.isConnected} 
						buttons={["Restart Video"]} 
						buttonFunctions={[() => this._confirmRestart("video")]} />

				</View>
			</View>
		);
  	}
}
