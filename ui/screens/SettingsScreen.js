import React from 'react';
import {Text, View, Dimensions, Alert} from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';
import ButtonGroup from '../components/ButtonGroup.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';

export default class SettingsScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);

    this.state = {
      toasted: 0,
      fails: 0,
    };
    this.screen = {
      angelEyes: 'N/A',
      sentryMode: 'N/A',
      exhaustNoise: 'N/A',
      variableSpeedVolume: 'N/A',
      wireless: 'N/A',
      autolock: 'N/A',
    };
  }

  _confirmRestart(target) {
    var address = target === 'local' ? '/restart' : '/' + target + '/restart';
    Alert.alert(
      'Confirm Restart',
      'Are you sure you want to restart ' + target + '?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.props.getRequest(address)},
      ],
      {cancelable: true},
    );
  }

  // Handler for update
  _requestUpdate = async (setting, value) => {
    this.props.postRequest('/settings/' + setting + '/' + value, '');
  };

  updateScreen() {
    this.screen = {
      autolock:
        'mdroid.autolock' in this.props.settings
          ? this.props.settings['mdroid.autolock']
          : 'N/A',
      auto_sleep:
        'mdroid.autosleep' in this.props.settings
          ? this.props.settings['mdroid.autosleep']
          : 'N/A',
      wireless:
        'wireless.lte' in this.props.settings
          ? this.props.settings['wireless.lte']
          : 'N/A',
      angelEyes:
        'angel_eyes.power' in this.props.settings
          ? this.props.settings['angel_eyes.power']
          : 'N/A',
      fullPower:
        'usb_hub.power' in this.props.settings
          ? this.props.settings['usb_hub.power']
          : 'N/A',
      exhaustNoise:
        'sound.exhaust_noise' in this.props.settings
          ? this.props.settings['sound.exhaust_noise']
          : 'N/A',
      variableSpeedVolume:
        'sound.vsv' in this.props.settings
          ? this.props.settings['sound.vsv']
          : 'N/A',
    };
  }

  render() {
    this.updateScreen();

    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

    return (
      <View style={styles.screenView}>
        <View
          style={[
            styles.container,
            styles.containerPadding,
            styles.titleContainer,
          ]}>
          <Text style={styles.mainTitleText}>Settings</Text>
        </View>
        <View style={[styles.largeContainer, styles.colContainer]}>
          <ButtonGroupTitle title="Angel Eyes" />
          <ButtonGroup
            buttons={['Off', 'Auto', 'On']}
            buttonFunctions={[
              () => this._requestUpdate('angel_eyes.power', 'OFF'),
              () => this._requestUpdate('angel_eyes.power', 'AUTO'),
              () => this._requestUpdate('angel_eyes.power', 'ON'),
            ]}
            status={this.screen.angelEyes}
          />

          <ButtonGroupTitle title="Full Power" />
          <ButtonGroup
            buttons={['Off', 'Auto', 'On']}
            buttonFunctions={[
              () => this._requestUpdate('usb_hub.power', 'OFF'),
              () => this._requestUpdate('usb_hub.power', 'AUTO'),
              () => this._requestUpdate('usb_hub.power', 'ON'),
            ]}
            status={this.screen.fullPower}
          />

          <ButtonGroupTitle title="LTE" />
          <ButtonGroup
            buttons={['Off', 'On']}
            buttonFunctions={[
              () => this._requestUpdate('wireless.lte', 'OFF'),
              () => this._requestUpdate('wireless.lte', 'ON'),
            ]}
            status={this.screen.wireless}
          />

          <ButtonGroupTitle title="Auto Locking" />
          <ButtonGroup
            buttons={['Off', 'Auto', 'On']}
            buttonFunctions={[
              () => this._requestUpdate('mdroid.autolock', 'OFF'),
              () => this._requestUpdate('mdroid.autolock', 'AUTO'),
              () => this._requestUpdate('mdroid.autolock', 'ON'),
            ]}
            status={this.screen.autolock}
          />

          <ButtonGroupTitle title="Auto Sleep" />
          <ButtonGroup
            buttons={['Off', 'On']}
            buttonFunctions={[
              () => this._requestUpdate('mdroid.auto_sleep', 'OFF'),
              () => this._requestUpdate('mdroid.auto_sleep', 'ON'),
            ]}
            status={this.screen.autoSleep}
          />

          <ButtonGroupTitle title="Enhanced Exhaust" />
          <ButtonGroup
            buttons={['Off', 'Auto', 'On']}
            buttonFunctions={[
              () => this._requestUpdate('sound.exhaust_noise', 'OFF'),
              () => this._requestUpdate('sound.exhaust_noise', 'AUTO'),
              () => this._requestUpdate('sound.exhaust_noise', 'ON'),
            ]}
            status={this.screen.exhaustNoise}
          />

          <ButtonGroupTitle title="Variable Speed Volume" />
          <ButtonGroup
            buttons={['Off', 'On']}
            buttonFunctions={[
              () => this._requestUpdate('sound.vsv', 'OFF'),
              () => this._requestUpdate('sound.vsv', 'ON'),
            ]}
            status={this.screen.variableSpeedVolume}
          />

          <ButtonGroupTitle title="Restart Components" />
          <ButtonGroup
            buttons={['Restart MDroid']}
            buttonFunctions={[() => this._confirmRestart('mdroid')]}
          />
          <ButtonGroup
            buttons={['Restart Board']}
            buttonFunctions={[() => this._confirmRestart('board')]}
          />
        </View>
      </View>
    );
  }
}
