import React from 'react';
import { Image, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import imgs from '../assets/images';

class Logo extends React.Component {
  render() {
    return (
      <Image
        {...this.props}
        style={[
          { width: Dimensions.get('window').width - 32 },
          { height: (Dimensions.get('window').width - 32) * 0.25 },
          { marginTop: Dimensions.get('window').height * 0.15 },
          { alignSelf: 'center' },
        ]}
        source={imgs.logo}
        resizeMode="contain"
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.auth.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Logo);
