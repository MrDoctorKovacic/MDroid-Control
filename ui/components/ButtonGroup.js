import React from 'react';
import {
	StyleSheet,
	View,
  Button,
  Dimensions
  } from 'react-native';

import reloadStyles from '../styles/screen.js';
import Colors from '../constants/Colors.js';

export default class ButtonGroup extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
      // Responsive styling
      var {height, width} = Dimensions.get('window');
      var styles = reloadStyles(height < width, this.props.isConnected);

      buttonCount = this.props.buttons.length;

      // Change button color
      buttonOnColor = this.props.isConnected ? Colors.buttonColorOn : Colors.buttonColorOn;

      // Setup buttons
      buttonOneTitle = this.props.buttons[0];
      buttonOneFunction = this.props.buttonFunctions[0];
      buttonTwoTitle = buttonCount > 1 ? this.props.buttons[1] : "N/A";
      buttonTwoFunction = buttonCount > 1 ? this.props.buttonFunctions[1] : "N/A";
      buttonThreeTitle = buttonCount > 2 ? this.props.buttons[2] : "N/A";
      buttonThreeFunction = buttonCount > 2 ? this.props.buttonFunctions[2] : "N/A";

      customStyles = StyleSheet.create({
        buttonOne: {
          display: 'flex',
          flex: 1,
          marginLeft: !this.props.status ? 15 : 0,
          marginRight: !this.props.status ? 15 : 0
        },
        buttonTwo: {
        	display: buttonCount < 2 ? "none" : "flex",
          flex: 1,
          marginLeft: !this.props.status ? 15 : 0,
          marginRight: !this.props.status ? 15 : 0
        },
        buttonThree: {
        	display: buttonCount < 3 ? "none" : "flex",
          flex: 1,
          marginLeft: !this.props.status ? 15 : 0,
          marginRight: !this.props.status ? 15 : 0
        }
      });

			return (
        <View style={[styles.container, styles.rowContainer]}>
          <View style={[styles.container, styles.containerPadding, styles.colContainer]}>
            <View style={styles.buttonsWrapper}>
              <View style={[styles.buttonsContainer, customStyles.buttonOne]}>
                <Button
                    style={[styles.button]}
                    onPress={buttonOneFunction}
                    title={buttonOneTitle}
                    disabled={this.props.isConnected ? false : true}
                    color={!this.props.status || this.props.status == buttonOneTitle.toUpperCase() ? buttonOnColor : Colors.buttonColorOff}
                  />
              </View>
              <View style={[styles.buttonsContainer, customStyles.buttonTwo]}>
                <Button
                    style={[styles.button]}
                    onPress={buttonTwoFunction}
                    title={buttonTwoTitle}
                    disabled={this.props.isConnected ? false : true}
                    color={!this.props.status || this.props.status == buttonTwoTitle.toUpperCase() ? buttonOnColor : Colors.buttonColorOff}
                  />
              </View>
              <View style={[styles.buttonsContainer, customStyles.buttonThree]}>
                <Button
                    style={[styles.button]}
                    onPress={buttonThreeFunction}
                    title={buttonThreeTitle}
                    disabled={this.props.isConnected ? false : true}
                    color={!this.props.status || this.props.status == buttonThreeTitle.toUpperCase() ? buttonOnColor : Colors.buttonColorOff}
                  />
              </View>
            </View>
          </View>
        </View>
			);
	}
}
