import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';
import CustomInput from '../components/CustomInput.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';
import DataRow from '../components/DataRow.js';

export default class SystemScreen extends React.Component {
  componentDidUpdate(prevProps) {
    if (
      prevProps.session !== this.props.session &&
      this.props.session !== undefined
    ) {
      var obj = {};
      Object.keys(this.state).map(item => {
        if (item !== 'refreshing' && item !== 'fails') {
          obj[item] =
            item in this.props.session ? this.props.session[item] : 'N/A';
        }
      });
      this.setState(obj);
    }
  }

  storeData = async (key, data) => {
    try {
      await AsyncStorage.setItem('@'+key, data)
    } catch (e) {
      // saving error
      console.log(e)
    }
  }

  getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem('@'+key)
      if(value !== null) {
        // value previously stored
        this.setState({key: value})
      }
    } catch(e) {
      // error reading value
      console.log(e)
    }
  }

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
      MAIN_VOLTAGE: 'N/A',
      AUX_VOLTAGE: 'N/A',
      AUX_CURRENT: 'N/A',
      ACC_POWER: 'N/A',
      ANGEL_EYES_POWER: 'N/A',
      BOARD_POWER: 'N/A',
      TABLET_POWER: 'N/A',
      WIFI_CONNECTED: 'N/A',
      LTE_ON: 'N/A',
      KEY_DETECTED: 'N/A',
      KEY_STATE: 'N/A',
      DOORS_OPEN: 'N/A',
      OUTSIDE_TEMP: 'N/A',
      INTERIOR_TEMPERATURE: 'N/A',
      INTERIOR_HUMIDITY: 'N/A',
    };
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
          <Text style={styles.mainTitleText}>System</Text>
        </View>

        <View style={[styles.containerPadding]}>
          <ButtonGroupTitle title="Server Address" />
          <CustomInput request={this.props.getRequest} />
        </View>

        <View style={[styles.containerPadding]}>
          <ButtonGroupTitle title="Custom Input" />
          <CustomInput request={this.props.getRequest} />
          {Object.keys(this.state).map(item => {
            if (
              typeof this.state[item] === 'string' &&
              item !== 'refreshing' &&
              item !== 'fails' &&
              item !== 'orientation'
            ) {
              return <DataRow title={item} value={this.state[item]} />;
            }
          })}
        </View>
      </View>
    );
  }
}
