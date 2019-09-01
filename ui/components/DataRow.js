import React from 'react';
import {Text,View,Dimensions} from 'react-native';
import styles from '../../assets/screenStyles.js';

export default class DataRow extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {

		// Responsive styling
    	var {height, width} = Dimensions.get('window');
		var styles = reloadStyles(height < width);

		return (
			<View style={{ flex: 1, flexDirection: 'row' }}>
				<View style={{ flex: 1, }}><Text style={styles.auxText}>{this.props.title}</Text></View>
				<View style={{ flex: 1, alignItems: 'flex-end' }}><Text style={styles.auxText}>{this.props.value}</Text></View>
			</View>
		);
	}
}
