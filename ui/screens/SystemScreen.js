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
      return fetch("http://"+global.SERVER_HOST+"/session")
			.then((response) => response.json())
			.then((sessionObject) => {
        if(sessionObject["ok"]) {
					jsonData = sessionObject["output"];
          Object.keys(this.state).map((item) => {
            if (item != "refreshing" && item != "fails") {
              this.setState({ [item]: item in jsonData ? jsonData[item]["value"] : "N/A" })
            }
          })
        }
			})
			.catch((error) => {
        console.log(error);
        this.setState({
					fails: this.state.fails + 1
        });
        if(this.state.fails > 4) {
					this.setState({toasted: 1});
          ToastAndroid.show("Failed to fetch system data.", ToastAndroid.SHORT);
        }
        this._refreshSystemData();
      });
    }
    catch (error) {
      console.log(error);
      if(!this.state.toasted) {
        this.setState({toasted: 1});
        ToastAndroid.show("Failed to fetch system data.", ToastAndroid.SHORT);
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
      fails: 0,
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
              if (typeof this.state[item] == "string" && item != "refreshing" && item != "fails" && item != "orientation") {
                return (
                  <DataRow isConnected={this.props.isConnected} title={item} value={this.state[item]} />
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
