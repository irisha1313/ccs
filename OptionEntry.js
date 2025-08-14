import React from 'react';
import { useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import { View } from 'native-base';
import { NavigationActions } from 'react-navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors, Icons } from '../constants';
import { FsText, FsButton } from './CustomComponents';

export default ({
  title,
  hint,
  currentValue,
  onChange,
  shouldPreventTurningOff = false,
  options = [
    'Immediately',
    '5 minutes',
    '10 minutes',
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '50 minutes',
    '1 hour',
    '1:15 hours',
    '1:30 hours',
    '1:45 hours',
  ],
}) => {
  let formattedCurrentValue;
  const dispatch = useDispatch();

  const currentValueMoment = moment(currentValue, 'HH:mm:ss');
  if (!currentValueMoment.isValid()) {
    formattedCurrentValue = 'Off';
  } else {
    const currentValueMinutes = currentValueMoment.minutes();
    const currentValueHours = currentValueMoment.hours();
    if (currentValueHours > 0) {
      if (currentValueMinutes > 0) {
        formattedCurrentValue = `${currentValueHours}:${currentValueMinutes} hours`;
      } else {
        formattedCurrentValue = `1 hour`;
      }
    } else {
      if (currentValueMinutes === 1) {
        formattedCurrentValue = 'Immediately';
      } else if (currentValueMinutes > 0) {
        formattedCurrentValue = `${currentValueMinutes} minutes`;
      }
    }
  }

  let optionsToDisplay = !options.includes('Immediately')
    ? ['Immediately', ...options]
    : options;

  if (!shouldPreventTurningOff) {
    optionsToDisplay = ['Off', ...optionsToDisplay];
  }

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: Colors.borderLightGrey,
        backgroundColor: 'white',
      }}
    >
      <FsButton
        style={{ padding: 0 }}
        onPress={() =>
          dispatch(
            NavigationActions.navigate({
              routeName: 'MultipleOptionSelectionScreen',
              params: {
                title,
                currentValue: formattedCurrentValue,
                onChange,
                options: optionsToDisplay,
                description: hint,
              },
            })
          )
        }
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              paddingLeft: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <FsText>{title} </FsText>
          </View>
          <FsText style={{ color: Colors.textGrey }}>
            {formattedCurrentValue}
          </FsText>

          <MaterialCommunityIcons
            name="chevron-right"
            size={Icons.size.xbig}
            color={Colors.primary}
            style={{ paddingRight: 5 }}
          />
        </View>
      </FsButton>
    </View>
  );
};
