import React, { Component } from 'react';
import { Image, Dimensions, View } from 'react-native';
import { Icon, Text, Button, Row, Col } from 'native-base';
import { connect } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../constants';
import appStyles from '../theme/appStyles';
import { Screens } from '../constants/index';

class NoInternet extends React.Component {
  render() {
    const { language } = this.props;
    return (
      <View containerStyle={[{ paddingHorizontal: 32 }]}>
        <Image
          source={require('../assets/images/logo-title.png')}
          style={[
            { width: Dimensions.get('window').width - 32 },
            { height: (Dimensions.get('window').width - 32) * 0.25 },
            { marginTop: Dimensions.get('window').height * 0.15 },
            { alignSelf: 'center' },
          ]}
          resizeMode="contain"
        />

        <MaterialCommunityIcons
          name="signal-off"
          color={Colors.accentLight}
          size={70}
          style={[{ marginTop: 64 }, { alignSelf: 'center' }]}
        />
        <Text
          style={[
            { textAlign: 'center' },
            { color: Colors.textSecondary },
            { marginVertical: 30 },
            { textAlign: 'center' },
          ]}
        >
          No network detected.
          {'\n'}
          Check your internet connection.
        </Text>

        <Row>
          <Col>
            <Button
              full
              primary
              style={{ ...appStyles.btnSecontary, marginTop: 20 }}
              onPress={() => this.onPressTryAgain()}
            >
              <Text> {language.tryAgain} </Text>
            </Button>
          </Col>
        </Row>
      </View>
    );
  }

  onPressTryAgain() {
    this.props.navigation.replace(Screens.Login.route);
  }
}

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = (state) => {
  // Redux Store --> Component
  return {
    showIntro: state.auth.showIntro,
    isLoading: state.common.isLoading,
    user: state.auth.user,
    language: state.auth.language,
    languageSet: state.auth.languageSet || 0,
  };
};
export default connect(mapStateToProps)(NoInternet);
