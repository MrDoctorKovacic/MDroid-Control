import React from 'react';
import {Text, View, Dimensions, Alert} from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';
import ButtonGroup from '../components/ButtonGroup.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';

export default class PowerScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.settings !== this.props.settings) {
      if (this.props.settings !== undefined) {
        this.setState({
          mainPower:
            'MDROID' in this.props.settings &&
            'SLEEP' in this.props.settings.MDROID
              ? this.props.settings.MDROID.SLEEP
              : 'N/A',
          boardPower:
            'BOARD' in this.props.settings &&
            'POWER' in this.props.settings.BOARD
              ? this.props.settings.BOARD.POWER
              : 'N/A',
          tabletPower:
            'TABLET' in this.props.settings &&
            'POWER' in this.props.settings.TABLET
              ? this.props.settings.TABLET.POWER
              : 'N/A',
        });
      }
    }
  }

  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);

    this.state = {
      tabletPower: 'N/A',
      boardPower: 'N/A',
      mainPower: 'N/A',
      toasted: 0,
      refreshing: false,
      fails: 0,
    };
  }

  // Handler for update
  _requestUpdatePower = async (component, setting, value) => {
    this.props.postRequest(
      '/settings/' + component + '/' + setting + '/' + value,
      '',
    );
  };

  _confirmRestart(target) {
    var address = target == 'local' ? '/restart' : '/' + target + '/restart';
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

  render() {
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
          <Text style={styles.mainTitleText}>Power</Text>
        </View>
        <View style={[styles.largeContainer, styles.colContainer]}>
          <ButtonGroupTitle title="Auto Sleep" />
          <ButtonGroup
            buttons={['Off', 'On']}
            buttonFunctions={[
              () => this._requestUpdatePower('MDROID', 'SLEEP', 'OFF'),
              () => this._requestUpdatePower('MDROID', 'SLEEP', 'AUTO'),
            ]}
            status={this.state.mainPower}
          />

          <ButtonGroupTitle title="Video Board" />
          <ButtonGroup
            buttons={['Off', 'Auto', 'On']}
            buttonFunctions={[
              () => this._requestUpdatePower('BOARD', 'POWER', 'OFF'),
              () => this._requestUpdatePower('BOARD', 'POWER', 'AUTO'),
              () => this._requestUpdatePower('BOARD', 'POWER', 'ON'),
            ]}
            status={this.state.boardPower}
          />

          <ButtonGroupTitle title="Tablet" />
          <ButtonGroup
            buttons={['Off', 'Auto', 'On']}
            buttonFunctions={[
              () => this._requestUpdatePower('TABLET', 'POWER', 'OFF'),
              () => this._requestUpdatePower('TABLET', 'POWER', 'AUTO'),
              () => this._requestUpdatePower('TABLET', 'POWER', 'ON'),
            ]}
            status={this.state.tabletPower}
          />

          <ButtonGroupTitle title="Restart Components" />
          <ButtonGroup
            buttons={['Restart MDroid']}
            buttonFunctions={[() => this._confirmRestart('local')]}
          />
          <ButtonGroup
            buttons={['Restart Board']}
            buttonFunctions={[() => this._confirmRestart('board')]}
          />
          <ButtonGroup
            buttons={['Restart Pi']}
            buttonFunctions={[() => this._confirmRestart('pi')]}
          />
        </View>
      </View>
    );
  }
}
