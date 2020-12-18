import React from 'react';
import { Text, View, Dimensions, Alert } from 'react-native';
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
import IconLTE from '../images/icons/lte.js';
import IconTablet from '../images/icons/tablet.js';
import IconDoor from '../images/icons/door.js';
import IconLock from '../images/icons/lock.js';
import IconTrunk from '../images/icons/trunk.js';
import IconPower from '../images/icons/power.js';

import Colors from '../constants/Colors.js';
import { TouchableOpacity } from 'react-native';
const iconHeight = 45;
const iconWidth = 45;

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

  confirmAction(action) {
    Alert.alert(
      'Send ' + action + '?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => this.props.getRequest(action) },
      ],
      { cancelable: true },
    );
  }

  constructor(props) {
    super(props);

    this.state = {
      fails: 0,
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
        (parseFloat(obj.BATTERY_PERCENT) / 100) *
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
    var { height, width } = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

    return (
      <View style={styles.screenView}>
        <View
          style={[
            styles.largeContainer,
            styles.rowContainer,
            styles.containerPaddingBottom,
            { flexWrap: 'wrap' }
          ]}>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconPower
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Aux Power</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.UNLOCK_POWER === 'TRUE' ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconTablet
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Display</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.USB_HUB === 'TRUE' ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconLTE
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>LTE</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.LTE === 'TRUE' ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconLock
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Doors</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.DOORS_LOCKED === 'TRUE' ? 'LOCKED' : 'UNLOCKED'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconDoor
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Windows</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.WINDOWS_OPEN === 'TRUE' ? 'OPEN' : 'CLOSED'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.confirmAction('/trunk/open')} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconTrunk
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Trunk</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.TRUNK_OPEN === 'TRUE' ? 'OPEN' : 'CLOSED'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconBulb
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Angel Eyes</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.ANGEL_EYES === 'TRUE' ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconOutput
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Main Voltage</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.MAIN_VOLTAGE} V
              </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconLightning
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }, { textAlign: "center" }]}>Aux Voltage</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.AUX_VOLTAGE} V
              </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconBattery
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>
              Battery (
                {String(Math.round(this.screen.BATTERY_PERCENT))}%)
              </Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.BATTERY_HOURS_REMAINING_STRING}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
