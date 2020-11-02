import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  Linking,
} from 'react-native';

import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';

import MapboxGL from "@react-native-mapbox-gl/maps";
MapboxGL.setAccessToken("pk.eyJ1IjoicWNhc2V5MSIsImEiOiJja2d6ZHNzcnkwZG5uMnRtdGh3dTdhcjJzIn0.rw8W2nbgzrPrZ_AQlFpRZA");
import MapStyle, {
  LATITUDE,
  LONGITUDE,
  LATITUDE_DELTA,
  LONGITUDE_DELTA,
} from '../constants/MapStyle.js';

export default class GpsScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);

    this.screen = {
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
    if (this.screen.region.latitude !== 0) {
      return (
        <MapboxGL.MapView styleURL="mapbox://styles/qcasey1/ckgzjblff22i41ali9vujp0bw" scrollEnabled={false} style={styles.map}>
            <MapboxGL.Camera
              zoomLevel={15}
              pitch={0}
              animationDuration={200}
              centerCoordinate={[this.screen.region.longitude, this.screen.region.latitude]}
            />
            <MapboxGL.PointAnnotation 
              id="car"
              coordinate={[this.screen.region.longitude, this.screen.region.latitude]}
              title="Car"
            />
            <MapboxGL.UserLocation />
          </MapboxGL.MapView>
      );
    } else {
      console.log('No GPS signal');
      return (
        <>
          <MapboxGL.MapView styleURL="mapbox://styles/qcasey1/ckgzjblff22i41ali9vujp0bw" scrollEnabled={false} style={styles.map}>
            <MapboxGL.Camera
              zoomLevel={10}
              pitch={0}
              centerCoordinate={[this.screen.region.latitude, this.screen.region.longitude]}
            />
            <MapboxGL.PointAnnotation 
              id="car"
              coordinate={[this.screen.region.latitude, this.screen.region.longitude]}
              title="Car"
            />
          </MapboxGL.MapView>
          <View style={styles.overlaidView}>
            <Text style={[styles.mainTitleText, styles.overlaidText]}>
              GPS Signal Lost
            </Text>
          </View>
        </>
      );
    }
  }

  updateScreen() {
    let session = this.props.gps;
    this.screen = {
      ...this.screen,
      region: {
        latitude:
          'gps.lat' in session
            ? parseFloat(session['gps.lat'])
            : this.screen.region.latitude,
        longitude:
          'gps.lng' in session
            ? parseFloat(session['gps.lng'])
            : this.screen.region.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      coordinate: {
        latitude:
          'gps.lat' in session
            ? parseFloat(session['gps.lat'])
            : this.screen.region.latitude,
        longitude:
          'gps.lng' in session
            ? parseFloat(session['gps.lng'])
            : this.screen.region.longitude,
      },
      gps: {
        altitude: 'gps.alt' in session ? session['gps.alt'] : 'N/A',
        speed: 'gps.speed' in session ? session['gps.speed'] : 'N/A',
      },
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
          <Text style={styles.mainTitleText}>Location</Text>
        </View>
        <View style={[styles.largeContainer, styles.colContainer]}>
          <View pointerEvents="auto">
            <TouchableWithoutFeedback
              onPress={() =>
                this.screen.region.latitude !== LATITUDE
                  ? this.openInMaps(
                      this.screen.region.latitude,
                      this.screen.region.longitude,
                    )
                  : console.log('Invalid GPS coordinates')
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
              {marginBottom: 60},
            ]}>
            <Text style={styles.auxText}>
              Latitude: {this.screen.region.latitude}
            </Text>
            <Text style={styles.auxText}>
              Longitude: {this.screen.region.longitude}
            </Text>
            <Text style={styles.auxText}>Speed: {this.screen.gps.speed}</Text>
            <Text style={styles.auxText}>
              Altitude: {this.screen.gps.altitude}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
