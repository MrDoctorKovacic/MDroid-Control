import { StyleSheet } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

reloadStyles = function(isVertical = false, isConnected = false) {

  var styles = StyleSheet.create({
    mainContainer: {
      flex:1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      paddingTop: isVertical ? 20 : 0
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      color: '#fff',
      fontFamily: "orbitron-medium",
    },
    containerPadding: {
      paddingLeft: isVertical ? 30 : 15,
      paddingRight: isVertical ? 30 : 15
    },
    containerPaddingLeft: {
      paddingLeft: 30
    },
    containerPaddingRight: {
      paddingRight: 30
    },
    containerPaddingBottom: {
      paddingBottom: 30
    },
    alignTop: {
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    largeContainer: {
      flex: 3,
      flexDirection: 'row',
      alignItems: 'center',
      color: !isConnected ? '#777' : '#fff',
      fontFamily: "orbitron-medium",
    },
    titleContainer: {
      flex: 1,
      flexDirection: isVertical ? 'column' : 'row',
      paddingBottom: 20,
      justifyContent: isVertical ? 'flex-start' : 'center'
    },
    colContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    rowContainer: {
      flexDirection: isVertical ? 'column' : 'row',
      alignItems: 'flex-start'
    },
    buttonsWrapper: {
      flex: 1,
      flexDirection: 'row',
      marginBottom: 40
    },
    buttonsContainer: {
      flex: 1
    },
    secondaryTitleText: {
      color: !isConnected ? '#777' : '#fff',
      fontFamily: "orbitron-medium",
      textAlign: 'left',
      fontSize: isVertical ? 16 : wp('5%'),
      marginBottom: 20,
    },
    mainTitleText: {
      fontSize: isVertical ? 40 : wp('7%'),
      color: !isConnected ? '#777' : '#ff5722',
      fontFamily: "orbitron-medium",
      textAlign: isVertical ? 'left' : 'center',
      marginBottom: isVertical ? 0 : 25
    },
    auxText: {
      color: !isConnected ? '#777' : '#fff',
      fontFamily: "orbitron-medium",
      fontSize: isVertical ? 20 : 14,
      marginBottom: 20,
    },
    map: {
      width: isVertical ? wp("60%") : wp("100%"),
      height: isVertical ? hp("50%") : hp("65%"),
      marginLeft: isVertical ? wp("5%") : 0,
      marginBottom: hp("5%"),
      borderRadius: 50
    },
    textRight : {
      'textAlign': 'right',
    },
  });

  return styles;
}

var styles = reloadStyles();
export default styles;
