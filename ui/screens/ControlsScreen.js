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
import reloadStyles from '../styles/screen.js';
import ButtonGroup from '../components/ButtonGroup.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';

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
            <ButtonGroupTitle isConnected={this.props.isConnected} title="Doors"></ButtonGroupTitle>
            <ButtonGroup isConnected={this.props.isConnected} reference="doors" buttons={["Lock", "Unlock"]} buttonFunctions={[() => this.props.getRequest("/doors/lock"), () => this.props.getRequest("/doors/unlock")]} />

            <ButtonGroupTitle isConnected={this.props.isConnected} title="Windows"></ButtonGroupTitle>
            <ButtonGroup isConnected={this.props.isConnected} reference="windows" buttons={["Open", "Close"]} buttonFunctions={[() => this.props.getRequest("/windows/down"), () => this.props.getRequest("/windows/up")]} />

            <ButtonGroupTitle isConnected={this.props.isConnected} title="Trunk"></ButtonGroupTitle>
            <ButtonGroup isConnected={this.props.isConnected} reference="trunk" buttons={["Open"]} buttonFunctions={[() => this.props.getRequest("/trunk/open")]} />

            <ButtonGroupTitle isConnected={this.props.isConnected} title="Hazards"></ButtonGroupTitle>
            <ButtonGroup isConnected={this.props.isConnected} reference="hazards" buttons={["On", "Off"]} buttonFunctions={[() => this.props.getRequest("/hazards/on"), () => this.props.getRequest("/hazards/off")]} />

            <ButtonGroupTitle isConnected={this.props.isConnected} title="Flashers"></ButtonGroupTitle>
            <ButtonGroup isConnected={this.props.isConnected} reference="flashers" buttons={["On", "Off"]} buttonFunctions={[() => this.props.getRequest("/flashers/on"), () => this.props.getRequest("/flashers/off")]} />

          </View>
        </View>
      </ScrollView>
		);
  	}
}
