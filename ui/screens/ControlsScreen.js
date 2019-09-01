import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import styles from '../../assets/screenStyles.js';
import ButtonGroup from '../components/ButtonGroup.js';

import { SendCommand } from '../../actions/MDroidActions.js'

export default class ControlsScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

	constructor(props) {
		super(props);

		this.state = {
			toasted: 0
		};
	}

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, this.props.isConnected);

		return (
      <ScrollView removeClippedSubviews={true}>
        <View>
          <View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
            <Text style={styles.mainTitleText}>Controls</Text>
          </View>
          <View style={[styles.largeContainer, styles.colContainer]}>
            <ButtonGroup isConnected={this.props.isConnected} title="Doors" reference="doors" buttons={["Lock", "Unlock"]} buttonFunctions={[() => SendCommand("doors/lock"), () => SendCommand("doors/unlock")]} />

            <ButtonGroup isConnected={this.props.isConnected} title="Windows" reference="windows" buttons={["Open", "Close"]} buttonFunctions={[() => SendCommand("windows/down"), () => SendCommand("windows/up")]} />

            <ButtonGroup isConnected={this.props.isConnected} title="Trunk" reference="trunk" buttons={["Open"]} buttonFunctions={[() => SendCommand("trunk/open")]} />

            <ButtonGroup isConnected={this.props.isConnected} title="Climate" reference="climate" buttons={["Air Out"]} buttonFunctions={[() => SendCommand("windows/popdown")]} />

            <ButtonGroup isConnected={this.props.isConnected} title="Hazards" reference="hazards" buttons={["On", "Off"]} buttonFunctions={[() => SendCommand("hazards/on"), () => SendCommand("hazards/off")]} />

            <ButtonGroup isConnected={this.props.isConnected} title="Flashers" reference="flashers" buttons={["On", "Off"]} buttonFunctions={[() => SendCommand("flashers/on"), () => SendCommand("flashers/off")]} />

          </View>
        </View>
      </ScrollView>
		);
  	}
}
