import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';

// Icons
import IconSun from '../images/icons/sun.js';
import IconLightning from '../images/icons/lightning';
import IconBattery from '../images/icons/battery';
import IconBulb from '../images/icons/bulb';
import IconOutput from '../images/icons/output';
import Colors from '../constants/Colors.js';
const iconHeight = 60;
const iconWidth = 120;

// Battery info
const ampHourCapacity = 34;
const lowestUsableVoltage = 11.2;

export default class MainScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);

    this.state = {
      fails: 0,
      refreshing: false,
    };
    this.screen = {
      MAIN_VOLTAGE: 'N/A',
      AUX_VOLTAGE: 'N/A',
      AUX_CURRENT: 'N/A',
      OUTSIDE_TEMP: 'N/A',
      INTERIOR_TEMPERATURE: 'N/A',
      ANGEL_EYES: 'N/A',
      AUX_VOLTAGE_OUTPUT: 'N/A',
      BATTERY_PERCENT: 'N/A',
    };
  }

  cToF(degree) {
    return (degree * 9) / 5 + 32;
  }

  updateScreen() {
    var obj = {};
    Object.keys(this.screen).map(item => {
      let value = item in this.props.session ? this.props.session[item] : 'N/A';
      if (!isNaN(parseFloat(value))) {
        value = parseFloat(value).toFixed(2);
      }
      obj[item] = value;
    });

    if ('AUX_VOLTAGE' in this.props.session) {
      obj.BATTERY_HOURS_REMAINING = (
        (parseFloat(obj.BATTERY_PERCENT)/100) *
        (ampHourCapacity / 0.3)
      ).toFixed(1);

      if (obj.BATTERY_PERCENT < 0) {
        obj.BATTERY_PERCENT = 0;
        obj.BATTERY_HOURS_REMAINING_STRING = 'critically low';
      } else {
        if (obj.BATTERY_HOURS_REMAINING > 24) {
          obj.BATTERY_HOURS_REMAINING_STRING =
            String((obj.BATTERY_HOURS_REMAINING / 24).toFixed(0)) +
            ' days, ' +
            String((obj.BATTERY_HOURS_REMAINING % 24).toFixed(0)) +
            ' hours left';
        } else {
          obj.BATTERY_HOURS_REMAINING_STRING =
            String(obj.BATTERY_HOURS_REMAINING) + ' hours left';
        }
      }
    }
    this.screen = obj;
  }

  render() {
    this.updateScreen();

    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

    return (
      <View style={{paddingBottom: 30}}>
        <View
          style={[
            styles.container,
            styles.containerPadding,
            styles.titleContainer,
          ]}>
          <Text style={styles.mainTitleText}>Quinn's M3</Text>
        </View>
        <View
          style={[
            styles.largeContainer,
            styles.colContainer,
            styles.containerPaddingLeft,
            styles.containerPaddingBottom,
          ]}>
          <View style={[styles.container]}>
            <IconBulb
              width={iconWidth}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <View
              style={
                ([
                  styles.colContainer,
                  styles.containerPaddingTopHalf,
                  styles.containerPaddingLeftHalf,
                ],
                {paddingTop: 17})
              }>
              <Text style={[styles.secondaryTitleText]}>Angel Eyes</Text>
              <Text style={[styles.normalText, styles.bold, styles.textLarge]}>
                {this.screen.ANGEL_EYES === 'TRUE' ? 'ON' : 'OFF'}
              </Text>
            </View>
          </View>
          <View style={[styles.container]}>
            <IconOutput
              width={iconWidth}
              height={iconHeight + 5}
              fill={Colors.buttonColorOn}
            />
            <View
              style={
                ([
                  styles.colContainer,
                  styles.containerPaddingTopHalf,
                  styles.containerPaddingLeftHalf,
                ],
                {paddingTop: 17})
              }>
              <Text style={[styles.secondaryTitleText]}>Main Voltage</Text>
              <Text style={[styles.normalText, styles.bold, styles.textLarge]}>
                {this.screen.MAIN_VOLTAGE} V
              </Text>
            </View>
          </View>
          <View style={[styles.container]}>
            <IconLightning
              width={iconWidth}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <View
              style={
                ([
                  styles.colContainer,
                  styles.containerPaddingTopHalf,
                  styles.containerPaddingLeftHalf,
                ],
                {paddingTop: 17})
              }>
              <Text style={[styles.secondaryTitleText]}>Aux Voltage</Text>
              <Text style={[styles.normalText, styles.bold, styles.textLarge]}>
                {this.screen.AUX_VOLTAGE} V
              </Text>
            </View>
          </View>
          <View style={[styles.container]}>
            <IconBattery
              width={iconWidth}
              height={iconHeight + 15}
              fill={Colors.buttonColorOn}
            />
            <View
              style={
                ([
                  styles.colContainer,
                  styles.containerPaddingTopHalf,
                  styles.containerPaddingLeftHalf,
                ],
                {paddingTop: 17})
              }>
              <Text style={[styles.secondaryTitleText]}>
                Battery (
                {String(Math.round(this.screen.BATTERY_PERCENT))}%)
              </Text>
              <Text style={[styles.normalText, styles.bold, styles.textLarge]}>
                {this.screen.BATTERY_HOURS_REMAINING_STRING}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
