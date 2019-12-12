import React from 'react';
import {Text, View, ScrollView, Dimensions} from 'react-native';
import {
  listenOrientationChange as loc,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import reloadStyles from '../styles/screen.js';
import ButtonGroup from '../components/ButtonGroup.js';
import ButtonGroupTitle from '../components/ButtonGroupTitle.js';

export default class ControlsScreen extends React.Component {
  componentDidMount() {
    loc(this);
  }

  componentWillUnMount() {
    rol();
  }

  constructor(props) {
    super(props);

    this.state = {
      toasted: 0,
    };
  }

  render() {
    // Responsive styling
    var {height, width} = Dimensions.get('window');
    var styles = reloadStyles(height < width, global.isConnected);

    return (
      <ScrollView removeClippedSubviews={true}>
        <View style={styles.screenView}>
          <View
            style={[
              styles.container,
              styles.containerPadding,
              styles.titleContainer,
            ]}>
            <Text style={styles.mainTitleText}>Controls</Text>
          </View>
          <View style={[styles.largeContainer, styles.colContainer]}>
            <ButtonGroupTitle title="Doors" />
            <ButtonGroup
              reference="doors"
              buttons={['Lock', 'Unlock']}
              buttonFunctions={[
                () => this.props.getRequest('/doors/lock'),
                () => this.props.getRequest('/doors/unlock'),
              ]}
            />

            <ButtonGroupTitle title="Windows" />
            <ButtonGroup
              reference="windows"
              buttons={['Up', 'Down']}
              buttonFunctions={[
                () => this.props.getRequest('/windows/up'),
                () => this.props.getRequest('/windows/down'),
              ]}
            />

            <ButtonGroupTitle title="Trunk" />
            <ButtonGroup
              reference="trunk"
              buttons={['Open']}
              buttonFunctions={[() => this.props.getRequest('/trunk/open')]}
            />

            <ButtonGroupTitle title="Hazards" />
            <ButtonGroup
              reference="hazards"
              buttons={['On', 'Off']}
              buttonFunctions={[
                () => this.props.getRequest('/hazards/on'),
                () => this.props.getRequest('/hazards/off'),
              ]}
            />

            <ButtonGroupTitle title="Flashers" />
            <ButtonGroup
              reference="flashers"
              buttons={['On', 'Off']}
              buttonFunctions={[
                () => this.props.getRequest('/flashers/on'),
                () => this.props.getRequest('/flashers/off'),
              ]}
            />

            <ButtonGroupTitle title="Radio" />
            <ButtonGroup
              reference="radio"
              buttons={['Power Toggle', 'Input Toggle']}
              buttonFunctions={[
                () => this.props.getRequest('/radio/toggle'),
                () => this.props.getRequest('/radio/mode'),
              ]}
            />
            <ButtonGroup
              reference="radio"
              buttons={['Previous', 'Next']}
              buttonFunctions={[
                () => this.props.getRequest('/radio/prev'),
                () => this.props.getRequest('/radio/next'),
              ]}
            />
            <ButtonGroup
              reference="radio"
              buttons={['Press 1', 'Press 6']}
              buttonFunctions={[
                () => this.props.getRequest('/radio/1'),
                () => this.props.getRequest('/radio/6'),
              ]}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}
