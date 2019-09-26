import React from 'react';
import {
	StyleSheet,
	Text,
	View,
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

	componentDidUpdate(prevProps){
		if(prevProps.settings !== this.props.settings && this.props.settings != undefined){
			this.setState({
				region: {
					latitude: "latitude" in this.props.settings ? parseFloat(this.props.settings["latitude"]) : LATITUDE,
					longitude: "longitude" in this.props.settings ? parseFloat(this.props.settings["longitude"]) : LONGITUDE,
					latitudeDelta: LATITUDE_DELTA,
					longitudeDelta: LONGITUDE_DELTA,
				},
				coordinate: {
					latitude: "latitude" in this.props.settings ? parseFloat(this.props.settings["latitude"]) : LATITUDE,
					longitude: "longitude" in this.props.settings ? parseFloat(this.props.settings["longitude"]) : LONGITUDE,
				},
				gps: {
					time: "time" in this.props.settings ? this.props.settings["time"] : "N/A",
					course: "course" in this.props.settings ? this.props.settings["course"] : "N/A",
					speed: "speed" in this.props.settings ? this.props.settings["speed"] : "N/A"
				}
			}, function(){
	
			});
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
		);
		}
}
