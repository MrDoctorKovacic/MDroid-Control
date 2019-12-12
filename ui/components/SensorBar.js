import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';

export default class SensorsBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles;

    styles = StyleSheet.create({
      container: {
        flexDirection: 'row',
        flex: 1,
        paddingBottom: 20,
      },
      row: {
        flexDirection: 'column',
        flex: 1,
      },
      barTextContainer: {
        flexDirection: 'row',
        flex: 1,
        paddingBottom: 5,
        alignContent: 'space-between',
      },
      barText: {
        fontSize: height < width ? 20 : 16,
        color: '#fff',
        fontFamily: 'orbitron-medium',
        flex: height < width ? 2 : 1,
        textAlign: height < width ? 'center' : 'right',
      },
      barTextValue: {
        fontSize: height < width ? 20 : 16,
        color: '#fff',
        fontFamily: 'orbitron-medium',
        flex: height < width ? 1 : 2,
        textAlign: height < width ? 'right' : 'center',
      },
      barOuterContainer: {
        flexDirection: 'row',
        borderColor: '#fb7e33',
        borderWidth: 2,
      },
    });

    this.state = {status: this.props.status};

    // Get lengths
    const redlineLength = 10;
    var fillPercent =
      this.props.fill > 100 ? '100%' : Math.round(this.props.fill) + '%'; // correct any extreme values

    var barStyles = StyleSheet.create({
      boxHeight: {
        height: Number.parseInt(this.props.barHeight, 10),
      },
      redline: {
        width: 100 - redlineLength + '%',
      },
      boxA: {
        height: Number.parseInt(this.props.barHeight, 10) - 4,
        width: fillPercent,
        backgroundColor: '#fb7e33',
      },
      boxB: {
        height: Number.parseInt(this.props.barHeight, 10) - 4,
        width: redlineLength + '%',
        backgroundColor: '#FB334C',
      },
    });

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.barTextContainer}>
            <Text style={styles.barText}>{this.props.title}</Text>
            <Text style={styles.barTextValue}>{this.props.val}</Text>
          </View>
          <View style={[styles.barOuterContainer, barStyles.boxHeight]}>
            <View style={barStyles.redline}>
              <View style={barStyles.boxA} />
            </View>
            <View style={barStyles.boxB} />
          </View>
        </View>
      </View>
    );
    /*
		} else {
			return (
				<View style={{flexDirection: 'row', flex: 1, paddingBottom: 20}}>
					<View style={{flexDirection: 'column', flex: 1}}>
						<View style={styles.barTextContainer}>
							<Text style={styles.barText}>{this.props.title}</Text>
							<Text style={styles.barTextValue}>{this.props.val}</Text>
						</View>
						<View style={[styles.barOuterContainer, {height: Number.parseInt(this.props.barHeight, 10)}]}>
							<View style={{ height: Number.parseInt(this.props.barHeight, 10)-4, width: redlineLength+"%",  backgroundColor: "#FB334C"}}></View>
							<View style={{width: 100-redlineLength+"%"}}><View style={{height: Number.parseInt(this.props.barHeight, 10)-4, width: fillPercent, backgroundColor: "#fb7e33"}}></View></View>
						</View>
					</View>
				</View>
			);
		}*/
  }
}
