import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Linking,
} from 'react-native';
import {Overlay} from 'react-native-elements';

import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapStyle, {
  LATITUDE,
  LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '../constants/MapStyle.js';

export default class GpsScreen extends React.Component {
  componentDidUpdate(prevProps) {
    console.log(prevProps);
    if (
      prevProps.settings !== this.props.settings &&
      this.props.settings !== undefined
    ) {
      this.setState(
        {
          region: {
            latitude:
              'latitude' in this.props.settings
                ? parseFloat(this.props.settings.latitude)
                : LATITUDE,
            longitude:
              'longitude' in this.props.settings
                ? parseFloat(this.props.settings.longitude)
                : LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
          coordinate: {
            latitude:
              'latitude' in this.props.settings
                ? parseFloat(this.props.settings.latitude)
                : LATITUDE,
            longitude:
              'longitude' in this.props.settings
                ? parseFloat(this.props.settings.longitude)
                : LONGITUDE,
          },
          gps: {
            altitude:
              'altitude' in this.props.settings
                ? this.props.settings.altitude
                : 'N/A',
            speed:
              'speed' in this.props.settings
                ? this.props.settings.speed
                : 'N/A',
          },
        },
        function() {},
      );
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
        course: 'N/A',
        altitude: 'N/A',
        speed: 'N/A',
      },
      fails: 0,
    };
  }

  openInMaps(lat, lng) {
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const latLng = `${lat},${lng}`;
    const label = 'Car';
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
  }

  renderMap(styles) {
    if (this.state.gps.speed != "N/A") {
      return(
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={this.state.region}
        customMapStyle={MapStyle}
        style={styles.map}
        showsUserLocation={true}
        scrollEnabled={false}>
          <Marker coordinate={this.state.region} />
      </MapView>
      );
    } else {
      return(
        <>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={MapStyle}
        style={styles.map}
        showsUserLocation={true}
        scrollEnabled={false} />
        <View style={styles.overlaidView}>
          <Text style={[styles.mainTitleText, styles.overlaidText]}>
            GPS Signal Lost
          </Text>
        </View>
        </>
      );
    }
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
          <Text style={styles.mainTitleText}>Location</Text>
        </View>
        <View style={[styles.largeContainer, styles.colContainer]}>
          <View pointerEvents="auto">
            <TouchableWithoutFeedback
              onPress={() => this.state.gps.speed != "N/A" ? 
                this.openInMaps(
                  this.state.region.latitude,
                  this.state.region.longitude,
                ) : console.log("Invalid GPS coordinates")
              }>
              {this.renderMap(styles)}
            </TouchableWithoutFeedback>
          </View>

          <View
            style={[
              styles.container,
              styles.containerPaddingLeft,
              styles.containerPaddingRight,
              styles.colContainer,
            ]}>
            <Text style={styles.auxText}>
              Latitude: {this.state.region.latitude}
            </Text>
            <Text style={styles.auxText}>
              Longitude: {this.state.region.longitude}
            </Text>
            <Text style={styles.auxText}>Speed: {this.state.gps.speed}</Text>
            <Text style={styles.auxText}>Altitude: {this.state.gps.altitude}</Text>
          </View>
        </View>
      </View>
    );
  }
}
