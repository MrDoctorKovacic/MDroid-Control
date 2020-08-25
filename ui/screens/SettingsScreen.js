import React from 'react';
import {Text, View, Dimensions} from 'react-native';
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
      wireless:
        'wireless.lte' in this.props.settings
          ? this.props.settings['wireless.lte']
          : 'N/A',
      angelEyes:
        'angel_eyes.power' in this.props.settings
          ? this.props.settings['angel_eyes.power']
          : 'N/A',
      videoRecording:
        'board.video_recording' in this.props.settings
          ? this.props.settings['board.video_recording']
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

          <ButtonGroupTitle title="Video Recording" />
          <ButtonGroup
            buttons={['Off', 'On']}
            buttonFunctions={[
              () => this._requestUpdate('board.video_recording', 'OFF'),
              () => this._requestUpdate('board.video_recording', 'ON'),
            ]}
            status={this.screen.videoRecording}
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
        </View>
      </View>
    );
  }
}
