import React from 'react';
import {
	StyleSheet,
	Text,
	View,
  Button,
  Dimensions
  } from 'react-native';

import styles from '../../assets/screenStyles.js';
import Colors from '../constants/Colors.js';

export default class ButtonGroup extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
      // Responsive styling
      var {height, width} = Dimensions.get('window');
      var styles = reloadStyles(height < width, this.props.isConnected);

			return (
        <View style={[styles.container, styles.rowContainer]}>
          <View style={[styles.container, styles.containerPadding, styles.colContainer]}>
            <Text style={styles.secondaryTitleText}>{this.props.title}</Text>
          </View>
        </View>
			);
	}
}
