import React from 'react';
import { Text, View, Dimensions } from 'react-native';

import reloadStyles from '../styles/screen.js';

export default class TitleView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // Responsive styling
        var { height, width } = Dimensions.get('window');
        var styles = reloadStyles(height < width, global.isConnected);

        return (
            <View style={[styles.rowContainer]}>
                <View
                    style={[
                        styles.titleContainer,
                        styles.container,
                        styles.containerPadding
                    ]}>
                    <Text style={styles.mainTitleText}>{this.props.title}</Text>
                </View>
            </View>
        );
    }
}
