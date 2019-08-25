import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  Dimensions,
  TouchableOpacity,
  Platform,
  Linking
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
import styles from '../../assets/screenStyles.js';

import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapStyle, { LATITUDE, LONGITUDE, LATITUDE_DELTA, LONGITUDE_DELTA } from '../constants/MapStyle.js'

export default class SystemScreen extends React.Component {

  _refreshSensorData() {
    try {
      componentHandler = this;
      return fetch("http://"+global.SERVER_HOST+"/session/gps")
      .then(function(response) {
        return response.json();
      })
      .then(function(sessionObject) {
        console.log(sessionObject);
        componentHandler.setState({
          region: {
            latitude: "LATITUDE" in sessionObject ? sessionObject["LATITUDE"] : "N/A",
            longitude: "LONGITUDE" in sessionObject ? sessionObject["LONGITUDE"] : "N/A",
          },
          coordinate: {
            latitude: "LATITUDE" in sessionObject ? sessionObject["LATITUDE"] : "N/A",
            longitude: "LONGITUDE" in sessionObject ? sessionObject["LONGITUDE"] : "N/A",
          },
          gps: {
            time: "TIME" in sessionObject ? sessionObject["TIME"] : "N/A",
            altitude: "ALTITUDE" in sessionObject ? sessionObject["ALTITUDE"] : "N/A",
            climb: "CLIMB" in sessionObject ? sessionObject["CLIMB"] : "N/A",
            speed: "SPEED" in sessionObject ? sessionObject["SPEED"] : "N/A"
          }
        });
      }).catch((error) => {
        console.log(error);
        if(!this.state.toasted) {
          this.setState({toasted: 1});
          ToastAndroid.show("Failed to fetch vehicle data.", ToastAndroid.SHORT);
        }
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
    this._refreshSensorData();
  }

  componentWillUnMount() {
    rol();
  }

	constructor(props) {
		super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      gps: {
        time: "N/A",
        altitude: "N/A",
        climb: "N/A",
        speed: "N/A"
      }
    };
	}

  openInMaps(lat, lng) {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = 'Car';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });


    Linking.openURL(url);
  }

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, this.props.isConnected);

		return (
        <View>
    			<View style={[styles.container, styles.containerPadding, styles.titleContainer]}>
    				<Text style={styles.mainTitleText}>Location</Text>
    			</View>
    			<View style={[styles.largeContainer, styles.colContainer]}>

          <View pointerEvents="auto">
            <TouchableOpacity onPress={() => this.openInMaps(this.state.region.latitude, this.state.region.longitude)}>
                <MapView
                  provider={PROVIDER_GOOGLE}
                  initialRegion={this.state.region}
                  customMapStyle={MapStyle}
                  style={styles.map}>
                 <Marker coordinate={this.state.region} />
                </MapView>
              </TouchableOpacity>
            </View>

            <View style={[styles.container, styles.containerPaddingLeft, styles.containerPaddingRight, styles.colContainer]}>
              <Text style={styles.auxText}>GPS Fix: {this.state.region.latitude}, {this.state.region.longitude}</Text>
              <Text style={styles.auxText}>Time Fixed: {this.state.gps.time}</Text>
              <Text style={styles.auxText}>Altitude: {this.state.gps.altitude}</Text>
              <Text style={styles.auxText}>Climb: {this.state.gps.climb}</Text>
              <Text style={styles.auxText}>Speed: {this.state.gps.speed}</Text>
            </View>
    			</View>
        </View>
		);
  	}
}
