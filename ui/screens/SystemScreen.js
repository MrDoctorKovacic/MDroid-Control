import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';
import CustomInput from '../components/CustomInput.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';
import DataRow from '../components/DataRow.js';

export default class SystemScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);

    this.state = {
      fails: 0,
    };
  }

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

    return (
      <View style={styles.screenView}>
        <View style={[styles.containerPadding,{paddingBottom: 40}]}>
          {Object.keys(this.props.session).sort().map(item => {
            if (typeof this.props.session[item] === 'string') {
              return (
                <DataRow title={item.toUpperCase()} value={this.props.session[item]} key={item} />
              );
            }
          })}
        </View>
      </View>
    );
  }
}
