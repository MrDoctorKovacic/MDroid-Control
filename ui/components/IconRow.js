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

    this.state = {
      ACC_POWER: false,
      BOARD_ON: false,
      BOARDS_ENABLED: true,
      VIDEO_ON: false,
      VIDEO_ENABLED: false,
      TABLET_ENABLED: true,
      LTE_ON: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.settings !== this.props.settings &&
      this.props.settings !== undefined
    ) {
      this.setState({
        BOARDS_ENABLED:
          'BOARD' in this.props.settings && 'POWER' in this.props.settings.BOARD
            ? this.props.settings.BOARD.POWER === 'ON' ||
              this.props.settings.BOARD.POWER === 'AUTO'
            : false,
        TABLET_ENABLED:
          'TABLET' in this.props.settings &&
          'POWER' in this.props.settings.TABLET
            ? this.props.settings.TABLET.POWER === 'ON' ||
              this.props.settings.TABLET.POWER === 'AUTO'
            : false,
        LTE_ENABLED:
          'WIRELESS' in this.props.settings &&
          'LTE' in this.props.settings.WIRELESS
            ? this.props.settings.WIRELESS.LTE === 'ON' ||
              this.props.settings.WIRELESS.LTE === 'AUTO'
            : false,
        VIDEO_ENABLED:
          'BOARD' in this.props.settings &&
          'VIDEO_RECORDING' in this.props.settings.BOARD
            ? this.props.settings.BOARD.VIDEO_RECORDING === 'ON' ||
              this.props.settings.BOARD.VIDEO_RECORDING === 'AUTO'
            : false,
      });
    }

    if (
      prevProps.session !== this.props.session &&
      this.props.session !== undefined
    ) {
      this.setState({
        ACC_POWER:
          'ACC_POWER' in this.props.session
            ? this.props.session.ACC_POWER === 'TRUE'
            : false,
        BOARD_ON:
          'BOARD_POWER' in this.props.session
            ? this.props.session.BOARD_POWER === 'TRUE'
            : false,
        VIDEO_ON:
          'BOARD_POWER' in this.props.session
            ? this.props.session.BOARD_POWER === 'TRUE'
            : false,
        TABLET_ON:
          'TABLET_POWER' in this.props.session
            ? this.props.session.TABLET_POWER === 'TRUE'
            : false,
        LTE_ON:
          'LTE_ON' in this.props.session
            ? this.props.session.LTE_ON === 'TRUE'
            : false,
      });
      console.log(this.state);
      console.log(this.props.session);
    }
  }

  render() {
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
    if (!this.state.BOARDS_ENABLED) {
      boardColor = Colors.buttonColorDisabled;
    } else if (this.state.BOARD_ON) {
      boardColor = Colors.buttonColorOn;
    }

    if (!this.state.VIDEO_ENABLED) {
      videoColor = '#8b0000';
    } else if (this.state.VIDEO_ON) {
      videoColor = Colors.buttonColorOn;
    }

    if (!this.state.TABLET_ENABLED) {
      tabletColor = Colors.buttonColorDisabled;
    } else if (this.state.TABLET_ON) {
      tabletColor = Colors.buttonColorOn;
    }

    if (this.state.LTE_ON) {
      lteColor = Colors.buttonColorOn;
      console.log('LTE is on, color ' + lteColor);
    }

    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

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
                this.state.ACC_POWER && global.isConnected
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
        </View>

        <View style={[styles.mainContainer, styles.iconInnerRow]}>
          <View style={[styles.buttonsContainer]}>
            <IconRecord
              width={iconWidth}
              height={iconHeight}
              fill={videoColor}
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
