import React from 'react';
import { Text, View, ScrollView, Dimensions, Alert } from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';
import ButtonGroup from '../components/ButtonGroup.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';

export default class ControlsScreen extends React.Component {
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
    };
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

  render() {
    // Responsive styling
    var { height, width } = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

    return (
      <View style={styles.screenView}>
        <View style={[styles.largeContainer, styles.colContainer]}>
          <ButtonGroupTitle title="Doors" />
          <ButtonGroup
            reference="doors"
            buttons={['Lock', 'Unlock']}
            buttonFunctions={[
              () => this.confirmAction('/doors/lock'),
              () => this.confirmAction('/doors/unlock'),
            ]}
          />

          <ButtonGroupTitle title="Windows" />
          <ButtonGroup
            reference="windows"
            buttons={['Up', 'Down']}
            buttonFunctions={[
              () => this.confirmAction('/windows/up'),
              () => this.confirmAction('/windows/down'),
            ]}
          />

          <ButtonGroupTitle title="Trunk" />
          <ButtonGroup
            reference="trunk"
            buttons={['Open']}
            buttonFunctions={[() => this.confirmAction('/trunk/open')]}
          />

          <ButtonGroupTitle title="Hazards" />
          <ButtonGroup
            reference="hazards"
            buttons={['On', 'Off']}
            buttonFunctions={[
              () => this.confirmAction('/hazards/on'),
              () => this.props.getRequest('/hazards/off'),
            ]}
          />

          <ButtonGroupTitle title="Flashers" />
          <ButtonGroup
            reference="flashers"
            buttons={['On', 'Off']}
            buttonFunctions={[
              () => this.confirmAction('/flashers/on'),
              () => this.props.getRequest('/flashers/off'),
            ]}
          />

          <ButtonGroupTitle title="Radio" />
          <ButtonGroup
            reference="radio"
            buttons={['Power Toggle', 'Input Toggle']}
            buttonFunctions={[
              () => this.props.getRequest('/radio/toggle'),
              () => this.props.getRequest('/radio/mode'),
            ]}
          />
          <ButtonGroup
            reference="radio"
            buttons={['Previous', 'Next']}
            buttonFunctions={[
              () => this.props.getRequest('/radio/prev'),
              () => this.props.getRequest('/radio/next'),
            ]}
          />
          <ButtonGroup
            reference="radio"
            buttons={['Press 1', 'Press 6']}
            buttonFunctions={[
              () => this.props.getRequest('/radio/1'),
              () => this.props.getRequest('/radio/6'),
            ]}
          />
        </View>
      </View>
    );
  }
}
