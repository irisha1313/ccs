import React from 'react';
import { View } from 'react-native';
import { Marker } from 'react-native-maps';
import moment from 'moment';

import {
  getFlagCoordinate,
  buildFlagMarkerLabel,
  getFlagType,
} from '../sharedMethods/flags';

import { Colors, Fonts } from '../constants';
import { FsText } from './CustomComponents';
import _ from 'lodash';

const FlagLabelMarker = (props) => {
  const { flag } = props;
  const { isDerail, isFormB } = getFlagType(flag);
  const flagCoordinates =
    !_.isNil(flag.latitude) && !_.isNil(flag.longitude)
      ? flag
      : getFlagCoordinate(flag);
  return (
    <Marker
      key={'FlagLabelMarker-Marker' + flag.id}
      coordinate={flagCoordinates}
      anchor={{ y: -0.25, x: 0.5 }}
      centerOffset={{ y: 20, x: 0 }}
      onPress={props.onPress}
    >
      <View
        style={[
          { borderRadius: 12 },
          { paddingHorizontal: 8, paddingVertical: 2 },
          { backgroundColor: Colors.offwhite + 'bb' },
        ]}
      >
        <FsText
          style={{
            color: flag.is_established ? Colors.red : Colors.text,
            fontSize: Fonts.size.xxxxsmall,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {flag.device_id
            ? `Device ${flag.deviceNumber}\nLast Seen: ${moment
                .utc(flag.timestamp_at_utc)
                .tz(flag.timezone)
                .format('MM/DD/YYYY HH:mm z')}`
            : buildFlagMarkerLabel(flag, isDerail, isFormB)}
        </FsText>
      </View>
    </Marker>
  );
};

export default FlagLabelMarker;
