import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';
import CustomInput from '../components/CustomInput.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';
import DataRow from '../components/DataRow.js';

export default class SystemScreen extends React.Component {
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
    };
    this.screen = {
      MAIN_VOLTAGE: 'N/A',
      AUX_VOLTAGE: 'N/A',
      ACC_POWER: 'N/A',
      KEY_POWER: 'N/A',
      ANGEL_EYES: 'N/A',
      USB_HUB: 'N/A',
      LTE_ON: 'N/A',
      KEY_STATE: 'N/A',
      DOORS_OPEN: 'N/A',
      OUTSIDE_TEMP: 'N/A',
      INTERIOR_TEMPERATURE: 'N/A',
      INTERIOR_HUMIDITY: 'N/A',
    };
  }

  updateScreen() {
    var obj = {};
    console.log(this.props.session);
    Object.keys(this.screen).map(item => {
      obj[item] =
        item.toLowerCase() in this.props.session
          ? this.props.session[item.toLowerCase()]
          : 'N/A';
    });
    this.screen = obj;
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
          <Text style={styles.mainTitleText}>System</Text>
        </View>

        <View style={[styles.containerPadding,{paddingBottom: 40}]}>
          <ButtonGroupTitle title="Custom Input" />
          <CustomInput request={this.props.getRequest} />
          {Object.keys(this.screen).map(item => {
            if (typeof this.screen[item] === 'string') {
              return (
                <DataRow title={item} value={this.screen[item]} key={item} />
              );
            }
          })}
        </View>
      </View>
    );
  }
}
