import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

var reloadMainStyles = function(isVertical = false, isConnected = false) {
  var main = StyleSheet.create({
    container: {
      backgroundColor: '#000',
      height: hp('100%'),
      width: wp('100%'),
      flexDirection: isVertical ? 'column' : 'row',
    },
    swiperContainer: {
      marginTop: 30,
    },
    overlayText: {
      color: '#FFF',
    },
    imageContainer: {
      width: isVertical ? wp('90%') : wp('30%'),
      height: isVertical ? 'auto' : hp('70%'),
      marginBottom: 0,
      color: '#FFF',
      alignSelf: "center",
      alignContent: "center",
      flexDirection: 'column',
      zIndex: isVertical ? 0 : 2,
    },
    iconContainer: {
      flexDirection: isVertical ? 'column' : 'row',
      zIndex: isVertical ? 0 : 2,
      paddingLeft: isVertical ? 25 : wp('7%'),
    },
    mainLeftImage: {
      height: isVertical ? hp('14%') : hp('70%'),
      marginTop: 25,
      width: 'auto',
      flexDirection: 'column',
      resizeMode: 'contain',
    },
    viewBlocker: isVertical
      ? {}
      : {
          backgroundColor: '#000000',
          width: wp('30%'),
          height: hp('100%'),
          left: 0,
          position: 'absolute',
        },
  });

  return main;
};

export default reloadMainStyles;
