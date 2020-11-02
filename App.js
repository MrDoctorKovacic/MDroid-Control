import React from 'react';
import {
  Dimensions,
  StatusBar,
  ToastAndroid,
  RefreshControl,
  ScrollView,
  View,
  Image,
  Text,
} from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Swiper from 'react-native-swiper';
import {Overlay} from 'react-native-elements';
import MQTT from 'sp-react-native-mqtt';

// Screens
import MainScreen from './ui/screens/MainScreen.js';
import ControlsScreen from './ui/screens/ControlsScreen.js';
import SettingsScreen from './ui/screens/SettingsScreen.js';
import GpsScreen from './ui/screens/GpsScreen.js';
import SystemScreen from './ui/screens/SystemScreen.js';
import IconRow from './ui/components/IconRow.js';

import reloadStyles from './ui/styles/screen.js';
import reloadMainStyles from './ui/styles/main.js';

// Config
import {serverHost, token, user, pass} from './config.json';
global.SERVER_HOST = serverHost;
global.TOKEN = token;
global.USER = user;
global.PASS = pass;
global.client = undefined;
global.isConnected = false;
global.isConnectedToDevice = false;

export const Publish = async (method, path, data) => {
  console.log(`Publishing ${data} to ${path} with method ${method}`);
  global.client.publish(
    'vehicle/requests/mdroid',
    `{"method": "${method}", "path": "${path}", "postData": "${data}"}`,
    2,
    false,
  );
};

export const postRequest = (path, values) => {
  Publish('POST', path, values);
};
export const getRequest = path => {
  Publish('GET', path, '');
};

var newState = {};
var newStateTimer;

export default class App extends React.Component {
  setupMQTT() {
    let component = this;
    /* create mqtt client */
    MQTT.createClient({
      uri: global.SERVER_HOST,
      clientId: 'mdroid-control',
      user: global.USER,
      pass: global.PASS,
      auth: true,
    })
      .then(function(client) {
        global.client = client;

        global.client.on('closed', function() {
          console.warn('mqtt.event.closed');
          ToastAndroid.show('MQTT connection closed, reconnecting...');
          global.client.reconnect();
        });

        global.client.on('error', function(msg) {
          console.warn('mqtt.event.error', msg);
          ToastAndroid.show('MQTT error: ' + msg, ToastAndroid.SHORT);
          global.client.reconnect();
        });

        global.client.on('message', function(msg) {
          component.handleMessage(msg);
        });

        global.client.on('connect', function() {
          console.log('connected');
          global.client.subscribe('vehicle/session/#', 0);
          global.client.subscribe('vehicle/settings/#', 0);
          global.client.subscribe('$SYS/broker/clients/active', 0);
        });

        global.client.connect();
      })
      .catch(function(err) {
        console.warn(err);
      });
  }

  flushState() {
    console.log('Flushing state!');
    this.setState({
      ...newState,
      connectingOverlayHidden: true,
      isConnected: true,
    });
    console.log(newState);
    newState = {};
  }

  handleMessage(msg) {
    // Create new state
    newState = {...this.state, ...newState};
    const parsedTopic = msg.topic.replace('vehicle/', '').split('/');
    const topic = parsedTopic[0];

    if (topic == "session") {
      const key = parsedTopic.slice(1).join('.');
      newState[topic][key] = msg.data.toUpperCase();

    } else if (topic === "settings") {
      const key = parsedTopic.slice(1).join('.');
      newState[topic][key] = msg.data.toUpperCase();

    } else if (topic === '$SYS') {
      global.isConnectedToDevice = msg.data === 2;
    } else {
      console.log(msg);
      console.warn('No action found for topic');
      return;
    }

    if (newStateTimer !== undefined) {
      clearTimeout(newStateTimer);
    }
    newStateTimer = setTimeout(
      this.flushState.bind(this),
      this.state.isConnected ? 0 : 1000,
    );
  }

  componentWillUpdate(nextProps, nextState) {
    global.isConnected = nextState.isConnected;
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isConnected !== this.state.isConnected) {
      global.isConnected = this.state.isConnected;
    }
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true);
    StatusBar.setBackgroundColor('#000000');
    StatusBar.setTranslucent(true);
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);
    this.setupMQTT();
    this.state = {
      isConnected: false,
      refreshing: false,
      connectingOverlayHidden: false,

      settings: {},
      session: {},
      gps: {},
    };
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.setState({refreshing: false});
  };

  render() {
    changeNavigationBarColor('#000000', false);

    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var isVertical = width < height;
    var image = isVertical
      ? require('./ui/images/1.png')
      : require('./ui/images/3-rotated.png');
    var mainStyles = reloadMainStyles(isVertical, this.state.isConnected);
    var styles = reloadStyles(height < width, this.state.isConnected);

    var refeshControl = (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this._onRefresh}
      />
    );

    const overlayText = 'Connecting...';
    return (
      <View style={[mainStyles.container, {marginTop: 25}]} onLayout={this._onLayout}>
        <Overlay
          isVisible={
            !this.state.isConnected && !this.state.connectingOverlayHidden
          }
          overlayBackgroundColor="rgba(0, 0, 0, 1)"
          width="auto"
          height="auto">
          <Text style={[styles.mainTitleText, mainStyles.overlayText]}>
            {overlayText}
          </Text>
        </Overlay>

        <View>
          <View style={[mainStyles.imageContainer]}>
            <Image style={mainStyles.mainLeftImage} source={image} />
          </View>

          <View style={[mainStyles.iconContainer]}>
            <IconRow
              session={this.state.session}
              settings={this.state.settings}
            />
          </View>
        </View>

        <Swiper
          index={0}
          style={mainStyles.swiperContainer}
          showsPagination={true}
          opacity={this.state.isConnected ? 1 : 0.7}
          dotColor="rgba(255,255,255,.2)"
          activeDotColor="rgba(255,255,255,1)">
          <ScrollView
            refreshControl={refeshControl}
            removeClippedSubviews={true}>
            <MainScreen
              postRequest={postRequest}
              getRequest={getRequest}
              session={this.state.session}
            />
          </ScrollView>

          <ControlsScreen
            postRequest={postRequest}
            getRequest={getRequest}
            session={this.state.session}
            settings={this.state.settings}
          />

          <ScrollView
            refreshControl={refeshControl}
            removeClippedSubviews={true}>
            <GpsScreen
              postRequest={postRequest}
              getRequest={getRequest}
              gps={this.state.session}
            />
          </ScrollView>

          <ScrollView
            refreshControl={refeshControl}
            removeClippedSubviews={true}>
            <SettingsScreen
              postRequest={postRequest}
              getRequest={getRequest}
              settings={this.state.settings}
            />
          </ScrollView>

          <ScrollView
            refreshControl={refeshControl}
            removeClippedSubviews={true}>
            <SystemScreen
              postRequest={postRequest}
              getRequest={getRequest}
              session={this.state.session}
            />
          </ScrollView>
        </Swiper>
        <View style={mainStyles.viewBlocker} />
      </View>
    );
  }
}
