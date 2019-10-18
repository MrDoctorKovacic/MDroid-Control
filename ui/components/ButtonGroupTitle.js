import React from 'react';
import {
	Text,
	View,
  Dimensions
  } from 'react-native';

import reloadStyles from '../styles/screen.js';

export default class ButtonGroup extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
      // Responsive styling
      var {height, width} = Dimensions.get('window');
      var styles = reloadStyles(height < width, global.isConnected);

			return (
        <View style={[styles.container, styles.rowContainer]}>
          <View style={[styles.container, styles.containerPadding, styles.colContainer]}>
            <Text style={styles.secondaryTitleText}>{this.props.title}</Text>
          </View>
        </View>
			);
	}
}
