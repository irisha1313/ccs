import React from "react";
import { TouchableWithoutFeedback } from 'react-native';
import { connect } from "react-redux";

import {
  Button,
  Header, Left, Body, Right
} from 'native-base';

import appStyles from '../theme/appStyles';
import { Colors, ActionTypes } from '../constants';
import Logo from './Logo';
import Svgicon from './Svgicon';


import ModalBox from './ModalBox';
import SetLanguage from './SetLanguage';


class Headers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false
    }
  }
  render() {
    return (
      <Header transparent>
        <Left style={appStyles.row}>
          <Button transparent style={appStyles.menuBtn} onPress={() => this.props.navigation.openDrawer()}>
            <Svgicon color={Colors.black} name="menu" />
          </Button>
        </Left>
        <Body style={appStyles.rowXcenter}>
          <TouchableWithoutFeedback onPress={() => this.props.showModal()}>
            <Logo header={true} />
          </TouchableWithoutFeedback>
        </Body>
        <Right style={appStyles.row}>
          <Button transparent>
            <Svgicon color={Colors.black} name="bell" />
          </Button>
        </Right>
        <ModalBox
          visibleModal={this.state.visibleModal}
          content={<SetLanguage />}
          style={appStyles.bottomModal}
          contentStyle={appStyles.setLanguage}
        />
      </Header>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    showModal: () => {
      dispatch({ type: ActionTypes.SHOWMODAL, showModal: true })
    },
  };
};

// Exports
export default connect(mapStateToProps, mapDispatchToProps)(Headers);
