import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../constants/Colors';

var reloadStyles = function(isHorizontal = false, isConnected = false) {
  var styles = StyleSheet.create({
    screenView: {
      paddingBottom: 35,
    },
    mainContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      paddingTop: isHorizontal ? 20 : 0,
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      color: '#fff',
      fontFamily: 'orbitron-medium',
    },
    breakHalfContainer: {
      flexDirection: isHorizontal ? 'column' : 'row',
      flex: 1,
    },
    iconRowStyles: {
      flexDirection: isHorizontal ? 'row' : 'column',
    },
    iconInnerRow: {
      flexDirection: 'row',
      marginBottom: isHorizontal ? 40 : 0,
    },
    iconInnerRowShort: {
      paddingLeft: 35,
    },
    containerPadding: {
      paddingLeft: isHorizontal ? 30 : 15,
      paddingRight: isHorizontal ? 30 : 15,
    },
    containerPaddingLeft: {
      paddingLeft: 30,
    },
    containerPaddingRight: {
      paddingRight: 30,
    },
    containerPaddingLeftHalf: {
      paddingLeft: 15,
    },
    containerPaddingRightHalf: {
      paddingRight: 15,
    },
    containerPaddingTopHalf: {
      paddingRight: 15,
    },
    containerPaddingBottom: {
      paddingBottom: 30,
    },
    containerPaddingBottomHalf: {
      paddingBottom: 15,
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
      fontFamily: 'orbitron-medium',
    },
    titleContainer: {
      flex: 1,
      flexDirection: isHorizontal ? 'column' : 'row',
      paddingBottom: 10,
      justifyContent: isHorizontal ? 'flex-start' : 'center',
    },
    colContainer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    rowContainer: {
      flexDirection: isHorizontal ? 'column' : 'row',
      alignItems: 'flex-start',
    },
    button: {
      // default button colors
      backgroundColor: Colors.buttonColorDisabled,
      color: Colors.buttonColorDisabled,
    },
    buttonsWrapper: {
      flex: 1,
      flexDirection: 'row',
      marginBottom: 40,
    },
    buttonsContainer: {
      flex: 1,
    },
    secondaryTitleText: {
      color: !isConnected ? '#777' : '#fff',
      fontFamily: 'orbitron-medium',
      textAlign: 'left',
      fontSize: isHorizontal ? wp('2%') : wp('5%'),
      marginBottom: 20,
    },
    mainTitleText: {
      fontSize: isHorizontal ? 40 : wp('7%'),
      color: !isConnected ? '#777' : '#ff5722',
      fontFamily: 'orbitron-medium',
      textAlign: isHorizontal ? 'left' : 'center',
      marginBottom: 25,
    },
    auxText: {
      color: !isConnected ? '#777' : '#fff',
      fontFamily: 'orbitron-medium',
      fontSize: isHorizontal ? 20 : 14,
      marginBottom: 20,
    },
    normalText: {
      color: !isConnected ? '#777' : '#fff',
      fontFamily: 'Roboto',
      fontSize: isHorizontal ? 20 : 14,
      marginBottom: 20,
    },
    map: {
      width: isHorizontal ? wp('60%') : wp('100%'),
      height: isHorizontal ? hp('50%') : hp('65%'),
      marginLeft: isHorizontal ? wp('5%') : 0,
      marginBottom: hp('5%'),
      borderRadius: 50,
    },
    textRight: {
      textAlign: 'right',
    },
    textLeft: {
      textAlign: 'left',
    },
    bold: {
      fontWeight: 'bold',
    },
    textLarge: {
      fontSize: 18,
    },
  });

  return styles;
};

export default reloadStyles;
