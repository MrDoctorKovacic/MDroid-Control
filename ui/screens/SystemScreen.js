import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
  View,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import styles from '../../assets/screenStyles.js';

import DataRow from '../components/DataRow.js';

export default class SystemScreen extends React.Component {

  _refreshSystemData() {
    try {
      componentHandler = this;
      return fetch("http://"+global.SERVER_HOST+"/session")
      .then(function(response) {
        return response.json();
      })
      .then(function(sessionObject) {
        console.log(sessionObject);
        Object.keys(componentHandler.state).map((item) => {
          if (item != "refreshing") {
            componentHandler.setState({ [item]: item in sessionObject ? sessionObject[item]["value"] : "N/A" })
          }
        });
      });
    }
    catch (error) {
      console.log(error);
      if(!this.state.toasted) {
        this.setState({toasted: 1});
        ToastAndroid.show("Failed to fetch vehicle data.", ToastAndroid.SHORT);
      }
    }
  }

  componentDidMount() {
    loc(this);
    this._refreshSystemData();
  }

  componentWillUnMount() {
    rol();
  }

  _onRefreshSystem = () => {
		this.setState({refreshing: true});
		this._refreshSystemData(this).then(() => {
			this.setState({refreshing: false});
		});
	}

	constructor(props) {
		super(props);

    this.state = {
      refreshing: false,
      AUX_VOLTAGE: "N/A",
      AUX_CURRENT: "N/A",
      ACC_POWER: "N/A",
      BOARD_POWER: "N/A",
      TABLET_POWER: "N/A",
      KEY_DETECTED: "N/A",
      KEY_STATE: "N/A",
      DOORS_OPEN: "N/A",
      OUTSIDE_TEMP: "N/A",
    };
	}

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, this.props.isConnected);

		return (
      <ScrollView 
						refreshControl={<RefreshControl 
						refreshing={this.state.refreshing} 
						onRefresh={this._onRefreshSystem} />} 
						removeClippedSubviews={true} 
					>
        <View>
    			<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
    				<Text style={styles.mainTitleText}>System</Text>
    			</View>
          <View style={[styles.containerPadding]}>
          {
            Object.keys(this.state).map((item) => {
              if (item != "refreshing" && item != "orientation") {
                return (
                  <DataRow title={item} value={this.state[item]} />
                );
              }
            })
          }
          </View>
        </View>
      </ScrollView>
		);
  	}
}
