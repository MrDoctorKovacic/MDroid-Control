import React from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  RefreshControl,
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

export default class GpsScreen extends React.Component {

  _refreshGpsData() {
    try {
      return fetch("http://"+global.SERVER_HOST+"/session/gps")
			.then((response) => response.json())
			.then((jsonResponse) => {
        if(jsonResponse != "{}") {
          this.setState({
            region: {
              latitude: "latitude" in jsonResponse ? parseFloat(jsonResponse["latitude"]) : LATITUDE,
              longitude: "longitude" in jsonResponse ? parseFloat(jsonResponse["longitude"]) : LONGITUDE,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            coordinate: {
              latitude: "latitude" in jsonResponse ? parseFloat(jsonResponse["latitude"]) : LATITUDE,
              longitude: "longitude" in jsonResponse ? parseFloat(jsonResponse["longitude"]) : LONGITUDE,
            },
            gps: {
              time: "time" in jsonResponse ? jsonResponse["time"] : "N/A",
              course: "course" in jsonResponse ? jsonResponse["course"] : "N/A",
              speed: "speed" in jsonResponse ? jsonResponse["speed"] : "N/A"
            }
          }, function(){
      
          });
        }
			})
			.catch((error) => {
        console.log(error);
        this.setState({
					fails: this.state.fails + 1
        });
				if(this.state.fails > 4 && !this.state.toasted) {
					this.setState({toasted: 1});
					ToastAndroid.show("Failed to fetch GPS data.", ToastAndroid.SHORT);
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
    this._refreshGpsData();
  }

  componentWillUnMount() {
    rol();
  }

  _onRefreshGps = () => {
		this.setState({refreshing: true});
		this._refreshGpsData(this).then(() => {
			this.setState({refreshing: false});
		});
	}

	constructor(props) {
		super(props);

    this.state = {
      refreshing: false,
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
        course: "N/A",
        speed: "N/A"
      },
      fails: 0
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
      <ScrollView 
						refreshControl={<RefreshControl 
						refreshing={this.state.refreshing} 
						onRefresh={this._onRefreshGps} />} 
						removeClippedSubviews={true} 
					>
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
              <Text style={styles.auxText}>Latitude: {this.state.region.latitude}</Text>
              <Text style={styles.auxText}>Longitude: {this.state.region.longitude}</Text>
              <Text style={styles.auxText}>Time: {this.state.gps.time}</Text>
              <Text style={styles.auxText}>Speed: {this.state.gps.speed}</Text>
              <Text style={styles.auxText}>Course: {this.state.gps.course}</Text>
            </View>
    			</View>
        </View>
      </ScrollView>
		);
  	}
}
