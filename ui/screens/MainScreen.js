import React from 'react';
import { Text, View, Dimensions, Alert } from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';

// Icons
import IconLucio from '../images/icons/lucio';
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
import IconBluetooth from '../images/icons/bluetooth';

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

  confirmAction(title, action) {
    Alert.alert(
      title,
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Execute', onPress: () => action() },
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
      main_voltage: 'UNKNOWN',
      aux_voltage: 'UNKNOWN',
      INTERIOR_TEMPERATURE: 'UNKNOWN',
      angel_eyes: 'UNKNOWN',
      battery_percent: 'UNKNOWN',
    };
  }

  cToF(degree) {
    return (degree * 9) / 5 + 32;
  }

  updateScreen() {
    var obj = {};
    Object.keys(this.props.session).map(item => {
      //let value = item in this.props.session ? this.props.session[item] : 'UNKNOWN';
      let value = this.props.session[item];
      if (!isNaN(parseFloat(value))) {
        value = parseFloat(value).toFixed(2);
      }
      obj[item] = value;
    });

    if ('aux_voltage' in this.props.session) {
      obj.battery_hours_remaining = (
        (parseFloat(obj.battery_percent) / 100) *
        (ampHourCapacity / 0.3)
      ).toFixed(1);

      if (obj.battery_percent < 0) {
        obj.battery_percent = 0;
        obj.battery_hours_remaining_string = 'critically low';
      } else {
        if (obj.battery_hours_remaining > 24) {
          obj.battery_hours_remaining_string =
            String((obj.battery_hours_remaining / 24).toFixed(0)) +
            ' days, ' +
            String((obj.battery_hours_remaining % 24).toFixed(0)) +
            ' hours left';
        } else {
          obj.battery_hours_remaining_string =
            String(obj.battery_hours_remaining) + ' hours left';
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
              {this.screen.UNLOCK_POWER === "true" ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={true} style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconLucio
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Board</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {global.isConnectedToDevice ? 'CONNECTED' : 'DISCONNECTED'}
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
              {this.screen.LTE === "true" ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { var command = this.screen["network.bnep0"] === "true" ? 'disconnect' : 'connect'; this.confirmAction(command.toUpperCase()[0]+command.slice(1)+" Bluetooth network?", () => this.props.getRequest('/bluetooth/network/'+command)) } }  
            style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconBluetooth
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Tether</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen["network.bnep0"] === "true" ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { var command = this.screen.doors_locked === "true" ? 'unlock' : 'lock'; this.confirmAction(command.toUpperCase()[0]+command.slice(1)+" doors?", () => this.props.getRequest('/doors/'+command)) } } 
            style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconLock
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Doors</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.doors_locked === "true" ? 'LOCKED' : 'UNLOCKED'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { var command = this.screen.windows_open === "true" ? 'up' : 'down'; this.confirmAction("Roll "+command+" windows?", () => this.props.getRequest('/windows/'+command)) } }  
            style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconDoor
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Windows</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.windows_open === "true" ? 'OPEN' : 'CLOSED'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.confirmAction("Open trunk?", () => this.props.getRequest('/trunk/open'))}
            style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconTrunk
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Trunk</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.trunk_open === "true" ? 'OPEN' : 'CLOSED'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { 
              var command = this.screen.angel_eyes === "true" ? 'AUTO' : 'ON'; 
              this.confirmAction("Toggle angel eyes?", () => this.props.postRequest('/settings/components.angel_eyes/'+command, '')) } 
            } 
            style={[styles.mainScreenIcons, styles.colContainer]}>
            <IconBulb
              width={iconWidth}
              style={{ alignSelf: "center" }}
              height={iconHeight}
              fill={Colors.buttonColorOn}
            />
            <Text style={[styles.secondaryTitleText, { alignSelf: "center", paddingVertical: 10 }]}>Angel Eyes</Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.angel_eyes === "true" ? 'ON' : 'OFF'}
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
              {this.screen.USB_HUB === "true" ? 'ON' : 'OFF'}
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
                {String(Math.round(this.screen.battery_percent))}%)
              </Text>
            <Text style={[styles.secondaryNormalText, styles.bold, styles.textLarge, { alignSelf: "center" }]}>
              {this.screen.battery_hours_remaining_string}
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
              {this.screen.main_voltage} V
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
              {this.screen.aux_voltage} V
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
