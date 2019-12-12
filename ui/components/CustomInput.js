import React from 'react';
import {StyleSheet, View, Button, Dimensions, TextInput} from 'react-native';

import reloadStyles from '../styles/screen.js';
import Colors from '../constants/Colors.js';

export default class CustomInput extends React.Component {
  //const [value] = React.useState('/');

  constructor(props) {
    super(props);
  }

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

    return (
      <View style={[styles.container, styles.rowContainer]}>
        <View
          style={[
            styles.container,
            styles.containerPadding,
            styles.colContainer,
          ]}>
          <View style={styles.buttonsWrapper}>
            <TextInput
              style={{
                height: 40,
                width: '100%',
                borderColor: 'gray',
                borderWidth: 1,
                color: '#FFFFFF',
              }}
              onSubmitEditing={event =>
                this.props.request(event.nativeEvent.text)
              }
            />
          </View>
        </View>
      </View>
    );
  }
}
