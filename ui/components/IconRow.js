import React from 'react';
import {View, Dimensions} from 'react-native';
import reloadStyles from '../styles/screen.js';
import Colors from '../constants/Colors.js';

import IconLucio from '../images/icons/lucio.js';
import IconLTE from '../images/icons/lte.js';
import IconTablet from '../images/icons/tablet.js';
import IconRecord from '../images/icons/record.js';
import IconPower from '../images/icons/power.js';

const iconHeight = 30;
const iconWidth = 65;

export default class DataRow extends React.Component {
  constructor(props) {
    super(props);

    this.screen = {
      acc_power: false,
      board_on: false,
      boards_enabled: true,
      video_on: false,
      video_enabled: false,
      tablet_enabled: true,
      lte_on: false,
    };
  }

  updateScreen() {
    this.screen = {
      boards_enabled:
        'board.power' in this.props.settings
          ? this.props.settings['board.power'] === 'ON' ||
            this.props.settings['board.power'] === 'AUTO'
          : false,
      tablet_enabled:
        'tablet.power' in this.props.settings
          ? this.props.settings['tablet.power'] === 'ON' ||
            this.props.settings['tablet.power'] === 'AUTO'
          : false,
      LTE_ENABLED:
        'wireless.lte' in this.props.settings
          ? this.props.settings['wireless.lte'] === 'ON' ||
            this.props.settings['wireless.lte'] === 'AUTO'
          : false,
      video_enabled:
        'board.video_recording' in this.props.settings
          ? this.props.settings['board.video_recording'] === 'ON' ||
            this.props.settings['board.video_recording'] === 'AUTO'
          : false,
      acc_power:
        'ACC_POWER' in this.props.session
          ? this.props.session["ACC_POWER"] === "true"
          : false,
      board_on:
        'BOARD' in this.props.session
          ? this.props.session["BOARD"] === "true"
          : false,
      video_on:
        'board_power' in this.props.session
          ? this.props.session.board_power === "true"
          : false,
      tablet_on:
        'USB_HUB' in this.props.session
          ? this.props.session["USB_HUB"] === "true"
          : false,
      lte_on:
        global.isConnectedToDevice &&
        ('lte_on' in this.props.session)
          ? this.props.session.lte_on === "true" ||
            this.props.session.wifi_connected === "true"
          : false,
    };
  }

  render() {
    this.updateScreen();

    var defaultColor = global.isConnected
      ? Colors.buttonColorDisabled
      : '#8b0000';
    var boardColor = defaultColor;
    var tabletColor = defaultColor;
    var videoColor = defaultColor;
    var lteColor = defaultColor;

    //
    // Determine color of icons
    //
    defaultColor = global.isConnected ? Colors.buttonColorDisabled : '#8b0000';
    if (!this.screen.boards_enabled) {
      boardColor = Colors.buttonColorDisabled;
    } else if (this.screen.board_on) {
      boardColor = Colors.buttonColorOn;
    }

    if (!this.screen.video_enabled) {
      videoColor = '#8b0000';
    } else if (this.screen.video_on) {
      videoColor = Colors.buttonColorOn;
    }

    if (!this.screen.tablet_enabled) {
      tabletColor = Colors.buttonColorDisabled;
    } else if (this.screen.tablet_on) {
      tabletColor = Colors.buttonColorOn;
    }

    if (this.screen.lte_on) {
      lteColor = Colors.buttonColorOn;
      console.log('LTE is on, color ' + lteColor);
    }

    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

    if (height > width) {
      return (
        <View
          style={[
            styles.container,
            styles.containerPadding,
            styles.containerPaddingBottom,
            styles.iconRowStyles,
            styles.breakHalfContainer,
          ]}>
          <View style={[styles.mainContainer, styles.iconInnerRow]}>
            <View style={[styles.buttonsContainer]}>
              <IconPower
                width={iconWidth}
                height={iconHeight}
                fill={
                  this.screen.acc_power && global.isConnected
                    ? Colors.buttonColorOn
                    : defaultColor
                }
              />
            </View>
            <View style={[styles.buttonsContainer]}>
              <IconLucio
                width={iconWidth}
                height={iconHeight}
                fill={boardColor}
              />
            </View>
            <View style={[styles.buttonsContainer]}>
              <IconTablet
                width={iconWidth}
                height={iconHeight}
                fill={tabletColor}
              />
            </View>
            <View style={[styles.buttonsContainer]}>
              <IconLTE width={iconWidth} height={iconHeight} fill={lteColor} />
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={[
            styles.container,
            styles.containerPaddingBottom,
            styles.iconRowStyles,
            styles.breakHalfContainer,
          ]}>
          <View style={[styles.mainContainer, styles.iconInnerRow]}>
            <View style={[styles.buttonsContainer]}>
              <IconPower
                width={iconWidth}
                height={iconHeight}
                fill={
                  this.screen.acc_power && global.isConnected
                    ? Colors.buttonColorOn
                    : defaultColor
                }
              />
            </View>
            <View style={[styles.buttonsContainer]}>
              <IconLucio
                width={iconWidth}
                height={iconHeight}
                fill={boardColor}
              />
            </View>
            <View style={[styles.buttonsContainer]}>
              <IconTablet
                width={iconWidth}
                height={iconHeight}
                fill={tabletColor}
              />
            </View>
            <View style={[styles.buttonsContainer]}>
              <IconLTE width={iconWidth} height={iconHeight} fill={lteColor} />
            </View>
          </View>
        </View>
      );
    }
  }
}
