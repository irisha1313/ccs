import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment-timezone';
import { Colors, Fonts, Icons } from '../constants';
import { FsText } from './CustomComponents';
import _ from 'lodash';

const OpenCloseTimeView = (props) => {
  return (
    <React.Fragment>
      <View
        style={[
          {
            ...props.containerStyle,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          },
        ]}
      >
        <FsText style={props.textStyle}>
          {props.formB &&
            moment(props.formB.open_time, 'HH:mm:ss').format('HH:mm')}
        </FsText>

        <Ionicons
          name="arrow-forward"
          size={Icons.size.small}
          color={_.defaultTo(props.color, Colors.text)}
          style={[{ marginHorizontal: 8 }]}
        />

        <FsText style={props.textStyle}>
          {props.formB &&
            moment(
              props.formB.original_close_time || props.formB.close_time,
              'HH:mm:ss'
            ).format('HH:mm')}
        </FsText>
      </View>
      <View
        style={[
          {
            ...props.containerStyle,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          },
        ]}
      >
        <FsText
          style={{ color: Colors.textLight, fontSize: Fonts.size.xxxsmall }}
        >
          {props.formB && props.formB.timezone}
        </FsText>
      </View>
    </React.Fragment>
  );
};

export default OpenCloseTimeView;
