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
      width: isVertical ? wp('80%') : wp('30%'),
      height: isVertical ? 'auto' : hp('80%'),
      marginTop: isVertical ? hp('3%') : hp('15%'),
      marginBottom: isVertical ? hp('3%') : hp('0%'),
      marginLeft: isVertical ? wp('10%') : 0,
      color: '#FFF',
      flexDirection: 'row',
      zIndex: isVertical ? 0 : 2,
    },
    mainLeftImage: {
      height: isVertical ? hp('20%') : hp('80%'),
      width: isVertical ? wp('80%') : wp('20%'),
      marginLeft: isVertical ? 0 : wp('7.5%'),
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
