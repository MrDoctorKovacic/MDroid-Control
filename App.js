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

// Actions
import {
  CreateSocket,
  SendToSocket,
  postRequest,
  getRequest,
} from './ui/actions/MDroidActions.js';

// Screens
import MainScreen from './ui/screens/MainScreen.js';
import ControlsScreen from './ui/screens/ControlsScreen.js';
import SettingsScreen from './ui/screens/SettingsScreen.js';
import GpsScreen from './ui/screens/GpsScreen.js';
import SystemScreen from './ui/screens/SystemScreen.js';
import PowerScreen from './ui/screens/PowerScreen.js';
import IconRow from './ui/components/IconRow.js';

import reloadStyles from './ui/styles/screen.js';
import reloadMainStyles from './ui/styles/main.js';

// Config
import {serverHost, token} from './config.json';
global.SERVER_HOST = serverHost;
global.TOKEN = token;
global.ws = undefined;
global.isConnected;

export default class App extends React.Component {
  createWebsocket() {
    global.ws = CreateSocket();
    global.ws.onclose = e => {
      // connection closed
      console.log('Websocket closed. ' + e.message);
      console.log(e.code, e.reason);
      ToastAndroid.show('Websocket closed: ' + e.message, ToastAndroid.SHORT);

      this.setState({
        isConnected: false,
      });

      // Try reconnecting
      setTimeout(() => {
        this.createWebsocket();
      }, 1500);
    };
    global.ws.onopen = () => {
      this.socketReady = false;
      this.queue = [];
    };
    global.ws.onmessage = e => {
      // a message was received
      var messages = e.data.split('\n');
      console.log(messages);
      for (var i = 0; i < messages.length; i++) {
        try {
          this.handleSocketMessage(JSON.parse(messages[i]));
        } catch (error) {
          console.log(error);
        }
      }
    };
    global.ws.onerror = e => {
      // an error occurred
      console.log(e.message);
      console.log(e.reason);
      global.ws.close();
    };
  }

  handleSocketMessage(message) {
    if (
      'output' in message &&
      'method' in message &&
      message.method !== 'request'
    ) {
      if (!this.state.isConnected) {
        this.setState({
          isConnected: true,
        });
      } else if ('status' in message && 'ok' in message && message.ok) {
        if (message.status === '/settings?min=1') {
          this.setState({
            settings: message.output,
          });
        } else if (message.status === '/session?min=1') {
          this.setState({
            session: message.output,
          });
        } else if (message.status === '/session/gps?min=1') {
          this.setState({
            gps: message.output,
          });
        } else if (message.status !== 'success') {
          // Attempt to only update the changed section
          var path = message.status.split('/');
          if (path[1] === 'session') {
            this.messageQueue.push(['GET', '/session', '']);
          } else if (path[1] === 'settings') {
            this.messageQueue.push(['GET', '/settings', '']);
          } else {
            this._requestFullUpdate();
          }
        }
      }
    }
    // Send next message
    if (this.messageQueue.length > 0) {
      var dataArray = this.messageQueue.pop();
      SendToSocket(global.ws, dataArray[0], dataArray[1], dataArray[2]);
    } else {
      this.socketReady = true;
    }
  }

  checkQueue() {
    if (this.socketReady && this.messageQueue.length !== 0) {
      this.socketReady = false;
      var dataArray = this.messageQueue.pop();
      SendToSocket(global.ws, dataArray[0], dataArray[1], dataArray[2]);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    global.isConnected = nextState.isConnected;
    if (nextState.isConnected && this.state.isConnected === false) {
      this._requestFullUpdate();
    }
  }

  _requestFullUpdate = async () => {
    console.log('Requesting full update');
    this.messageQueue.push(['GET', '/settings', '']);
    this.messageQueue.push(['GET', '/session', '']);
    this.messageQueue.push(['GET', '/session/gps', '']);
    this.checkQueue();
  };

  componentDidMount() {
    loc(this);
    this.checkQueue();
  }

  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);
    this.createWebsocket();
    this.messageQueue = [];
    this.state = {
      isConnected: false,
      refreshing: false,
      connectingOverlayHidden: false,
    };
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this._requestFullUpdate(this).then(() => {
      this.setState({refreshing: false});
    });
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
      <View style={[mainStyles.container]} onLayout={this._onLayout}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#000000"
          translucent={true}
        />

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
              settings={this.state.gps}
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
            <PowerScreen
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
